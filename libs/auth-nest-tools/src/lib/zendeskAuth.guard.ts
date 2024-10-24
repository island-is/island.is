import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import * as crypto from 'crypto'

import { RawBodyRequest } from './rawBodyRequest.type'

const SIGNING_SECRET_ALGORITHM = 'sha256'

@Injectable()
export class ZendeskAuthGuard implements CanActivate {
  constructor(private secret: string | undefined) {
    if (!secret) {
      throw new Error('ZendeskAuthGuard: secret is required')
    }
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RawBodyRequest>()

    const signature = request.headers['x-zendesk-webhook-signature'] as string
    const timestamp = request.headers[
      'x-zendesk-webhook-signature-timestamp'
    ] as string
    const body = request.rawBody?.toString() ?? ''

    return this.isValidSignature(signature, body, timestamp)
  }

  isValidSignature(
    signature: string,
    body: string,
    timestamp: string,
  ): boolean {
    const hmac = crypto.createHmac(
      SIGNING_SECRET_ALGORITHM,
      this.secret as string,
    )
    const sig = hmac.update(timestamp + body).digest('base64')

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(sig))
  }
}
