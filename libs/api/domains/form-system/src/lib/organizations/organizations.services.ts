import { Inject, Injectable } from "@nestjs/common"
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import { ApolloError } from "@apollo/client"
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ApiOrganizationsPostRequest, OrganizationsApi } from "@island.is/clients/form-system"
import { CreateOrganizationInput } from "../../dto/organization.input"
import { Organization } from "../../models/organization.model"
import { Input } from "../../models/input.model"
import { ListType } from "../../models/listType.model"
import { Form } from "../../models/form.model"
import { ExternalEndpoints } from "../../models/externalEndpoints.model"

@Injectable()
export class OrganizationsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private organizationsApi: OrganizationsApi
  ) { }

  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'organizations-service'
    }
    this.logger.error(errorDetail || 'Error in organizations service', err)

    throw new ApolloError(error.message)
  }

  private handle4xx(error: any, errorDetail?: string): ApolloError | null {
    if (error.status === 403 || error.status === 404) {
      return null
    }
    return this.handleError(error, errorDetail)
  }

  private organizationsApiWithAuth(auth: User) {
    return this.organizationsApi.withMiddleware(new AuthMiddleware(auth))
  }

  async postOrganization(auth: User, input: CreateOrganizationInput): Promise<Organization> {
    const request: ApiOrganizationsPostRequest = {
      organizationCreationDto: {
        name: input.name,
        kennitala: input.nationalId,
      },
    }

    const response = await this.organizationsApiWithAuth(auth)
      .apiOrganizationsPost(request)
      .catch((e) => this.handle4xx(e, 'failed to post organization'))

    if (!response || response instanceof ApolloError) {
      return {}
    }

    const newOrg: Organization = {
      id: response.id,
      name: response.name,
      nationalId: response.kennitala,
      inputTypes: response.inputTypes as Input[],
      documentTypes: response.documentTypes,
      applicantTypes: response.applicantTypes,
      listTypes: response.listTypes as ListType[],
      externalEndpoints: response.externalEndpoints as ExternalEndpoints[],
      forms: response.forms as Form[],
    }

    return newOrg
  }
}
