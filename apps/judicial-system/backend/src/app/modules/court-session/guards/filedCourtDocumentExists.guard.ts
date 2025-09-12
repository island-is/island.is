import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { CourtSession } from '../../repository'

@Injectable()
export class FiledCourtDocumentExistsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const courtSession: CourtSession = request.courtSession

    if (!courtSession) {
      throw new BadRequestException('Missing court session')
    }

    const courtDocumentId = request.params.courtDocumentId

    if (!courtDocumentId) {
      throw new BadRequestException('Missing court document id')
    }

    const courtDocument = courtSession.filedDocuments?.find(
      (courtDocument) => courtDocument.id === courtDocumentId,
    )

    if (!courtDocument) {
      throw new NotFoundException(
        `Court document ${courtDocumentId} of court session ${courtSession.id} does not exist`,
      )
    }

    request.courtDocument = courtDocument

    return true
  }
}
