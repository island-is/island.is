import { Inject, Injectable } from '@nestjs/common'
import { FriggClientService } from '@island.is/clients/mms/frigg'
import { User } from '@island.is/auth-nest-tools'
import { StudentCareer } from './models/studentCareer.model'
import { unmaskString } from '@island.is/shared/utils'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'

@Injectable()
export class EducationServiceV3 {
  constructor(
    private readonly friggClientService: FriggClientService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async getStudentCareer(
    user: User,
    childId?: string,
  ): Promise<StudentCareer | null> {
    if (!childId) {
      this.logger.info('Missing child id in request')
      return null
    }

    const childNationalId = await unmaskString(childId, user.nationalId)

    if (!childNationalId) {
      this.logger.warn('Child id unmasking failed')
      return null
    }

    const data = await this.friggClientService.getUserById(
      user,
      childNationalId,
    )
    return {
      id: childNationalId,
      name: data.preferredName
        ? 'wrong object type for preferreedName'
        : data.name,
      primarySchoolCareer: {
        primarySchool: {
          id: 'wrong object type for primaryOrgId',
          name: 'missing from service',
        },
        teacher: {
          id: 'teacher id missing from service',
          name: 'teacher name missing from service',
          gradeLevel: data.gradeLevel,
        },
      },
    }
  }
}
