import fetch from 'isomorphic-fetch'
import { catchError, Observable } from 'rxjs'

import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { ConfigType } from '@nestjs/config'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import appModuleConfig from './app.config'

@Injectable()
export class EventInterceptor implements NestInterceptor {
  constructor(
    @Inject(appModuleConfig.KEY)
    private readonly config: ConfigType<typeof appModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<void> {
    return next.handle().pipe()
  }
}
