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
@Injectable()
export class PaginatedEndorsementInterceptor implements NestInterceptor {
  constructor(private endorsementService: EndorsementService) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<PaginatedEndorsementDto> {
    const user = GqlExecutionContext.create(context).getContext().req?.user
    const listId = GqlExecutionContext.create(context).getContext().req?.params
      ?.listId
    const listOwnerNationalId = this.endorsementService.getListOwnerNationalId(
      listId,
    )
    const isListOwner = user?.nationalId === listOwnerNationalId
    return next.handle().pipe(
      map((retEndorsement: PaginatedEndorsementDto) => {
        retEndorsement.data = retEndorsement.data.map((retEndorsement) => {
          return maskEndorsement(retEndorsement, isListOwner)
        })
        return retEndorsement
      }),
    )
  }
}
