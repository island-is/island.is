import { Observable } from 'rxjs'

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

import {
  CaseFileCategory,
  CaseState,
  CaseTransition,
  isIndictmentCase,
  isTrafficViolationCase,
  User,
} from '@island.is/judicial-system/types'

import { nowFactory } from '../../../factories'
import { AwsS3Service } from '../../aws-s3'
import { EventLogService } from '../../event-log'
import { TransitionCaseDto } from '../dto/transitionCase.dto'
import { Case } from '../models/case.model'
import { PDFService } from '../pdf.service'

@Injectable()
export class TransitionInterceptor implements NestInterceptor {
  constructor(
    private readonly eventLogService: EventLogService,
    private readonly awsService: AwsS3Service,
    private readonly pdfService: PDFService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Case>> {
    const request = context.switchToHttp().getRequest()
    const theCase: Case = request.case
    const dto: TransitionCaseDto = request.body
    const user: User = request.user

    if (
      isIndictmentCase(theCase.type) &&
      !isTrafficViolationCase(theCase) &&
      theCase.state === CaseState.WAITING_FOR_CONFIRMATION &&
      dto.transition === CaseTransition.SUBMIT
    ) {
      // TODO: move
      for (const indictment of theCase.caseFiles?.filter(
        (cf) => cf.category === CaseFileCategory.INDICTMENT && cf.key,
      ) ?? []) {
        if (!indictment.key) {
          continue
        }

        // Get indictment PDF from S3
        const file = await this.awsService.getObject(
          theCase.type,
          theCase.state,
          indictment.key,
        )

        // Create a stamped indictment PDF
        const confirmedIndictment =
          await this.pdfService.getConfirmedIndictmentPdf(
            {
              actor: user.name,
              institution: user.institution?.name ?? '',
              date: nowFactory(),
            },
            file,
          )

        // Save the PDF to S3
        await this.awsService.putConfirmedObject(
          theCase.type,
          theCase.state,
          indictment.key,
          confirmedIndictment.toString('binary'),
        )
      }
    }

    return next.handle()
  }
}
