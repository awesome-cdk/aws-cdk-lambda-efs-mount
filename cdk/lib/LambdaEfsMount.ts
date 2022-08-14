import * as cdk from "aws-cdk-lib";
import {RemovalPolicy} from "aws-cdk-lib";
import {LambdaIntegration, RestApi} from "aws-cdk-lib/aws-apigateway";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {Construct} from "constructs";
import * as path from "path";
import * as lambda from "aws-cdk-lib/aws-lambda";
import {FileSystem} from "aws-cdk-lib/aws-efs";
import {Vpc} from "aws-cdk-lib/aws-ec2";

export class LambdaEfsMount extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const api = new RestApi(this, "RestApi");

        const vpc = Vpc.fromLookup(this, 'DefaultVPC', {isDefault: true});

        const fileSystem = new FileSystem(this, 'MyEfsFileSystem', {
            vpc,
            removalPolicy: RemovalPolicy.DESTROY,
        });

        // create a new access point from the filesystem
        const accessPoint = fileSystem.addAccessPoint('AccessPoint', {
            // set /export/lambda as the root of the access point
            path: '/export/lambda',
            // as /export/lambda does not exist in a new efs filesystem, the efs will create the directory with the following createAcl
            createAcl: {
                ownerUid: '1001',
                ownerGid: '1001',
                permissions: '750',
            },
            // enforce the POSIX identity so lambda function will access with this identity
            posixUser: {
                uid: '1001',
                gid: '1001',
            },
        });

        const fnGet = new NodejsFunction(this, "fn-Get", {
            entry: path.resolve(__dirname, "get.lambda.ts"),
            filesystem: lambda.FileSystem.fromEfsAccessPoint(accessPoint, '/mnt/request-logs'),
            vpc,
            allowPublicSubnet: true,
        });

        api.root.addMethod("GET", new LambdaIntegration(fnGet));
    }
}
