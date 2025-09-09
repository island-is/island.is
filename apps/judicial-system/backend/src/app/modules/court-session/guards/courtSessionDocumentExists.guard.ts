import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { CourtSession } from '../../repository'

@Injectable()
export class CourtSessionDocumentExistsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const courtSession: CourtSession = request.courtSession

    if (!courtSession) {
      throw new BadRequestException('Missing court session')
    }

    const courtSessionDocumentId = request.params.courtSessionDocumentId

    if (!courtSessionDocumentId) {
      throw new BadRequestException('Missing court session document id')
    }

    const courtSessionDocument = courtSession.courtSessionDocuments?.find(
      (courtSessionDocument) => courtSessionDocument.id === courtSessionDocumentId,
    )

    if (!courtSessionDocument) {
      throw new NotFoundException(
        `Court session document ${courtSessionDocumentId} of court session ${courtSession.id} does not exist`,
      )
    }

    request.courtSessionDocument = courtSessionDocument

    return true
  }
}