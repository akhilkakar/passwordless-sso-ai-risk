#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { IdentityStack } from '../lib/identity-stack';
import { DataStack } from '../lib/data-stack';

const app = new cdk.App();
const env = { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION };

const identity = new IdentityStack(app, 'IdentityStack', { env });
new DataStack(app, 'DataStack', { env });
