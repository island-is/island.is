import fetch from 'node-fetch'

import { User } from '@island.is/auth-nest-tools'

import {
  DrivingLicenseResponse,
  DeprivationTypesResponse,
  EntitlementTypesResponse,
  RemarkTypesResponse,
  PenaltyPointStatusResponse,
  TeachingRightsResponse,
  NewDrivingAssessmentInput,
  NewDrivingAssessmentResponse,
  GetDrivingAssessmentResponse,
  FinishedSchoolResponse,
  CanApplyForResponse,
  EmbaettiDto,
  NewDrivingLicenseResponse,
  NewDrivingLicenseInput,
} from './drivingLicense.type'

export class DrivingLicenseApi {
  private readonly xroadApiUrl: string
  private readonly xroadClientId: string
  private readonly secret: string

  constructor(xroadBaseUrl: string, xroadClientId: string, secret: string) {
    const xroadPath =
      'r1/IS-DEV/GOV/10005/Logreglan-Protected/RafraentOkuskirteini-v1'
    this.xroadApiUrl = `${xroadBaseUrl}/${xroadPath}`
    this.xroadClientId = xroadClientId
    this.secret = secret
  }

  headers() {
    return {
      'X-Road-Client': this.xroadClientId,
      SECRET: this.secret,
      Accept: 'application/json',
    }
  }

  async postApi(url: string, body: {}) {
    const res = await fetch(`${this.xroadApiUrl}/${url}`, {
      headers: {
        ...this.headers(),
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(body),
    })
    return res.json()
  }

  async requestApi(url: string) {
    const res = await fetch(`${this.xroadApiUrl}/${url}`, {
      headers: this.headers(),
    })
    return res.json()
  }

  getDrivingLicenses(
    nationalId: User['nationalId'],
  ): Promise<DrivingLicenseResponse[]> {
    return this.requestApi(`api/Okuskirteini/${nationalId}`)
  }

  getDeprivationTypes(): Promise<DeprivationTypesResponse[]> {
    return this.requestApi('api/Okuskirteini/tegundirsviptinga')
  }

  getEntitlementTypes(): Promise<EntitlementTypesResponse[]> {
    return this.requestApi('api/Okuskirteini/tegundirrettinda')
  }

  getRemarkTypes(): Promise<RemarkTypesResponse[]> {
    return this.requestApi('api/Okuskirteini/tegundirathugasemda')
  }

  getPenaltyPointStatus(
    nationalId: User['nationalId'],
  ): Promise<PenaltyPointStatusResponse> {
    return this.requestApi(`api/Okuskirteini/punktastada/${nationalId}`)
  }

  getTeachingRights(
    nationalId: User['nationalId'],
  ): Promise<TeachingRightsResponse> {
    return this.requestApi(`api/Okuskirteini/hasteachingrights/${nationalId}`)
  }

  getDrivingAssessment(
    nationalId: User['nationalId'],
  ): Promise<GetDrivingAssessmentResponse | null> {
    return this.requestApi(`api/Okuskirteini/saekjaakstursmat/${nationalId}`)
  }

  hasFinishedSchool(
    nationalId: User['nationalId'],
  ): Promise<FinishedSchoolResponse> {
    return this.requestApi(`api/Okuskirteini/${nationalId}/finishedokugerdi`)
  }

  getListOfJuristictions(): Promise<EmbaettiDto[]> {
    return this.requestApi(`api/Okuskirteini/embaetti`)
  }

  canApplyFor(
    nationalId: User['nationalId'],
    type: string,
  ): Promise<CanApplyForResponse> {
    return this.requestApi(
      `api/Okuskirteini/${nationalId}/canapplyfor/${type}/full`,
    )
  }

  newDrivingAssessment(
    input: NewDrivingAssessmentInput,
  ): Promise<NewDrivingAssessmentResponse> {
    return this.postApi(`api/Okuskirteini/new/drivingassesment`, input)
  }

  newDrivingLicense(
    input: NewDrivingLicenseInput,
  ): Promise<NewDrivingLicenseResponse> {
    // We are only implementing the B license ATM.
    const category = 'B'
    return this.postApi(`api/Okuskirteini/applications/new/${category}`, input)
  }
}
