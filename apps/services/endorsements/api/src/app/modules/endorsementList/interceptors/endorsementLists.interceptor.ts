import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { PaginatedEndorsementListDto } from '../dto/paginatedEndorsementList.dto'

import { maskEndorsementList } from './endorsementList.mask'

@Injectable()
export class EndorsementListsInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<PaginatedEndorsementListDto> {
    return next.handle().pipe(
      map((retEndorsementLists: PaginatedEndorsementListDto) => {
        retEndorsementLists.data = retEndorsementLists.data.map(
          (retEndorsementList) => {
            return maskEndorsementList(retEndorsementList)
          },
        )
        return retEndorsementLists
      }),
    )
  }
}
