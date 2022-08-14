import {APIGatewayProxyHandler} from "aws-lambda";
import * as fs from 'fs';
import * as os from 'os';

const logFile = '/mnt/request-logs/requests.txt';
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
