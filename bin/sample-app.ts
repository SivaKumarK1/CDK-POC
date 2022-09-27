#!/usr/bin/env node
// import 'source-map-support/register';
// import * as cdk from 'aws-cdk-lib';
// import { SampleAppStack } from '../lib/sample-app-stack';

// const app = new cdk.App();
// new SampleAppStack(sample-app, 'SampleAppStack', {

// });

import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { SampleAppStack } from '../lib/sample-app-stack';
// import { HttpApiStack } from '../lib/httpApi-stack';

const envUSA = { region: 'us-west-2' };

const app = new cdk.App();
const fargateVpclinkStack = new SampleAppStack(app, 'SampleAppStack', { env: envUSA });
// new HttpApiStack(app, 'HttpApiStack', fargateVpclinkStack.httpVpcLink, fargateVpclinkStack.httpApiListener , { env: envUSA });
