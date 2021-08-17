import { range } from 'lodash'
import { education } from '../utils/mock-db-education'
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

  // TODO: FIX any
  public getRecognizedJobs: () => Promise<any[]> = async () => {
    return mockAsync(jobs)
  }

  // TODO: FIX any
  public getRecognizedEducation: () => Promise<any[]> = async () => {
    return mockAsync(education)
  }

  public getUniversityEducationLevels: () => Promise<string[]> = async () => {
    return mockAsync([
      'Phd',
      'MS',
      'MPM',
      'MPA',
      'ML',
      'MHRM',
      'MBA',
      'MAcc',
      'MA',
      'M.ed',
      'Diploma',
      'BS',
      'BA',
      'B.ed',
    ])
  }

  public getSelectableYears: () => Promise<string[]> = async () => {
    // TODO: Test
    return mockAsync(range(2021, 1962, -1).map((num) => num.toString()))
  }

  public getDrivingLicenseTypes: () => Promise<string[]> = async () => {
    return mockAsync(range(2021, 1962, -1).map((num) => num.toString()))
  }
}
