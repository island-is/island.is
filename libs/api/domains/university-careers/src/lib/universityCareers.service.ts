import { User } from '@island.is/auth-nest-tools'
import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import {
  StudentTrackDto,
  UniversityCareersClientService,
  UniversityId,
} from '@island.is/clients/university-careers'
import { isDefined } from '@island.is/shared/utils'
import { Locale, Organization } from '@island.is/shared/types'
import { mapToStudent, mapToStudentTrackModel } from './mapper'
import { StudentTrackTranscriptError } from './models/studentTrackTranscriptError.model'
import { StudentTrackTranscript } from './models/studentTrackTranscript.model'
import { FetchError } from '@island.is/clients/middlewares'
import { CmsContentfulService } from '@island.is/cms'
import { Institution } from './models/institution.model'
import { OrganizationSlugType } from '@island.is/shared/constants'
import { StudentTrack } from './models/studentTrack.model'

const LOG_CATEGORY = 'university-careers-api'

@Injectable()
export class UniversityCareersService {
  constructor(
    private universityCareers: UniversityCareersClientService,
    private readonly cmsContentfulService: CmsContentfulService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async getStudentTrackHistoryByUniversity(
    user: User,
    university: UniversityId,
    locale: Locale,
  ): Promise<
    Array<StudentTrackTranscript> | StudentTrackTranscriptError | null
  > {
    const data: Array<StudentTrackDto> | StudentTrackTranscriptError | null =
      await this.universityCareers
        .getStudentTrackHistory(user, university, locale)
        .catch((e: Error | FetchError) => {
          return { university, error: JSON.stringify(e) }
        })

    if (Array.isArray(data)) {
      let organization: Organization | undefined = undefined
      if (data.some((d) => !d.institution)) {
        const orgSlug =
          this.universityCareers.getOrganizationSlugType(university)
        if (!orgSlug) {
          this.logger.warning('Invalid university', {
            universityId: university,
            category: LOG_CATEGORY,
          })
          return {
            university,
            error: 'Invalid university',
          }
        }

        organization = (await this.cmsContentfulService.getOrganization(
          orgSlug,
          locale,
        )) as Organization
      }
      const institutionFallback: Institution = {
        id: organization?.slug ?? '',
        displayName: organization?.title,
      }

      return data
        .map((d) => mapToStudent(d, institutionFallback))
        .filter(isDefined)
    }

    return data
  }

  async getStudentTrack(
    user: User,
    university: OrganizationSlugType,
    trackNumber: number,
    locale: Locale,
  ): Promise<StudentTrack | null> {
    const universityEnum =
      this.universityCareers.getUniversityByOrganizationSlug(university)

    if (!universityEnum) {
      this.logger.warning('Invalid university', {
        category: LOG_CATEGORY,
        universitySlug: university,
      })
      return null
    }

    const data = await this.universityCareers.getStudentTrack(
      user,
      trackNumber,
      universityEnum,
      locale,
    )

    if (!data?.transcript) {
      this.logger.debug('No transcript data found', {
        category: LOG_CATEGORY,
        university,
      })
      return null
    }

    const organization = (await this.cmsContentfulService.getOrganization(
      university,
      locale,
    )) as Organization

    const institution: Institution = {
      id: organization.slug,
      displayName: organization.title,
    }

    return mapToStudentTrackModel(data, institution) ?? null
  }
}
