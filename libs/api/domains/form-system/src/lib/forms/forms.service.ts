import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
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
import { InputSettings } from '../../models/inputSettings.model'

@Injectable()
export class FormsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private formsApi: FormsApi,
  ) {}

  handleError(error: any, errorDetail?: string): ApolloError | null {
    const err = {
      error: JSON.stringify(error),
      category: 'forms-service',
    }
    this.logger.error(errorDetail || 'Error in forms service', err)

    throw new ApolloError(error.message)
  }

  private handle4xx(error: any, errorDetail?: string): ApolloError | null {
    if (error.status === 403 || error.status === 404) {
      return null
    }
    return this.handleError(error, errorDetail)
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
      .catch((e) => this.handle4xx(e, 'failed to get form from Id'))

    if (!response || response instanceof ApolloError) {
      return {}
    }
    // const formattedResponse = {
    //   ...response,
    //   inputsList: response.form?.inputsList?.map((input) => {
    //     const { type, ...newInputSettings } = input.inputSettings as InputSettings
    //     return {
    //       ...input,
    //       inputSettings: {
    //         ...newInputSettings,
    //         $type: type
    //       }
    //     }
    //   })
    // }
    return response as FormResponse
  }

  async getForms(auth: User, input: GetFormsInput): Promise<FormListResponse> {
    const request: ApiFormsOrganizationOrganizationIdGetRequest = {
      organizationId: input.organizationId,
    }
    const response = await this.formsApiWithAuth(auth)
      .apiFormsOrganizationOrganizationIdGet(request)
      .catch((e) =>
        this.handle4xx(e, 'failed to get forms from organization Id'),
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
      .catch((e) => this.handle4xx(e, 'failed to create form'))

    if (!response || response instanceof ApolloError) {
      return {}
    }

    return response
  }

  async deleteForm(auth: User, input: DeleteFormInput): Promise<void> {
    const request: ApiFormsFormIdDeleteRequest = {
      formId: input.id,
    }
    const response = await this.formsApiWithAuth(auth)
      .apiFormsFormIdDelete(request)
      .catch((e) => this.handle4xx(e, 'failed to delete form'))

    if (!response || response instanceof ApolloError) {
      return void 0
    }
    return response
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
    // const request: ApiFormsFormIdPutRequest = {
    //   formId: input.formId,
    //   formUpdateDto: input.form as FormUpdateDto
    // }
    const response = await this.formsApiWithAuth(auth)
      .apiFormsFormIdPut(request)
      .catch((e) => this.handle4xx(e, 'failed to update form'))
    if (!response || response instanceof ApolloError) {
      return void 0
    }
    return response
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
    const response = await this.formsApiWithAuth(auth)
      .apiFormsFormIdSettingsPut(request)
      .catch((e) => this.handle4xx(e, 'failed to update form settings'))

    if (!response || response instanceof ApolloError) {
      return void 0
    }
    return response
  }
}
