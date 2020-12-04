import { ReturnObject } from './entities/return-object';
import { CreateTokenService } from './create-token';
import { Injectable, HttpService } from '@nestjs/common';
import { Token } from './entities/token';
const https = require('https');

@Injectable()
export class AppService {
  constructor(
    private http: HttpService,
    private tokenService: CreateTokenService,
  ) {}

  async getHello(): Promise<ReturnObject> {
    const token = await this.tokenService.getToken();

    
    // const response = await this.nestDemoHelper(token); // Demo Nest Api function
    const response = await this.netCoreDemoHelper(token); // Demo .NetCore Api function

    return new ReturnObject(token, response.data);
  }

  async nestDemoHelper(token: Token) {
    return await this.http
    .get(process.env.NESTJSDEMOFUNCTION, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
      responseType: 'json',
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    })
    .toPromise();
  }

  async netCoreDemoHelper(token: Token) {
    return await this.http
    .get(process.env.NETCOREDEMOFUNCTION, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
      responseType: 'json',
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    })
    .toPromise();
  }
}
