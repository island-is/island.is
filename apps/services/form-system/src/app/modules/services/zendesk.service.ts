import { Injectable } from '@nestjs/common'
import { ApplicationDto } from '../applications/models/dto/application.dto'
import { OrganizationUrl } from '../organizationUrls/models/organizationUrl.model'
import {
  createEnhancedFetch,
  EnhancedFetchAPI,
} from '@island.is/clients/middlewares'

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

    const { name, email } = this.getNameAndEmail()
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

    console.log('service url', serviceUrl.toString())

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

  private getNameAndEmail(): {
    name: string
    email: string
  } {
    const name = 'Jóna Jóns'
    const email = 'jona.jons@example.com'
    return { name, email }
  }

  private constructBody(applicationDto: ApplicationDto): string {
    const sections = applicationDto.sections?.slice(2)

    let body = `<p><strong>Tegund:</strong> ${applicationDto.formName?.is}</p>`
    body += `<p style='margin: 0'><strong>Innsend:</strong> ${applicationDto.submittedAt?.toLocaleString(
      'is-IS',
    )}</p>`
    body += `<p style='margin: 0'><strong>Númer:</strong> ${
      applicationDto.id ?? ''
    }</p>`
    body += '<br />'
    body += '<h3>Aðilar:</h3>'
    // applicationDto.sections?.[1]?.screens?.forEach((screen) => {})
    body += '<h3>Gögn:</h3>'
    if (sections) {
      sections.forEach((section) => {
        body += `<h4>${section.name.is}</h4>`
        section?.screens?.forEach((screen) => {
          body += `<h5>${screen.name.is}</h5>`
          screen.fields?.forEach((field) => {
            body += `<p><strong>${field.name.is}</strong></p>`
            field.values?.forEach((value) => {
              if (value.json && typeof value.json === 'object') {
                Object.entries(value.json).forEach(([key, val]) => {
                  console.log('key:', key, 'value:', val)
                  body += `<p style='text-indent: 40px'><strong>${key}:</strong> ${val}</p>`
                })
              }
            })
          })
        })
      })
    }
    // console.log('constructed body\n', body)
    return body
  }
}
