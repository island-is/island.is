import { User } from '@island.is/auth-nest-tools'
import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  CompanyDto,
  ExamineeEligibilityDto,
  PracticalExamsClientService,
  WorkMachineExamineeValidationDto,
  WorkMachineInstructorDto,
} from '@island.is/clients/practical-exams-ver'
import { ValidateInstructorInput } from './dto/validaInstructorInput.input'
import { ExamineeEligibilityInput } from './dto/examineeEligibilityInput.input'
import { ExamineeValidationInput } from './dto/examineeValidationInput.input'

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
    return this.practicalExamService.examineeEligibility(auth, input)
  }

  async getExamineeValidation(
    auth: User,
    input: ExamineeValidationInput,
  ): Promise<WorkMachineExamineeValidationDto> {
    return this.practicalExamService.validateExaminee(auth, input)
  }

  async validateInstructor(
    auth: User,
    input: ValidateInstructorInput,
  ): Promise<WorkMachineInstructorDto> {
    return this.practicalExamService.validateInstructor(auth, input)
  }
}
