import { Injectable } from '@nestjs/common'
import { ApplicationDto } from '../applications/models/dto/application.dto'
import {
  createEnhancedFetch,
  EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import { FieldTypesEnum, SectionTypes } from '@island.is/form-system/shared'
import { ValueType } from '../../dataTypes/valueTypes/valueType.model'
import { getLanguageTypeForValueTypeAttribute } from '../../dataTypes/valueTypes/valueType.helper'
import { CustomField } from './models/zendeskCustomField.dto'
import { environment } from '../../../environments'

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

  private readonly CHECKBOX_TRUE = 'Valið'
  private readonly CHECKBOX_FALSE = 'Ekki valið'

  constructor() {
    this.enhancedFetch = createEnhancedFetch({
      name: 'form-system-zendesk',
      organizationSlug: 'stafraent-island',
      timeout: 20000,
      logErrorResponseBody: true,
    })
  }

  async sendToZendesk(applicationDto: ApplicationDto): Promise<boolean> {
    const contactEmail = 'stafraentisland@gmail.com'
    const username = `${contactEmail}/token`
    const tenantId =
      applicationDto.isTest === true || environment.production === false
        ? this.SANDBOX_TENANT_ID
        : this.PROD_TENANT_ID
    const apiKey =
      applicationDto.isTest === true || environment.production === false
        ? this.SANDBOX_API_KEY
        : this.PROD_API_KEY
    if (!tenantId || !apiKey) {
      throw new Error('Zendesk tenant id or API key not configured')
    }
    const zendeskUrl = `https://${tenantId}.zendesk.com`
    const credentials = Buffer.from(`${username}:${apiKey}`).toString('base64')

    const { name, email } = this.getNameAndEmail(applicationDto)
    const body = this.constructBody(applicationDto)
    const customFields = this.getCustomFields(applicationDto)
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
      customFields,
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
    customFields: CustomField[],
    fileToken: string,
    url: string,
    credentials: string,
    name: string,
    email: string,
  ): Promise<boolean> {
    const serviceUrl = new URL(`${url}/api/v2/tickets.json`)

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
            custom_fields: customFields,
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

  private findLoggedInApplicantJson(
    applicationDto: ApplicationDto,
  ): Record<string, any> | undefined {
    for (const section of applicationDto.sections?.filter(
      (section) => section.sectionType === SectionTypes.PARTIES,
    ) ?? []) {
      for (const screen of section.screens ?? []) {
        for (const field of screen.fields ?? []) {
          if (field.fieldType === FieldTypesEnum.APPLICANT) {
            for (const value of field.values ?? []) {
              const json = value?.json as Record<string, any> | undefined
              if (!json) continue
              const flag = json.isLoggedInUser
              if (flag === true || flag === 'true') {
                return json
              }
            }
          }
        }
      }
    }
    return undefined
  }

  private getNameAndEmail(applicationDto: ApplicationDto): {
    name: string
    email: string
  } {
    const json = this.findLoggedInApplicantJson(applicationDto) ?? {}
    const name = json.name ?? 'Nafn fannst ekki'
    const email = json.email ?? 'Netfang fannst ekki'
    return { name, email }
  }

  private constructBody(applicationDto: ApplicationDto): string {
    const sections = applicationDto.sections?.filter(
      (section) =>
        section.sectionType !== SectionTypes.PREMISES &&
        section.sectionType !== SectionTypes.SUMMARY &&
        section.sectionType !== SectionTypes.COMPLETED,
    )

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
        body += `<h3>${section.name.is}</h3>`
        section?.screens?.forEach((screen) => {
          body += `<h4 style='padding-left:10px'>${screen.name.is}</h4>`
          screen.fields?.forEach((field) => {
            if (field.fieldSettings?.zendeskIsPrivate === true) {
              return
            }
            body += `<h5 style='margin:0;padding-left:20px'>${field.name.is}${
              field.isRequired ? '*' : ''
            }</h5>`
            field.values?.forEach((value) => {
              if (value.json && typeof value.json === 'object') {
                Object.entries(value.json).forEach(([key, val]) => {
                  val = this.formatValue(val, field.fieldType)
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

  private getCustomFields(applicationDto: ApplicationDto): CustomField[] {
    const customFields: CustomField[] = []
    const sections = applicationDto.sections?.filter(
      (section) =>
        section.sectionType !== SectionTypes.PREMISES &&
        section.sectionType !== SectionTypes.SUMMARY &&
        section.sectionType !== SectionTypes.COMPLETED,
    )

    sections?.forEach((section) => {
      section?.screens?.forEach((screen) => {
        screen.fields?.forEach((field) => {
          if (field.fieldSettings?.zendeskIsCustomField === true) {
            const rawId = field.fieldSettings?.zendeskCustomFieldId
            let customFieldId = 0
            if (typeof rawId === 'string' && /^\d+$/.test(rawId)) {
              const n = Number(rawId)
              customFieldId = Number.isSafeInteger(n) && n > 0 ? n : 0
            }

            if (customFieldId === 0) {
              return
            }

            let value = ''
            const json = field.values?.[0]?.json ?? {}

            const firstEntry = Object.entries(json)[0]
            if (firstEntry) {
              const [, rawVal] = firstEntry
              value = this.formatValue(rawVal, field.fieldType)
            }

            // if field is a checkbox and value is false, do not include it in custom fields
            if (field.fieldType === FieldTypesEnum.CHECKBOX) {
              if (value === this.CHECKBOX_FALSE) {
                return
              }
              value = field.name.is
            }

            // iterate through customFields and check if id already exists.
            // if it does, append the value to the existing field, separated by a comma
            // if it doesn't, add a new field
            const existingField = customFields.find(
              (f) => f.id === customFieldId,
            )
            if (existingField) {
              existingField.value += `, ${value}`
            } else {
              customFields.push({
                id: customFieldId,
                value: value,
              })
            }
          }
        })
      })
    })

    return customFields
  }

  // eslint-disable-next-line
  private formatValue(val: any, fieldType: string): string {
    if (fieldType === FieldTypesEnum.CHECKBOX) {
      if (val === true) {
        return this.CHECKBOX_TRUE
      } else {
        return this.CHECKBOX_FALSE
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
