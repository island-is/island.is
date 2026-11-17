import { Configuration } from '../../gen/fetch'
import type { NewApplication } from '../../gen/fetch'
import { VmstApplicationApi } from './applicationApi'

export interface ApplicationGetApplicationInformationRequest {
  applicationId: string | null
}

export class ApplicationInformationApi extends VmstApplicationApi {
  constructor(configuration: Configuration) {
    super(configuration)
  }

  async applicationGetApplicationInformation(
    request: ApplicationGetApplicationInformationRequest,
  ): Promise<NewApplication> {
    const { application } = await this.applicationGetApplication(request)

    if (!application) {
      throw new Error(
        `VMST returned no application for ${request.applicationId}`,
      )
    }

    return application
  }
}
