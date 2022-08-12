#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { LambdaEfsMount as LambdaEfsMount } from "../lib/LambdaEfsMount";

const app = new cdk.App();
new LambdaEfsMount(app, "LambdaEfsMount", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
