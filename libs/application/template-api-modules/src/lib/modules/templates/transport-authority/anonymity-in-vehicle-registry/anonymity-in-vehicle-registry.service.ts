import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'

@Injectable()
export class AnonymityInVehicleRegistryService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {}
}
