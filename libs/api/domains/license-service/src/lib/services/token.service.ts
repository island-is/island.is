import { Injectable } from '@nestjs/common'
import { sign, SignOptions, verify } from 'jsonwebtoken'

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

  validateStrAsJwt(token: string): boolean {
    // JWT token consists of three parts separated by dots
    const tokenParts = token.split('.')

    // A valid JWT token should have exactly 3 parts
    if (tokenParts.length !== 3) return false

    // Each part should be non-empty
    return !tokenParts.some((part) => !part)
  }
}
