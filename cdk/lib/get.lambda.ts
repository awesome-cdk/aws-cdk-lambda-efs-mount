import {APIGatewayProxyHandler} from "aws-lambda";
import * as fs from 'fs';
import * as os from 'os';

// Where in the mounted filesystem to store the logs
// This file persists across requests and Lambda cold-starts
const logFile = '/mnt/request-logs/requests.txt';

// Use the OS level line-ending char as separator
const separator = os.EOL;

export const handler: APIGatewayProxyHandler = async (event) => {
    fs.appendFileSync(logFile, event.requestContext.requestId + separator);

    const rows = fs.readFileSync(logFile).toString().split(separator);

    return {
        statusCode: 200,
        body: JSON.stringify({
            rows,
        }),
    }
}
