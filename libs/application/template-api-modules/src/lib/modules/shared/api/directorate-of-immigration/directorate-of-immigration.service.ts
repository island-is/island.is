import { Injectable } from '@nestjs/common'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../../types'
import {
  DirectorateOfImmigrationClient,
  OptionSetItem,
  ResidenceAbroadViewModel,
  TravelDocumentViewModel,
} from '@island.is/clients/directorate-of-immigration'

@Injectable()
export class DirectorateOfImmigrationService extends BaseTemplateApiService {
  constructor(
    private readonly directorateOfImmigrationClient: DirectorateOfImmigrationClient,
  ) {
    super('DirectorateOfImmigrationShared')
  }

  async getCountries(): Promise<OptionSetItem[]> {
    return this.directorateOfImmigrationClient.getCountries()
  }

  async getTravelDocumentTypes(): Promise<OptionSetItem[]> {
    return this.directorateOfImmigrationClient.getTravelDocumentTypes()
  }

  async getCurrentStayAbroadList({
    auth,
  }: TemplateApiModuleActionProps): Promise<ResidenceAbroadViewModel[]> {
    return this.directorateOfImmigrationClient.getCurrentStayAbroadList(auth)
  }

  async getCurrentPassportItem({
    auth,
  }: TemplateApiModuleActionProps): Promise<
    TravelDocumentViewModel | undefined
  > {
    return this.directorateOfImmigrationClient.getCurrentPassportItem(auth)
  }
}
