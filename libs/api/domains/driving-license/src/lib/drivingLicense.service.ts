import { Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import {
  DrivingLicense,
  DrivingLicenseType,
  PenaltyPointStatus,
  TeachingRightsStatus,
  StudentInformation,
  Juristiction,
  RequirementKey,
} from './drivingLicense.type'
import { DrivingLicenseApi, DrivingLicenseResponse } from './client'
import {
  ApplicationEligibilityResponse,
  NewDrivingAssessmentResponse,
  NewDrivingLicenseInput,
  NewDrivingLicenseResponse,
} from './client/drivingLicense.type'
import { DRIVING_ASSESSMENT_MAX_AGE } from './util/constants'

@Injectable()
export class DrivingLicenseService {
  constructor(private readonly drivingLicenseApi: DrivingLicenseApi) {}

  async getDrivingLicense(
    nationalId: User['nationalId'],
  ): Promise<DrivingLicense | null> {
    const drivingLicenses = await this.drivingLicenseApi.getDrivingLicenses(
      nationalId,
    )

    if (drivingLicenses.length <= 0) {
      return null
    }

    drivingLicenses.sort(
      (a: DrivingLicenseResponse, b: DrivingLicenseResponse) =>
        new Date(b.utgafuDagsetning).getTime() -
        new Date(a.utgafuDagsetning).getTime(),
    )
    const activeDrivingLicense = {
      ...drivingLicenses[0],
    }

    return {
      id: activeDrivingLicense.id,
      name: activeDrivingLicense.nafn,
      issued: activeDrivingLicense.utgafuDagsetning,
      expires: activeDrivingLicense.gildirTil,
      isProvisional: activeDrivingLicense.erBradabirgda,
      eligibilities: activeDrivingLicense.rettindi.map((eligibility) => ({
        id: eligibility.nr.trim(),
        issued: eligibility.utgafuDags,
        expires: eligibility.gildirTil,
        comment: eligibility.aths,
      })),
    }
  }

  async getStudentInformation(
    nationalId: string,
  ): Promise<StudentInformation | null> {
    const drivingLicenses = await this.drivingLicenseApi.getDrivingLicenses(
      nationalId,
    )

    if (drivingLicenses.length <= 0) {
      return null
    }

    drivingLicenses.sort(
      (a: DrivingLicenseResponse, b: DrivingLicenseResponse) =>
        new Date(b.utgafuDagsetning).getTime() -
        new Date(a.utgafuDagsetning).getTime(),
    )

    const activeDrivingLicense = {
      ...drivingLicenses[0],
    }

    const expiryDate = new Date(activeDrivingLicense.gildirTil)

    if (!activeDrivingLicense.erBradabirgda || expiryDate < new Date()) {
      return null
    }

    return {
      name: activeDrivingLicense.nafn,
    }
  }

  async getDeprivationTypes(): Promise<DrivingLicenseType[]> {
    const types = await this.drivingLicenseApi.getDeprivationTypes()
    return types.map((type) => ({
      id: type.id.toString(),
      name: type.heiti,
    }))
  }

  async getEntitlementTypes(): Promise<DrivingLicenseType[]> {
    const types = await this.drivingLicenseApi.getEntitlementTypes()
    return types.map((type) => ({
      id: type.nr.trim(),
      name: type.heiti || '',
    }))
  }

  async getRemarkTypes(): Promise<DrivingLicenseType[]> {
    const types = await this.drivingLicenseApi.getRemarkTypes()
    return types.map((type) => ({
      id: type.nr,
      name: type.heiti,
    }))
  }

  async getPenaltyPointStatus(
    nationalId: User['nationalId'],
  ): Promise<PenaltyPointStatus> {
    const status = await this.drivingLicenseApi.getPenaltyPointStatus(
      nationalId,
    )
    return {
      nationalId,
      isPenaltyPointsOk: status.iLagi,
    }
  }

  async getTeachingRights(
    nationalId: User['nationalId'],
  ): Promise<TeachingRightsStatus> {
    const status = await this.drivingLicenseApi.getTeachingRights(nationalId)

    return {
      nationalId,
      hasTeachingRights: status.value > 0,
    }
  }

  async getListOfJuristictions(): Promise<Juristiction[]> {
    const embaetti = await this.drivingLicenseApi.getListOfJuristictions()

    return embaetti.map(({ nr, postnumer, nafn }) => ({
      id: nr,
      zip: postnumer,
      name: nafn,
    }))
  }

  async getApplicationEligibility(
    nationalId: string,
    type: DrivingLicenseType['id'],
  ): Promise<ApplicationEligibilityResponse> {
    const assessmentResult = await this.drivingLicenseApi.getDrivingAssessment(
      nationalId,
    )
    const hasFinishedSchoolResult = await this.drivingLicenseApi.hasFinishedSchool(
      nationalId,
    )
    const canApplyResult = await this.drivingLicenseApi.canApplyFor(
      nationalId,
      type,
    )

    const requirements = [
      {
        key: RequirementKey.drivingAssessmentMissing,
        requirementMet:
          (assessmentResult?.dagsetningMats ?? 0) >
          Date.now() - DRIVING_ASSESSMENT_MAX_AGE,
      },
      {
        key: RequirementKey.drivingSchoolMissing,
        requirementMet: !!hasFinishedSchoolResult.hefurLokidOkugerdi,
      },
      {
        key: RequirementKey.deniedByService,
        requirementMet: !!canApplyResult.value,
      },
    ]

    // only eligible if we dont find an unmet requirement
    const isEligible = !requirements.find(
      ({ requirementMet }) => requirementMet === false,
    )

    return {
      requirements,
      isEligible,
    }
  }

  async newDrivingAssessment(
    studentNationalId: string,
    teacherNationalId: User['nationalId'],
  ): Promise<NewDrivingAssessmentResponse> {
    return await this.drivingLicenseApi.newDrivingAssessment({
      kennitala: studentNationalId,
      kennitalaOkukennara: teacherNationalId,
      dagsetningMats: new Date(),
    })
  }

  async newDrivingLicense(
    input: NewDrivingLicenseInput,
  ): Promise<NewDrivingLicenseResponse> {
    return await this.drivingLicenseApi.newDrivingLicense({
      authorityNumber: input.authorityNumber,
      needsToPresentHealthCertificate: input.needsToPresentHealthCertificate,
      personIdNumber: input.personIdNumber,
    })
  }
}
