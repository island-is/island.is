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
import { GqlExecutionContext } from '@nestjs/graphql'
import { EndorsementListService } from '../endorsementList.service'
import { User } from '@island.is/auth-nest-tools'

@Injectable()
export class EndorsementListsInterceptor implements NestInterceptor {
  constructor(private endorsementListService: EndorsementListService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<PaginatedEndorsementListDto>> {
    const user = GqlExecutionContext.create(context).getContext().req?.user
    const isAdmin = this.endorsementListService.hasAdminScope(user as User)
    return next.handle().pipe(
      map((retEndorsementLists: PaginatedEndorsementListDto) => {
        retEndorsementLists.data = retEndorsementLists.data.map(
          (retEndorsementList) => {
            const isListOwner = user?.nationalId === retEndorsementList.owner
            return maskEndorsementList(retEndorsementList, isListOwner, isAdmin)
          },
        )
        return retEndorsementLists
      }),
    )
  }
}
