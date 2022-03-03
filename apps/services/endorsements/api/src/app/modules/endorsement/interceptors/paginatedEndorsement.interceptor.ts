import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { PaginatedEndorsementDto } from '../dto/paginatedEndorsement.dto'

import { maskEndorsement } from './endorsement.mask'

@Injectable()
export class PaginatedEndorsementInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<PaginatedEndorsementDto> {
    return next.handle().pipe(
      map((retEndorsement: PaginatedEndorsementDto) => {
        retEndorsement.data = retEndorsement.data.map((retEndorsement) => {
          return maskEndorsement(retEndorsement)
        })
        return retEndorsement
      }),
    )
  }
}
