import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  Application,
} from '@island.is/application/types'
import { EstateInfo } from '@island.is/clients/syslumenn'
import { m } from '../lib/messages'
type EntryData = {
  estate: EstateInfo
}

export class EstateNoticeProvider extends BasicDataProvider {
  type = 'EstateNoticeProvider'

  // Note:
  // This provider acts as a barrier to persons with no
  // relevant estates and is reliant on the
  // meta.onEntry for the initial state
  async provide(application: Application): Promise<boolean> {
    const applicationData = application.externalData?.syslumennOnEntry
      ?.data as EntryData
    if (!applicationData?.estate?.nationalIdOfDeceased) {
      return Promise.reject({
        message: m.dataCollectionNoEstatesError,
      })
    }
    return true
  }

  onProvideError(result: { message: string }): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: result.message,
      status: 'failure',
    }
  }

  onProvideSuccess(
    result: Record<string, unknown>,
  ): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
