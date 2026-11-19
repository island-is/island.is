import { ForbiddenException, Injectable } from '@nestjs/common'
import kennitala from 'kennitala'

import type { User } from '@island.is/auth-nest-tools'
import { DirectorateOfEqualityClientService } from '@island.is/clients/directorate-of-equality'

import { SubmissionsInput } from './dto/submissions.input'
import { mapSubmission } from './mapper'
import { Submissions } from './models/submissions.model'

@Injectable()
export class DirectorateOfEqualityService {
  constructor(
    private readonly directorateOfEqualityClientService: DirectorateOfEqualityClientService,
  ) {}

  private assertCompany(user: User) {
    if (!kennitala.isCompany(user.nationalId)) {
      throw new ForbiddenException()
    }
  }

  async getSubmissions(
    user: User,
    input: SubmissionsInput,
  ): Promise<Submissions> {
    this.assertCompany(user)
    const { reports } =
      await this.directorateOfEqualityClientService.getReports(user)
    return {
      items: reports
        .map(mapSubmission)
        .filter((submission) => submission.type === input.type),
    }
  }
}
