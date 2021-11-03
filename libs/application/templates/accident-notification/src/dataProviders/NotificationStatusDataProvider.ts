import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'

interface SubmittedApplicationData {
  data?: {
    documentId: string
  }
}

export class NotificationStatusDataProvider extends BasicDataProvider {
  type = 'NotificiationStatusProvider'

  provide(application: Application): Promise<boolean> {
    const subAppData = application.externalData
      .submitApplication as SubmittedApplicationData
    const documentId = subAppData.data?.documentId || undefined

    const query = `query NotificationStatus {
      accidentStatus (input: {ihiDocumentID: ${documentId}) {
        numberIHI
        status
        attachments {
          isReceived
          attachmentType
        }
        confirmations {
          isReceived
          confirmationType
        }
      } 
    }`

    return this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors) {
          return this.handleError(response.errors)
        }

        return Promise.resolve(response.data?.accidentStatus)
      })
      .catch((error) => {
        return this.handleError(error)
      })
  }

  handleError(error: any) {
    console.log('Provider error - NotificationStatus:', error)
    return Promise.resolve({})
  }

  onProvideError(result: string): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: result,
      status: 'failure',
      data: result,
    }
  }

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
