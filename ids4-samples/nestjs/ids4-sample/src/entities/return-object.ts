import { DemoApiResult } from './demo-api-result';
import { Token } from "./token";

export class ReturnObject {
    constructor(tokenData: Token, result: DemoApiResult) {
        this.success = false;
        this.clientCredentialsToken = tokenData;
        this.sampleApiResult = result;
    }

    success: boolean;
    clientCredentialsToken: Token;
    sampleApiResult: DemoApiResult;
}