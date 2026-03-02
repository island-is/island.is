import { Inject, Injectable } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import axios from 'axios'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { CmsContentfulService } from '@island.is/cms'
import { ChargeFjsV2ClientService } from '@island.is/clients/charge-fjs-v2'

import { GetChargeItemCodesByCourseIdInput } from './dto/getChargeItemCodesByCourseId.input'
import {
  ChargeItemCodeByCourseIdItem,
  ChargeItemCodeByCourseIdResponse,
} from './models/chargeItemCodeByCourseId.model'
import { GetCourseAvailabilityInput } from './dto/getCourseAvailability.input'
import {
  CourseAvailabilityResponse,
  CourseInstanceAvailability,
} from './models/courseAvailability.model'
import { CourseAvailabilityConfig } from './courseAvailability.config'

const NATIONAL_ID_REGEX = /Kennitala þátttakanda \d+: (\d{10})/g

@Injectable()
export class CourseChargesService {
  constructor(
    private readonly cmsContentfulService: CmsContentfulService,
    private readonly chargeFjsV2ClientService: ChargeFjsV2ClientService,
    @Inject(CourseAvailabilityConfig.KEY)
    private readonly courseAvailabilityConfig: ConfigType<
      typeof CourseAvailabilityConfig
    >,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async getChargeItemCodesByCourseId(
    input: GetChargeItemCodesByCourseIdInput,
  ): Promise<ChargeItemCodeByCourseIdResponse> {
    const kennitala =
      await this.cmsContentfulService.getCourseOrganizationKennitala(
        input.courseId,
      )

    if (!kennitala) {
      return { items: [] }
    }

    const catalog =
      await this.chargeFjsV2ClientService.getCatalogByPerformingOrg({
        performingOrgID: kennitala,
      })

    const items: ChargeItemCodeByCourseIdItem[] = catalog.item.map((item) => ({
      code: item.chargeItemCode,
      name: item.chargeItemName,
      priceAmount: item.priceAmount,
    }))

    return { items }
  }

  async getCourseAvailability(
    input: GetCourseAvailabilityInput,
  ): Promise<CourseAvailabilityResponse> {
    const courseDetails = await this.cmsContentfulService.getCourseById({
      id: input.courseId,
      lang: 'is',
    })

    if (!courseDetails?.course) {
      return { instances: [] }
    }

    const instances: CourseInstanceAvailability[] = await Promise.all(
      courseDetails.course.instances.map(async (instance) => {
        const maxRegistrations = instance.maxRegistrations ?? 0

        if (maxRegistrations <= 0) {
          return { id: instance.id, isFullyBooked: false }
        }

        try {
          const registeredCount =
            await this.getZendeskRegistrationCount(instance.id)
          return {
            id: instance.id,
            isFullyBooked: registeredCount >= maxRegistrations,
          }
        } catch {
          this.logger.warn(
            'Failed to fetch Zendesk registration count for course instance',
            { courseInstanceId: instance.id },
          )
          return { id: instance.id, isFullyBooked: null }
        }
      }),
    )

    return { instances }
  }

  private async getZendeskRegistrationCount(
    courseInstanceId: string,
  ): Promise<number> {
    const { zendeskSubjectPrefix, zendeskSubdomain, zendeskEmail, zendeskToken } =
      this.courseAvailabilityConfig

    const subject = `${zendeskSubjectPrefix} - ${courseInstanceId}`
    const query = `type:ticket subject:"${subject}"`
    const baseUrl = `https://${zendeskSubdomain}.zendesk.com/api/v2`
    const auth = {
      username: `${zendeskEmail}/token`,
      password: zendeskToken,
    }

    const nationalIds = new Set<string>()
    let url: string | null =
      `${baseUrl}/search.json?per_page=100&query=${encodeURIComponent(query)}`

    while (url) {
      const response = await axios.get<{
        results: Array<{ description?: string }>
        next_page?: string | null
      }>(url, { auth })

      for (const ticket of response.data.results) {
        if (!ticket.description) continue
        const matches = ticket.description.matchAll(NATIONAL_ID_REGEX)
        for (const match of matches) {
          nationalIds.add(match[1])
        }
      }

      url = response.data.next_page ?? null
    }

    return nationalIds.size
  }
}
