import { Injectable } from '@nestjs/common'
import { CmsContentfulService } from '@island.is/cms'
import { ChargeFjsV2ClientService } from '@island.is/clients/charge-fjs-v2'

import { GetChargeItemCodesByCourseIdInput } from './dto/getChargeItemCodesByCourseId.input'
import {
  ChargeItemCodeByCourseIdItem,
  ChargeItemCodeByCourseIdResponse,
} from './models/chargeItemCodeByCourseId.model'

@Injectable()
export class CourseChargesService {
  constructor(
    private readonly cmsContentfulService: CmsContentfulService,
    private readonly chargeFjsV2ClientService: ChargeFjsV2ClientService,
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
}
