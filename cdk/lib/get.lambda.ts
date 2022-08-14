import {APIGatewayProxyHandler} from "aws-lambda";
import * as fs from 'fs';

export const handler: APIGatewayProxyHandler = async (event) => {
    const readResult = fs.readdirSync('/mnt/request-logs');
    return {
        statusCode: 200,
        body: JSON.stringify({
            readResult,
        }),
    }
}
