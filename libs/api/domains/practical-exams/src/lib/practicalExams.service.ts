import { User } from '@island.is/auth-nest-tools'
import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  PracticalExamsClientService,
  WorkMachineInstructorDto,
} from '@island.is/clients/practical-exams-ver'
import { ValidateInstrutorInput } from './dto/validaInstructorInput.input'

@Injectable()
export class PracticalExamsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private readonly practicalExamService: PracticalExamsClientService,
  ) {}

  async validateInstructor(
    auth: User,
    input: ValidateInstrutorInput,
  ): Promise<WorkMachineInstructorDto> {
    return this.practicalExamService.validateInstructor(auth, input)
  }
}
