import { ApplicationApi, Configuration } from '../../gen/fetch'
import type { NewApplication } from '../../gen/fetch'

export interface ApplicationGetApplicationInformationRequest {
  applicationId: string | null
}

export class ApplicationInformationApi extends ApplicationApi {
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
