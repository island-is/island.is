import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Endorsement } from '../models/endorsement.model'
import { maskEndorsement } from './endorsement.mask'

@Injectable()
export class EndorsementInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Endorsement> {
    return next.handle().pipe(
      map((retEndorsement: Endorsement) => {
        return maskEndorsement(retEndorsement)
      }),
    )
  }
}
