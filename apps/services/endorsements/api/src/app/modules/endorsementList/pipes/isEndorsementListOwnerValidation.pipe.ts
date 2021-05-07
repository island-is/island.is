import {
  Inject,
  Injectable,
  MethodNotAllowedException,
  PipeTransform,
} from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { EndorsementList } from '../endorsementList.model'
import { Request } from 'express'

interface AuthRequest extends Request {
  auth: {
    nationalId: string
  }
}

@Injectable()
export class IsEndorsementListOwnerValidationPipe
  implements PipeTransform<EndorsementList, EndorsementList> {
  constructor(
    @Inject(REQUEST)
    private context: AuthRequest,
  ) {}

  transform(value: EndorsementList): EndorsementList {
    const { nationalId } = this.context.auth

    // we check if the current user is the owner of the requested list
    if (value.owner !== nationalId) {
      throw new MethodNotAllowedException(
        `Current user is not the owner of list ${value}`,
      )
    }

    return value
  }
}
