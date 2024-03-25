import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

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
  EventType,
  isIndictmentCase,
  isTrafficViolationCase,
  User,
} from '@island.is/judicial-system/types'

import { nowFactory } from '../../../factories'
import { formatConfirmedIndictmentKey } from '../../../formatters/formatters'
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
      !isTrafficViolationCase(theCase.indictmentSubtypes, theCase.type) &&
      theCase.state === CaseState.WAITING_FOR_CONFIRMATION &&
      dto.transition === CaseTransition.SUBMIT
    ) {
      for (const indictment of theCase.caseFiles?.filter(
        (cf) => cf.category === CaseFileCategory.INDICTMENT && cf.key,
      ) ?? []) {
        // Get indictment PDF from S3
        const file = await this.awsService.getObject(indictment.key ?? '')

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
        await this.awsService.putObject(
          formatConfirmedIndictmentKey(indictment.key),
          confirmedIndictment.toString('binary'),
        )
      }
    }

    return next.handle().pipe(
      map((data: Case) => {
        if (isIndictmentCase(data.type) && data.state === CaseState.SUBMITTED) {
          this.eventLogService.create({
            eventType: EventType.INDICTMENT_CONFIRMED,
            caseId: data.id,
            nationalId: user.nationalId,
            userRole: user.role,
          })
        }

        return data
      }),
    )
  }
}
