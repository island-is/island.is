import { Injectable } from '@nestjs/common'
import { verify, sign, SignOptions } from 'jsonwebtoken'

@Injectable()
export class TokenService<Data extends Record<string, unknown>> {
  jwtSecret: string

  constructor(jwtSecret: string) {
    this.jwtSecret = jwtSecret
  }

  async verifyToken(token: string): Promise<Data> {
    return new Promise((resolve, reject) =>
      verify(token, this.jwtSecret, (err, decoded) => {
        if (err) {
          return reject(err)
        }

        return resolve(decoded as Data)
      }),
    )
  }

  async createToken(data: Data, options: SignOptions = {}): Promise<string> {
    return new Promise((resolve, reject) =>
      sign(data, this.jwtSecret, options, (err, encoded) => {
        if (err || !encoded) {
          return reject(err)
        }

        return resolve(encoded)
      }),
    )
  }
}
