import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'
import { DrivingLicenseFakeData, YES } from '../lib/constants'
import { StudentAssessment } from '@island.is/api/schema'

export class DrivingAssessmentProvider extends BasicDataProvider {
  type = 'DrivingAssessmentProvider'

  async provide(application: Application): Promise<StudentAssessment> {
    const fakeData = application.answers.fakeData as
      | DrivingLicenseFakeData
      | undefined

    if (fakeData?.useFakeData === YES) {
      return {
        teacherNationalId: '123456-7890',
        teacherName: 'Bílar Kennar Ekilsson',
        studentNationalId: '123456-7890',
      }
    }

    const query = `
      query DrivingLicenseAssessment {
        drivingLicenseStudentAssessment {
          teacherNationalId
          teacherName
          studentNationalId
        }
      }
    `

    return this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()

        if (response.errors?.length > 0) {
          return this.handleError(response.errors[0])
        }

        return Promise.resolve(response.data.drivingLicenseStudentAssessment)
      })
      .catch((error) => this.handleError(error))
  }

  handleError(error: any) {
    console.log('Provider error - DrivingAssessmentProvider:', error)
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
