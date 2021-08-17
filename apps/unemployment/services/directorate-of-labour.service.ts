import { jobs } from '../utils/mock-db-jobs'
import { mockAsync } from '../utils/service-utils'

export class DirectorateOfLabourService {
  public getServiceCenters: () => Promise<string[]> = async () => {
    return mockAsync([
      'Austurland',
      'Höfuðborgarsvæðið',
      'Norðurland eystra',
      'Norðurland vestra',
      'Suðurland',
      'Suðurnes',
      'Vestfirðir',
      'Vesturland',
    ])
  }

  public getCountryRegions: () => Promise<string[]> = async () => {
    return mockAsync([
      'Austurland',
      'Höfuðborgarsvæðið',
      'Norðurland eystra',
      'Norðurland vestra',
      'Suðurland',
      'Suðurnes',
      'Vestfirðir',
      'Vesturland',
    ])
  }

  public getRecognizedJobs: () => Promise<string[]> = async () => {
    return mockAsync(jobs)
  }
}
