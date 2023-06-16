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

@Injectable()
export class EndorsementInterceptor implements NestInterceptor {
  constructor(private endorsementService: EndorsementService) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Endorsement> {
    const user = GqlExecutionContext.create(context).getContext().req?.user
    const listId = GqlExecutionContext.create(context).getContext().req?.params
      ?.listId
    const listOwnerNationalId = this.endorsementService.getListOwnerNationalId(
      listId,
    )
    const isListOwner = user?.nationalId === listOwnerNationalId
    return next.handle().pipe(
      map((retEndorsement: Endorsement) => {
        console.log('EndorsementInterceptor: retEndorsement: ', retEndorsement)
        return maskEndorsement(retEndorsement, isListOwner)
      }),
    )
  }
}
