import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'

import { maskEndorsement } from './endorsement.mask'
import { PaginatedEndorsementDto } from '../dto/paginatedEndorsement.dto'

@Injectable()
export class PaginatedEndorsementInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<PaginatedEndorsementDto> {
    return next.handle().pipe(
      map((retEndorsement: PaginatedEndorsementDto) => {
        retEndorsement.data = retEndorsement.data.map(
          (retEndorsement) => {
            return maskEndorsement(retEndorsement)
          },
        )
        return retEndorsement
      }),
    )
  }
}
