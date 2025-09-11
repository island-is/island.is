import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { Case } from '../../repository'

@Injectable()
export class UnfiledCourtDocumentExistsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const theCase: Case = request.case

    if (!theCase) {
      throw new BadRequestException('Missing case')
    }

    const courtDocumentId = request.params.courtDocumentId

    if (!courtDocumentId) {
      throw new BadRequestException('Missing court document id')
    }

    const courtDocument = theCase.unfiledCourtDocuments?.find(
      (courtDocument) => courtDocument.id === courtDocumentId,
    )

    if (!courtDocument) {
      throw new NotFoundException(
        `Unfiled court document ${courtDocumentId} of case ${theCase.id} does not exist`,
      )
    }

    request.courtDocument = courtDocument

    return true
  }
}
