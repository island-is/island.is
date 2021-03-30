import { Inject, Injectable } from '@nestjs/common'

import { Configuration, Organisation, OrganisationsApi } from '../../gen/fetch'
import { CreateOrganisationInput } from './types'

@Injectable()
export class ClientsDocumentProviderService {
  constructor(
    @Inject('SERVICE_DOCUMENTS_BASEPATH')
    private basePath: string,
  ) {
    this.organisationsApi = new OrganisationsApi(
      new Configuration({
        fetchApi: fetch,
        basePath: this.basePath,
      }),
    )
  }

  private organisationsApi: OrganisationsApi

  async createOrganisation(
    input: CreateOrganisationInput,
    authorization: string,
  ): Promise<Organisation> {
    const dto = {
      createOrganisationDto: { ...input },
      authorization,
    }

    return await this.organisationsApi.organisationControllerCreateOrganisation(
      dto,
    )
  }
}
