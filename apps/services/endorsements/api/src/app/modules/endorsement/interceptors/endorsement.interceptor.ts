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
import { GqlExecutionContext } from '@nestjs/graphql'
import { EndorsementService } from '../endorsement.service'
import { EndorsementListService } from '../../endorsementList/endorsementList.service'
import { User } from '@island.is/auth-nest-tools'
@Injectable()
export class EndorsementInterceptor implements NestInterceptor {
  constructor(
    private endorsementService: EndorsementService,
    private endorsementListService: EndorsementListService,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Endorsement>> {
    const user = GqlExecutionContext.create(context).getContext().req?.user
    const listId =
      GqlExecutionContext.create(context).getContext().req?.params?.listId
    const listOwnerNationalId =
      await this.endorsementListService.getListOwnerNationalId(listId)
    const isListOwner = user?.nationalId === listOwnerNationalId
    const isAdmin = this.endorsementListService.hasAdminScope(user as User)
    return next.handle().pipe(
      map((retEndorsement: Endorsement) => {
        return maskEndorsement(retEndorsement, isListOwner, isAdmin)
      }),
    )
  }
}
