import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import {
  ApiFormsFormIdDeleteRequest,
  ApiFormsFormIdGetRequest,
  ApiFormsFormIdPutRequest,
  ApiFormsOrganizationOrganizationIdGetRequest,
  FormUpdateDto,
  FormsApi,
  ApiFormsFormIdSettingsPutRequest,
  FormSettingsUpdateDto,
} from '@island.is/clients/form-system'
import { ApolloError } from '@apollo/client'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  CreateFormInput,
  DeleteFormInput,
  GetFormInput,
  GetFormsInput,
  UpdateFormInput,
} from '../../dto/forms.input'
import { FormResponse } from '../../models/formResponse.model'
import { FormListResponse } from '../../models/formListResponse.model'
import { UpdateFormSettingsInput } from '../../dto/updateFormSettings.input'
import { handle4xx } from '../../utils/errorHandler'

@Injectable()
export class FormsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private formsApi: FormsApi,
  ) {}

  // eslint-disable-next-line
  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'forms-service',
    }
    this.logger.error(errorDetail || 'Error in forms service', err)

    throw new ApolloError(error.message)
  }

  private formsApiWithAuth(auth: User) {
    return this.formsApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getForm(auth: User, input: GetFormInput): Promise<FormResponse> {
    const request: ApiFormsFormIdGetRequest = {
      formId: input.id,
    }

    const response = await this.formsApiWithAuth(auth)
      .apiFormsFormIdGet(request)
      .catch((e) =>
        handle4xx(e, this.handleError, 'failed to get form from Id'),
      )

    if (!response || response instanceof ApolloError) {
      return {}
    }
    return response as FormResponse
  }

  async getForms(auth: User, input: GetFormsInput): Promise<FormListResponse> {
    const request: ApiFormsOrganizationOrganizationIdGetRequest = {
      organizationId: input.organizationId,
    }
    const response = await this.formsApiWithAuth(auth)
      .apiFormsOrganizationOrganizationIdGet(request)
      .catch((e) =>
        handle4xx(
          e,
          this.handleError,
          'failed to get forms from organization Id',
        ),
      )

    if (!response || response instanceof ApolloError) {
      return {}
    }

    return response as FormListResponse
  }

  async postForm(auth: User, input: CreateFormInput): Promise<FormResponse> {
    const request: ApiFormsOrganizationOrganizationIdGetRequest = {
      organizationId: input.organizationId,
    }
    const response = await this.formsApiWithAuth(auth)
      .apiFormsOrganizationIdPost(request)
      .catch((e) => handle4xx(e, this.handleError, 'failed to create form'))

    if (!response || response instanceof ApolloError) {
      return {}
    }

    return response
  }

  async deleteForm(auth: User, input: DeleteFormInput): Promise<void> {
    const request: ApiFormsFormIdDeleteRequest = {
      formId: input.id,
    }
    await this.formsApiWithAuth(auth)
      .apiFormsFormIdDelete(request)
      .catch((e) => handle4xx(e, this.handleError, 'failed to delete form'))

    return
  }

  async updateForm(auth: User, input: UpdateFormInput): Promise<void> {
    const formattedForm = {
      ...input.form,
      id: input.formId,
      inputsList: input.form?.inputsList?.map((input) => {
        return input
      }),
    }

    const request: ApiFormsFormIdPutRequest = {
      formId: input.formId,
      formUpdateDto: formattedForm as FormUpdateDto,
    }
    await this.formsApiWithAuth(auth)
      .apiFormsFormIdPut(request)
      .catch((e) => handle4xx(e, this.handleError, 'failed to update form'))

    return
  }

  async updateFormSettings(
    auth: User,
    input: UpdateFormSettingsInput,
  ): Promise<void> {
    const request: ApiFormsFormIdSettingsPutRequest = {
      formId: input.id,
      formSettingsUpdateDto:
        input.formSettingsUpdateDto as FormSettingsUpdateDto,
    }
    await this.formsApiWithAuth(auth)
      .apiFormsFormIdSettingsPut(request)
      .catch((e) =>
        handle4xx(e, this.handleError, 'failed to update form settings'),
      )

    return
  }
}
