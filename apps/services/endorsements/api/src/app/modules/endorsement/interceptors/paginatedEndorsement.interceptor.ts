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
import { GqlExecutionContext } from '@nestjs/graphql'
import { EndorsementService } from '../endorsement.service'
import { User } from '@island.is/auth-nest-tools'
import { EndorsementListService } from '../../endorsementList/endorsementList.service'
@Injectable()
export class PaginatedEndorsementInterceptor implements NestInterceptor {
  constructor(
    private endorsementService: EndorsementService,
    private endorsementListService: EndorsementListService,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<PaginatedEndorsementDto>> {
    const user = GqlExecutionContext.create(context).getContext().req?.user
    const listId =
      GqlExecutionContext.create(context).getContext().req?.params?.listId
    const listOwnerNationalId =
      await this.endorsementListService.getListOwnerNationalId(listId)
    const isListOwner = user?.nationalId === listOwnerNationalId
    const isAdmin = this.endorsementListService.hasAdminScope(user as User)

    return next.handle().pipe(
      map((retEndorsement: PaginatedEndorsementDto) => {
        retEndorsement.data = retEndorsement.data.map((retEndorsement) => {
          return maskEndorsement(retEndorsement, isListOwner, isAdmin)
        })
        return retEndorsement
      }),
    )
  }
}
