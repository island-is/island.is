import { User } from '@island.is/auth-nest-tools'
import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  CompanyDto,
  ExamineeEligibilityDto,
  PracticalExamsClientService,
  WorkMachineInstructorDto,
} from '@island.is/clients/practical-exams-ver'
import { ValidateInstrutorInput } from './dto/validaInstructorInput.input'
import { ExamineeEligibilityInput } from './dto/examineeEligibilityInput.input'

@Injectable()
export class PracticalExamsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private readonly practicalExamService: PracticalExamsClientService,
  ) {}

  async isCompanyValid(auth: User, nationalId: string): Promise<CompanyDto> {
    return this.practicalExamService.isCompanyValid(auth, nationalId)
  }

  async getExamineeEligibility(
    auth: User,
    input: ExamineeEligibilityInput,
  ): Promise<ExamineeEligibilityDto[]> {
    console.log('PracticalExam.service.ts domain', input)
    return this.practicalExamService.examineeEligibility(auth, input)
  }

  async validateInstructor(
    auth: User,
    input: ValidateInstrutorInput,
  ): Promise<WorkMachineInstructorDto> {
    return this.practicalExamService.validateInstructor(auth, input)
  }
}
