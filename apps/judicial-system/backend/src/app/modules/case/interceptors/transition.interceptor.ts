import flatten from 'lodash/flatten'
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
  CaseType,
  EventType,
  IndictmentSubtype,
  isIndictmentCase,
  User,
} from '@island.is/judicial-system/types'

import { AwsS3Service } from '../../aws-s3'
import { EventLogService } from '../../event-log'
import { Case } from '../models/case.model'

@Injectable()
export class TransitionInterceptor implements NestInterceptor {
  constructor(
    private readonly eventLogService: EventLogService,
    private readonly awsService: AwsS3Service,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<Case> {
    const isTrafficViolationCase = (workingCase: Case): boolean => {
      if (
        !workingCase.indictmentSubtypes ||
        workingCase.type !== CaseType.INDICTMENT
      ) {
        return false
      }

      const flatIndictmentSubtypes = flatten(
        Object.values(workingCase.indictmentSubtypes),
      )

      return Boolean(
        !(
          workingCase.caseFiles &&
          workingCase.caseFiles.find(
            (file) => file.category === CaseFileCategory.INDICTMENT,
          )
        ) &&
          flatIndictmentSubtypes.length > 0 &&
          flatIndictmentSubtypes.every(
            (val) => val === IndictmentSubtype.TRAFFIC_VIOLATION,
          ),
      )
    }

    const request = context.switchToHttp().getRequest()
    const theCase: Case = request.body
    const user: User = request.user

    if (
      isIndictmentCase(theCase.type) &&
      !isTrafficViolationCase(theCase) &&
      theCase.state === CaseState.SUBMITTED
    ) {
      console.log('asd')
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
