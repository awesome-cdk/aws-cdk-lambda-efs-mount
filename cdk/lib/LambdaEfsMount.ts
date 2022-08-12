import * as cdk from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";

export class LambdaEfsMount extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const api = new RestApi(this, "RestApi");

    const fnGet = new NodejsFunction(this, "fn-Get", {
      entry: path.resolve(__dirname, "get.lambda.ts"),
    });
    api.root.addMethod("GET", new LambdaIntegration(fnGet));

    const fnPost = new NodejsFunction(this, "fn-Post", {
      entry: path.resolve(__dirname, "post.lambda.ts"),
    });
    api.root.addMethod("POST", new LambdaIntegration(fnGet));
  }
}
