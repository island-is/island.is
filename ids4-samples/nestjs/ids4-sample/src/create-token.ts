import { Injectable, HttpService } from '@nestjs/common';
import { Token } from './entities/token';
const https = require('https');
const qs = require('querystring')

@Injectable()
export class CreateTokenService {
  constructor(private http: HttpService) {}

  async getToken(): Promise<Token> {
    const body = {
      grant_type: process.env.GRANT_TYPE,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      scope: process.env.SCOPE,
    };

    const response = await this.http
      .post(
        process.env.IDENTITYSERVERURL,
        qs.stringify(body),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          responseType: 'json',
          httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        },
      )
      .toPromise();

    return response.data;
  }
}
