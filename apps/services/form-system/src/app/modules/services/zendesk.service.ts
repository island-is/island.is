import { Injectable, Inject } from '@nestjs/common'
import { ApplicationDto } from '../applications/models/dto/application.dto'
import {
  createEnhancedFetch,
  EnhancedFetchAPI,
} from '@island.is/clients/middlewares'
import {
  ApplicantTypesEnum,
  FieldTypesEnum,
  SectionTypes,
} from '@island.is/form-system/shared'
import { getLanguageTypeForValueTypeAttribute } from '../../dataTypes/valueTypes/valueType.helper'
import { CustomField } from './models/zendeskCustomField.dto'
import { environment } from '../../../environments'
import { ValueType } from '../../dataTypes/valueTypes/valueType.model'
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import { ApplicationMapper } from '../applications/models/application.mapper'
import {
  Instance,
  mapToCustomFields,
} from '../../../utils/zendeskPartiesCustomFieldIds'
@Injectable()
export class ZendeskService {
  enhancedFetch: EnhancedFetchAPI
  private readonly SANDBOX_INSTANCE =
    process.env.FORM_SYSTEM_ZENDESK_TENANT_ID_SANDBOX
  private readonly PROD_INSTANCE =
    process.env.FORM_SYSTEM_ZENDESK_TENANT_ID_PROD
  private readonly SANDBOX_API_KEY =
    process.env.FORM_SYSTEM_ZENDESK_API_KEY_SANDBOX
  private readonly PROD_API_KEY = process.env.FORM_SYSTEM_ZENDESK_API_KEY_PROD
  private readonly HEILSA_API_KEY = process.env.HEILSA_API_KEY

