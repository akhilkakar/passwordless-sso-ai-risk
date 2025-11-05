import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';

export class IdentityStack extends cdk.Stack {
  public readonly userPool: cognito.UserPool;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.userPool = new cognito.UserPool(this, 'UserPool', {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      mfa: cognito.Mfa.OPTIONAL
    });

    // Enable passkeys (FIDO2) for the user pool
    // In CDK, WebAuthn/passkeys are managed via advanced settings; exact API may change.
    // You may need to enable Passkey in the console if API support is limited in your CDK version.

    const client = new cognito.UserPoolClient(this, 'AppClient', {
      userPool: this.userPool,
      generateSecret: false,
      oAuth: {
        flows: { authorizationCodeGrant: true },
        scopes: [cognito.OAuthScope.OPENID, cognito.OAuthScope.EMAIL, cognito.OAuthScope.PROFILE],
        callbackUrls: ['http://localhost:3000/callback'],
        logoutUrls: ['http://localhost:3000/']
      }
    });

    new cognito.UserPoolDomain(this, 'Domain', {
      userPool: this.userPool,
      cognitoDomain: {
        domainPrefix: `passkeys-demo-${cdk.Stack.of(this).account?.slice(-6)}`
      }
    });

    new cdk.CfnOutput(this, 'UserPoolId', { value: this.userPool.userPoolId });
    new cdk.CfnOutput(this, 'AppClientId', { value: client.userPoolClientId });
    new cdk.CfnOutput(this, 'Region', { value: cdk.Stack.of(this).region });
  }
}
