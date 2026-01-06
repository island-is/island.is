import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { Case } from '../../repository'

@Injectable()
export class SplitCaseFileExistsGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const theCase: Case = request.case

    if (!theCase) {
      throw new BadRequestException('Missing case')
    }

    const fileId = request.params.fileId

    if (!fileId) {
      throw new BadRequestException('Missing file id')
    }

    const allCaseFiles = theCase.caseFiles ?? []

    for (const splitCase of theCase.splitCases ?? []) {
      allCaseFiles.push(...(splitCase.caseFiles ?? []))
    }

    const caseFile = allCaseFiles.find((file) => file.id === fileId)

    if (!caseFile) {
      throw new NotFoundException(
        `Case file ${fileId} of case ${theCase.id} does not exist`,
      )
    }

    request.caseFile = caseFile

    return true
  }
}