  private readonly CHECKBOX_TRUE = 'Valið'
  private readonly CHECKBOX_FALSE = 'Ekki valið'

  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly applicationMapper: ApplicationMapper,
  ) {
    this.enhancedFetch = createEnhancedFetch({
      name: 'form-system-zendesk',
      organizationSlug: 'stafraent-island',
      timeout: 40000,
      logErrorResponseBody: true,
    })
  }

  async sendToZendesk(
    applicationDto: ApplicationDto,
    storedInstance?: string,
  ): Promise<boolean> {
    const contactEmail = 'stafraentisland@gmail.com'
    const username = `${contactEmail}/token`

    let zendeskInstance = this.SANDBOX_INSTANCE
    let apiKey = this.SANDBOX_API_KEY

    if (applicationDto.isTest === false && environment.production === true) {
      zendeskInstance = storedInstance || this.PROD_INSTANCE
      apiKey = this.PROD_API_KEY
    }

    if (zendeskInstance === 'heilsa') {
      apiKey = this.HEILSA_API_KEY
    }

    if (!zendeskInstance || !apiKey) {
      throw new Error('Zendesk tenant id or API key not configured')
    }

    const zendeskUrl = `https://${zendeskInstance}.zendesk.com`
    const credentials = Buffer.from(`${username}:${apiKey}`).toString('base64')

    const { name, email } = this.getNameAndEmail(applicationDto)
    const body = this.constructBody(applicationDto)
    const customFields = this.getCustomFields(
      applicationDto,
      zendeskInstance as Instance,
    )
    const subject = applicationDto.formName?.is ?? 'No subject'
    const data = JSON.stringify(
      this.applicationMapper.mapApplicationDtoToApplicationXroadDto(
        applicationDto,
      ),
    )
    const isInternal = applicationDto.zendeskInternal === true
    const applicationId = applicationDto.id ?? ''

    const fileToken = await this.uploadFile(
      data,
      applicationId,
      zendeskUrl,
      credentials,
    )

    return await this.createTicket(
      applicationId,
      subject,
      body,
      customFields,
      fileToken,
      zendeskUrl,
      credentials,
      name,
      email,
      isInternal,
    )
  }

  private async createTicket(
    applicationId: string,
    subject: string,
    body: string,
    customFields: CustomField[],
    fileToken: string,
    url: string,
    credentials: string,
    name: string,
    email: string,
    isInternal: boolean,
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
              public: !isInternal,
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
        this.logger.error(
          `Failed to create ticket for application ${applicationId}`,
          { status: response.status, statusText: response.statusText },
        )
        return false
      }
      const result = await response.json()
      return result.ticket?.id ? true : false
    } catch (error) {
      this.logger.error(
        `Unexpected error while creating ticket for application ${applicationId}`,
        { error },
      )
      return false
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
        this.logger.error(
          `Failed to upload file for application ${applicationId}`,
          { status: response.status, statusText: response.statusText },
        )
        throw new Error('Failed to upload file to Zendesk')
      }
      const result = await response.json()
      return result.upload.token
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'Failed to upload file to Zendesk'
      ) {
        throw error
      }
      this.logger.error(
        `Unexpected error while uploading file for application ${applicationId}`,
        { error },
      )
      throw new Error('Unexpected error while uploading file to Zendesk')
    }
  }

  private findLoggedInApplicantJson(
    applicationDto: ApplicationDto,
  ): ValueType | undefined {
    for (const section of applicationDto.sections?.filter(
      (section) => section.sectionType === SectionTypes.PARTIES,
    ) ?? []) {
      for (const screen of section.screens ?? []) {
        for (const field of screen.fields ?? []) {
          if (field.fieldType === FieldTypesEnum.APPLICANT) {
            for (const value of field.values ?? []) {
              const json = value?.json as ValueType | undefined
              if (!json) continue
              if (json.isLoggedInUser === true) {
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

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  private constructBody(applicationDto: ApplicationDto): string {
    const sections =
      applicationDto.sections?.filter(
        (section) =>
          section.sectionType !== SectionTypes.PREMISES &&
          section.sectionType !== SectionTypes.SUMMARY &&
          section.sectionType !== SectionTypes.COMPLETED,
      ) ?? []

    const indent = (px: number) => `padding-left:${px}px`

    const p0 = (inner: string, style = '') =>
      `<p style="margin:0;${style}">${inner}</p>`

    const h = (level: 3 | 4 | 5 | 6, inner: string, style = '') =>
      `<h${level} style="${style}">${inner}</h${level}>`

    const formatDateIs = (d?: Date) => d?.toLocaleString('is-IS') ?? ''

    const parts: string[] = []

    // Header
    parts.push(
      p0(
        `<strong>Innsend:</strong> ${formatDateIs(applicationDto.submittedAt)}`,
      ),
      p0(`<strong>Númer:</strong> ${applicationDto.id ?? ''}`),
      p0(
        `<strong>Kennitala stofnunar:</strong> ${
          applicationDto.organizationNationalId ?? ''
        }`,
      ),
      '<br />',
    )

    if (sections?.length) {
      for (const section of sections) {
        if (section.isHidden) continue

        parts.push(h(3, section.name.is))

        for (const screen of section.screens ?? []) {
          if (screen.isHidden) continue

          parts.push(h(4, screen.name.is, indent(10)))

          for (const field of screen.fields ?? []) {
            if (field.isHidden) continue
            if (field.fieldType === FieldTypesEnum.MESSAGE) continue

            const requiredMark = field.isRequired ? '*' : ''
            parts.push(
              h(5, `${field.name.is}${requiredMark}`, `margin:0;${indent(20)}`),
            )

            const values = field.values ?? []
            const isMulti = values.length > 1

            for (let valueIndex = 0; valueIndex < values.length; valueIndex++) {
              const value = values[valueIndex]
              const itemNo = valueIndex + 1

              const rawJson = value?.json
              const json =
                rawJson && typeof rawJson === 'object'
                  ? (rawJson as Record<string, unknown>)
                  : {}

              if (field.fieldType === FieldTypesEnum.FILE) {
                const keys = this.normalizeS3Keys(
                  (json as Record<string, unknown>)['s3Key'],
                )
                const lines = keys.map(
                  (k) => `• ${this.displayNameFromS3Key(k)}`,
                )

                const prefixHtml = isMulti ? `<strong>${itemNo}.</strong> ` : ''
                const valHtml = lines.length
                  ? this.escapeHtml(lines.join('\n')).replace(
                      /\r\n|\n|\r/g,
                      '<br />',
                    )
                  : ''

                parts.push(p0(`${prefixHtml}${valHtml}`, indent(30)))
                continue
              }

              const entries = Object.entries(json)
              const isMultiAttribute = entries.length > 1

              // If multi and json is empty -> just write the itemNo (bold)
              if (isMulti && entries.length === 0) {
                parts.push(p0(`<strong>${itemNo}.</strong>`, indent(30)))
                continue
              }

              // Multi + multi-attribute: number once above all attributes (bold)
              if (isMulti && isMultiAttribute) {
                parts.push(
                  h(6, `<strong>${itemNo}.</strong>`, `margin:0;${indent(30)}`),
                )
              }

              for (const [key, raw] of entries) {
                if (
                  field.fieldType === FieldTypesEnum.APPLICANT &&
                  (key === 'delegationType' ||
                    key === 'isLoggedInUser' ||
                    key === 'applicantType')
                ) {
                  continue
                } else if (
                  (field.fieldType === FieldTypesEnum.DROPDOWN_LIST ||
                    field.fieldType === FieldTypesEnum.RADIO_BUTTONS) &&
                  key === 'value'
                ) {
                  continue
                }

                const val = this.formatValue(raw, field.fieldType)
                const valHtml = this.escapeHtml(val).replace(
                  /\r\n|\n|\r/g,
                  '<br />',
                )

                if (isMultiAttribute) {
                  const attribute = getLanguageTypeForValueTypeAttribute(key)
                  const attrIndent = isMulti ? 40 : 30

                  parts.push(
                    h(
                      6,
                      `${this.escapeHtml(attribute.is)}:`,
                      `display:inline-block;${indent(
                        attrIndent,
                      )};margin-right:4px`,
                    ),
                    `<p style="display:inline-block;margin:0">${valHtml}</p><br />`,
                  )
                } else {
                  const prefixHtml = isMulti
                    ? `<strong>${itemNo}.</strong> `
                    : ''
                  parts.push(p0(`${prefixHtml}${valHtml}`, indent(30)))
                }
              }
            }
          }
        }
      }
    }

    return parts.join('')
  }

  private normalizeS3Keys(raw: unknown): string[] {
    if (Array.isArray(raw)) {
      return raw.filter(
        (k): k is string => typeof k === 'string' && k.length > 0,
      )
    }
    if (typeof raw === 'string' && raw.length > 0) return [raw]
    return []
  }

  private displayNameFromS3Key(key: string): string {
    // 1) turn s3 key into human filename
    const lastPart = key.split('/').pop() ?? key
    const underscoreIndex = lastPart.indexOf('_')
    const fileName =
      underscoreIndex >= 0 ? lastPart.slice(underscoreIndex + 1) : lastPart

    // 2) truncate middle if long
    const maxLength = 40
    if (fileName.length <= maxLength) return fileName

    const ellipsis = '...'
    const keepLength = maxLength - ellipsis.length
    const start = Math.ceil(keepLength / 2)
    const end = fileName.length - Math.floor(keepLength / 2)

    return `${fileName.slice(0, start)}${ellipsis}${fileName.slice(end)}`
  }

  private getCustomFields(
    applicationDto: ApplicationDto,
    zendeskInstance: Instance,
  ): CustomField[] {
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
          if (section.sectionType === SectionTypes.PARTIES) {
            if (
              field.fieldSettings?.applicantType ===
              ApplicantTypesEnum.INDIVIDUAL
            ) {
              const json = field.values?.[0]?.json ?? {}
              const mappedApplicant = mapToCustomFields(zendeskInstance, json)
              customFields.push(...mappedApplicant)
            }
          }

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
    }

    if (fieldType === FieldTypesEnum.BANK_ACCOUNT && val === '--') {
      return ''
    }

    if (
      fieldType === FieldTypesEnum.DROPDOWN_LIST ||
      fieldType === FieldTypesEnum.RADIO_BUTTONS
    ) {
      if (val == null || val === '' || typeof val !== 'object' || !val.is)
        return ''
      return String(val.is)
    }

    if (fieldType === FieldTypesEnum.DATE_PICKER) {
      if (val === null || val === '') return ''

      if (typeof val === 'string') {
        const trimmed = val.trim()

        // Common stored format in this repo: yyyy-MM-dd
        const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed)
        if (iso) return `${iso[3]}.${iso[2]}.${iso[1]}`

        // Already formatted
        if (/^\d{2}\.\d{2}\.\d{4}$/.test(trimmed)) return trimmed
      }

      const d = val instanceof Date ? val : new Date(String(val))
      if (Number.isNaN(d.getTime())) return ''

      return new Intl.DateTimeFormat('is-IS', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(d)
    }

    if (val === null) {
      return ''
    }
    if (typeof val === 'object') {
      return JSON.stringify(val)
    }
    return String(val)
  }
}
