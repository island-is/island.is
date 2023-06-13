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
import { User } from '@island.is/auth-nest-tools'
import { GqlExecutionContext } from '@nestjs/graphql'
import { EndorsementListService } from '../endorsementList.service'

@Injectable()
export class EndorsementListInterceptor implements NestInterceptor {
  constructor(private endorsementListService: EndorsementListService) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<EndorsementList> {
    const user = GqlExecutionContext.create(context).getContext().req?.user
    const isAdmin = this.endorsementListService.hasAdminScope(user as User)

    return next.handle().pipe(
      map((retEndorsementList: EndorsementList) => {
        return maskEndorsementList(retEndorsementList, isAdmin)
      }),
    )
  }
}
