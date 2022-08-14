import {APIGatewayProxyHandler} from "aws-lambda";
import * as fs from 'fs';
import * as os from 'os';

const logFile = '/mnt/request-logs/requests.txt';

export const handler: APIGatewayProxyHandler = async (event) => {
    fs.appendFileSync(logFile, event.requestContext.requestId + os.EOL);

    const rows = fs.readFileSync(logFile).toString().split(os.EOL);

    return {
        statusCode: 200,
        body: JSON.stringify({
            rows,
        }),
    }
}
