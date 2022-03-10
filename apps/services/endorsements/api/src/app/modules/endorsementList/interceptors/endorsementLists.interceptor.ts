import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'

import { maskEndorsementList } from './endorsementList.mask'
import { PaginatedEndorsementListDto } from '../dto/paginatedEndorsementList.dto'

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
