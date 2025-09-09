import { Injectable } from '@nestjs/common'
import { ApplicationDto } from '../applications/models/dto/application.dto'
import { OrganizationUrl } from '../organizationUrls/models/organizationUrl.model'
import {
  createEnhancedFetch,
  EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import { FieldTypesEnum, SectionTypes } from '@island.is/form-system/shared'
import { ValueType } from '../../dataTypes/valueTypes/valueType.model'
import { getLanguageTypeForValueTypeAttribute } from '../../dataTypes/valueTypes/valueType.helper'

@Injectable()
export class ZendeskService {
  enhancedFetch: EnhancedFetchAPI
  private readonly SANDBOX_TENANT_ID =
    process.env.FORM_SYSTEM_ZENDESK_TENANT_ID_SANDBOX
  private readonly PROD_TENANT_ID =
    process.env.FORM_SYSTEM_ZENDESK_TENANT_ID_PROD
  private readonly SANDBOX_API_KEY =
    process.env.FORM_SYSTEM_ZENDESK_API_KEY_SANDBOX
  private readonly PROD_API_KEY = process.env.FORM_SYSTEM_ZENDESK_API_KEY_PROD
  constructor() {
    this.enhancedFetch = createEnhancedFetch({
      name: 'form-system-zendesk',
      organizationSlug: 'stafraent-island',
      timeout: 20000,
      logErrorResponseBody: true,
    })
  }

  async sendToZendesk(
    applicationDto: ApplicationDto,
    url: OrganizationUrl,
  ): Promise<boolean> {
    const contactEmail = process.env.ZENDESK_CONTACT_FORM_EMAIL
    if (!contactEmail) {
      throw new Error('ZENDESK_CONTACT_FORM_EMAIL is not set')
    }
    const username = `${contactEmail}/token`
    const tenantId =
      url.isTest === true ? this.SANDBOX_TENANT_ID : this.PROD_TENANT_ID
    const apiKey =
      url.isTest === true ? this.SANDBOX_API_KEY : this.PROD_API_KEY
    if (!tenantId || !apiKey) {
      throw new Error('Zendesk tenant id or API key not configured')
    }
    const zendeskUrl = `https://${tenantId}.zendesk.com`
    const credentials = Buffer.from(`${username}:${apiKey}`).toString('base64')

    const { name, email } = this.getNameAndEmail(applicationDto)
    const body = this.constructBody(applicationDto)
    const subject = applicationDto.formName?.is ?? 'No subject'
    const data = JSON.stringify(applicationDto)

    // return true
    const fileToken = await this.uploadFile(
      data,
      applicationDto.id ?? '',
      zendeskUrl,
      credentials,
    )

    return await this.createTicket(
      subject,
      body,
      fileToken,
      zendeskUrl,
      credentials,
      name,
      email,
    )
  }

  private async createTicket(
    subject: string,
    body: string,
    fileToken: string,
    url: string,
    credentials: string,
    name: string,
    email: string,
  ): Promise<boolean> {
    const serviceUrl = new URL(`${url}/api/v2/tickets.json`)

    // console.log('service url', serviceUrl.toString())

    try {
      const response = await this.enhancedFetch(serviceUrl.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + credentials,
        },
        body: JSON.stringify({
          ticket: {
            comment: {
              html_body: body,
              public: false,
              uploads: [fileToken],
            },
            subject: subject,
            requester: {
              name,
              email,
            },
          },
        }),
      })
      if (!response.ok) {
        throw new Error(`Failed to create ticket`)
      }
      const result = await response.json()
      return result.ticket?.id ? true : false
    } catch (error) {
      throw new Error('Unexpected error while creating ticket')
    }
  }

  // private addAttachmentToTicket(): boolean {
  //   // TODO: implement file attachment logic
  //   return true
  // }

  private async uploadFile(
    data: string,
    applicationId: string,
    url: string,
    credentials: string,
  ): Promise<string> {
    const serviceUrl = new URL(
      `${url}/api/v2/uploads.json?filename=${applicationId}.json`,
    )

    try {
      const response = await this.enhancedFetch(serviceUrl.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + credentials,
        },
        body: data,
      })
      if (!response.ok) {
        throw new Error(`Failed to upload file`)
      }
      const result = await response.json()
      return result.upload.token
    } catch (error) {
      throw new Error('Unexpected error in file upload')
    }
  }

  private getNameAndEmail(applicationDto: ApplicationDto): {
    name: string
    email: string
  } {
    const json = applicationDto?.sections?.find(
      (section) => section.sectionType === SectionTypes.PARTIES,
    )?.screens?.[0]?.fields?.[0].values?.[0].json as ValueType
    const name = json.name ?? 'Nafn fannst ekki'
    const email = json.email ?? 'Netfang fannst ekki'
    return { name, email }
  }

  private constructBody(applicationDto: ApplicationDto): string {
    const sections = applicationDto.sections?.slice(1)

    let body = `<p><strong>Tegund:</strong> ${applicationDto.formName?.is}</p>`
    body += `<p style='margin:0'><strong>Innsend:</strong> ${applicationDto.submittedAt?.toLocaleString(
      'is-IS',
    )}</p>`
    body += `<p style='margin:0'><strong>Númer:</strong> ${
      applicationDto.id ?? ''
    }</p>`
    body += '<br />'
    if (sections) {
      sections.forEach((section) => {
        if (
          section.sectionType === SectionTypes.SUMMARY ||
          section.sectionType === SectionTypes.COMPLETED
        ) {
          return // Skips to the next iteration
        }
        body += `<h3>${section.name.is}</h3>`
        section?.screens?.forEach((screen) => {
          body += `<h4 style='padding-left:10px'>${screen.name.is}</h4>`
          screen.fields?.forEach((field) => {
            body += `<h5 style='margin:0;padding-left:20px'>${field.name.is}${
              field.isRequired ? '*' : ''
            }</h5>`
            field.values?.forEach((value) => {
              if (value.json && typeof value.json === 'object') {
                Object.entries(value.json).forEach(([key, val]) => {
                  val = this.getValue(val, field.fieldType)
                  if (value.json && Object.keys(value.json).length > 1) {
                    const attribute = getLanguageTypeForValueTypeAttribute(key)
                    if (
                      field.fieldType === FieldTypesEnum.APPLICANT &&
                      (key === 'delegationType' || key === 'isLoggedInUser')
                    ) {
                      return
                    }
                    body += `<h6 style='display:inline-block;padding-left:30px'>${attribute.is}:</h6> `
                    body += `<p style='display:inline-block;margin:0'>${val}</p><br />`
                  } else {
                    body += `<p style='padding-left:30px;margin:0'>${val}</p>`
                  }
                })
              }
            })
          })
        })
      })
    }
    return body
  }

  // eslint-disable-next-line
  private getValue(val: any, fieldType: string): string {
    if (fieldType === FieldTypesEnum.CHECKBOX) {
      if (val === true) {
        return 'Valið'
      } else {
        return 'Ekki valið'
      }
    } else if (fieldType === FieldTypesEnum.BANK_ACCOUNT && val === '--') {
      return ''
    }
    if (val === null) {
      return ''
    }
    return val
  }
}
