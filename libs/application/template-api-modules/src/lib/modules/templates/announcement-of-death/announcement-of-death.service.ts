import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  SyslumennService,
  Person,
  Attachment,
  PersonType,
  DataUploadResponse,
} from '@island.is/clients/syslumenn'
import { FasteignirApi } from '@island.is/clients/assets'
import { NationalRegistry, RealEstateAddress } from './types'
import {
  ApplicationWithAttachments as Application,
  getValueViaPath,
} from '@island.is/application/core'
import { SharedTemplateApiService } from '../../shared'
import { generateTestEmail } from './emailGenerators'
import { EinstaklingarApi } from '@island.is/clients/national-registry-v2'

@Injectable()
export class AnnouncementOfDeathService {
  constructor(
    private readonly nationalRegistryPersonApi: EinstaklingarApi,
    private readonly syslumennService: SyslumennService,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly fasteignirApi: FasteignirApi,
  ) {}

  async sendTestEmail({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.sendEmail(
      generateTestEmail,
      application,
    )
  }

  async addressLookupByRealEstateId({ application }: TemplateApiModuleActionProps): Promise<RealEstateAddress> {
    // TODO correctly access inputted assetId
    const assetId: string = application.answers.addedAssetId
    const realEstate = await this.fasteignirApi.fasteignirGetFasteign({ fasteignanumer: assetId })
    const address = realEstate.sjalfgefidStadfang
    return Promise.resolve({
      addressNumber: address?.stadfanganumer ?? -1,
      landNumber: address?.landeignarnumer ?? -1,
      postalCode: address?.postnumer ?? -1,
      municipality: address?.sveitarfelagBirting ?? '',
      display: address?.birting ?? '',
      displayShort: address?.birtingStutt ?? '',
    })
  }

  async submitApplication({ application }: TemplateApiModuleActionProps) {
    return { success: true }
  }
}
