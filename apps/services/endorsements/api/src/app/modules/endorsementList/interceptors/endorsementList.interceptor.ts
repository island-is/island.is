import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'

import { EndorsementList } from '../endorsementList.model'
import { maskEndorsementList } from './endorsementList.mask'

@Injectable()
export class EndorsementListInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<EndorsementList> {
    return next.handle().pipe(
      map((retEndorsementList: EndorsementList) => {
        return maskEndorsementList(retEndorsementList)
      }),
    )
  }
}
