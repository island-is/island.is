import { Injectable, CanActivate, ExecutionContext, Type } from '@nestjs/common'
import { Request } from 'express'
import * as crypto from 'crypto'

const SIGNING_SECRET_ALGORITHM = 'sha256'

export function ZendeskAuthGuard(signingSecret: string): Type<CanActivate> {
  @Injectable()
  class ZendeskAuthGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request: Request = context.switchToHttp().getRequest()

      const signature = request.headers['x-zendesk-webhook-signature'] as string
      const timestamp = request.headers[
        'x-zendesk-webhook-signature-timestamp'
      ] as string
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const body = request.rawBody?.toString() ?? ''

      return this.isValidSignature(signature, body, timestamp)
    }

    isValidSignature(
      signature: string,
      body: string,
      timestamp: string,
    ): boolean {
      const hmac = crypto.createHmac(SIGNING_SECRET_ALGORITHM, signingSecret)
      const sig = hmac.update(timestamp + body).digest('base64')

      return Buffer.compare(Buffer.from(signature), Buffer.from(sig)) === 0
    }
  }

  return ZendeskAuthGuardMixin
}
