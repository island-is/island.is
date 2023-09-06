import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../../types'
import * as kennitala from 'kennitala'

import {
  ApplicantChildCustodyInformation,
  NationalRegistryIndividual,
  NationalRegistrySpouse,
  NationalRegistryParameters,
  NationalRegistryBirthplace,
  NationalRegistryResidenceHistory,
  ChildrenCustodyInformationParameters,
} from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import { AssetsXRoadService } from '@island.is/api/domains/assets'
import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages } from '@island.is/application/core'

@Injectable()
export class NationalRegistryService extends BaseTemplateApiService {
  constructor(
    private readonly nationalRegistryApi: NationalRegistryClientService,
    private readonly assetsXRoadService: AssetsXRoadService,
  ) {
    super('NationalRegistry')
  }

  async nationalRegistry({
    auth,
    params,
  }: TemplateApiModuleActionProps<NationalRegistryParameters>): Promise<NationalRegistryIndividual | null> {
    const result = await this.getIndividual(auth.nationalId)
    // Make sure user has domicile country as Iceland
    if (params?.legalDomicileIceland) {
      const domicileCode = result?.address?.municipalityCode
      if (!domicileCode || domicileCode.substring(0, 2) === '99') {
        throw new TemplateApiError(
          {
            title: coreErrorMessages.nationalRegistryLegalDomicileNotIceland,
            summary: coreErrorMessages.nationalRegistryLegalDomicileNotIceland,
          },
          400,
        )
      }
    }

    if (params?.icelandicCitizenship) {
      const citizenship = result?.citizenship
      if (!citizenship || citizenship.code !== 'IS') {
        throw new TemplateApiError(
          {
            title: coreErrorMessages.nationalRegistryCitizenshipNotIcelandic,
            summary: coreErrorMessages.nationalRegistryCitizenshipNotIcelandic,
          },
          400,
        )
      }
    }

    if (
      params?.ageToValidate &&
      result?.age &&
      result?.age < params.ageToValidate
    ) {
      if (params?.ageToValidateError) {
        throw new TemplateApiError(params?.ageToValidateError, 400)
      } else {
        throw new TemplateApiError(
          {
            title: coreErrorMessages.nationalRegistryAgeNotValid,
            summary: coreErrorMessages.nationalRegistryAgeNotValid,
          },
          400,
        )
      }
    }

    if (!result) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.nationalIdNotFoundInNationalRegistryTitle,
          summary:
            coreErrorMessages.nationalIdNotFoundInNationalRegistrySummary,
        },
        400,
      )
    }

    return result
  }

  private getAgeFromDateOfBirth(dateOfBirth: Date): number {
    const today: Date = new Date()
    const birthDate: Date = dateOfBirth
    let age: number = today.getFullYear() - birthDate.getFullYear()
    const monthDiff: number = today.getMonth() - birthDate.getMonth()
    const dayDiff: number = today.getDate() - birthDate.getDate()

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--
    }

    return age
  }

  private async getIndividual(
    nationalId: string,
  ): Promise<NationalRegistryIndividual | null> {
    const person = await this.nationalRegistryApi.getIndividual(nationalId)
    const citizenship = await this.nationalRegistryApi.getCitizenship(
      nationalId,
    )
    return (
      person && {
        nationalId: person.nationalId,
        fullName: person.name,
        age: this.getAgeFromDateOfBirth(person.birthdate),
        citizenship: citizenship && {
          code: citizenship.countryCode,
          name: citizenship.countryName,
        },
        address: person.legalDomicile && {
          streetAddress: person.legalDomicile.streetAddress,
          postalCode: person.legalDomicile.postalCode,
          locality: person.legalDomicile.locality,
          city: person.legalDomicile.locality,
          municipalityCode: person.legalDomicile.municipalityNumber,
        },
        genderCode: person.genderCode,
      }
    )
  }

  async childrenCustodyInformation({
    auth,
    params,
  }: TemplateApiModuleActionProps<ChildrenCustodyInformationParameters>): Promise<
    ApplicantChildCustodyInformation[]
  > {
    const parentUser = auth
    const childrenNationalIds =
      await this.nationalRegistryApi.getCustodyChildren(parentUser)

    if (params?.validateHasChildren) {
      if (!childrenNationalIds || childrenNationalIds.length === 0) {
        throw new TemplateApiError(
          {
            title: coreErrorMessages.nationalRegistryHasNoChildrenTitle,
            summary: coreErrorMessages.nationalRegistryHasNoChildrenSummary,
          },
          400,
        )
      }
    }

    if (childrenNationalIds.length === 0) {
      return []
    }

    const parentAFamily = await this.nationalRegistryApi.getFamily(
      parentUser.nationalId,
    )
    const parentAFamilyMembers = parentAFamily?.individuals ?? []

    const children: Array<ApplicantChildCustodyInformation | null> =
      await Promise.all(
        childrenNationalIds.map(async (childNationalId) => {
          const child = await this.getIndividual(childNationalId)

          if (!child) {
            return null
          }

          const parents = await this.nationalRegistryApi.getOtherCustodyParents(
            parentUser,
            childNationalId,
          )

          const parentBNationalId = parents.find(
            (id) => id !== parentUser.nationalId,
          )
          const parentB = parentBNationalId
            ? await this.getIndividual(parentBNationalId)
            : undefined

          const livesWithApplicant = parentAFamilyMembers.some(
            (person) => person.nationalId === child?.nationalId,
          )
          const livesWithParentB =
            parentB &&
            parentAFamilyMembers.some(
              (person) => person.nationalId === parentB.nationalId,
            )

          return {
            nationalId: child.nationalId,
            fullName: child.fullName,
            genderCode: child.genderCode,
            livesWithApplicant,
            livesWithBothParents: livesWithParentB ?? livesWithApplicant,
            otherParent: parentB,
          }
        }),
      )

    const filteredChildren = children.filter(
      (child): child is ApplicantChildCustodyInformation => child != null,
    )

    if (params?.validateHasJointCustody) {
      const hasNoJointCustody = filteredChildren.every(
        (child) => !child.otherParent,
      )

      if (hasNoJointCustody) {
        throw new TemplateApiError(
          {
            title: coreErrorMessages.nationalRegistryHasNoJointCustodyTitle,
            summary: coreErrorMessages.nationalRegistryHasNoJointCustodySummary,
          },
          400,
        )
      }
    }

    return filteredChildren
  }

  async getMyRealEstates({ auth }: TemplateApiModuleActionProps) {
    return await this.assetsXRoadService.getRealEstatesWithDetail(auth, '1')
  }

  async getSpouse({
    auth,
  }: TemplateApiModuleActionProps): Promise<NationalRegistrySpouse | null> {
    const spouse = await this.nationalRegistryApi.getCohabitationInfo(
      auth.nationalId,
    )

    return (
      spouse && {
        nationalId: spouse.spouseNationalId,
        name: spouse.spouseName,
        maritalStatus: spouse.cohabitationCode,
      }
    )
  }

  async getBirthplace({
    auth,
  }: TemplateApiModuleActionProps): Promise<NationalRegistryBirthplace | null> {
    const birthplace = await this.nationalRegistryApi.getBirthplace(
      auth.nationalId,
    )

    if (!birthplace?.locality) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.nationalRegistryBirthplaceMissing,
          summary: coreErrorMessages.nationalRegistryBirthplaceMissing,
        },
        404,
      )
    }

    return (
      birthplace && {
        dateOfBirth: birthplace.birthdate,
        location: birthplace.locality,
        municipalityCode: birthplace.municipalityNumber,
      }
    )
  }

  async getResidenceHistory({
    auth,
  }: TemplateApiModuleActionProps): Promise<
    NationalRegistryResidenceHistory[] | null
  > {
    const residenceHistory: NationalRegistryResidenceHistory[] | null =
      await this.nationalRegistryApi.getResidenceHistory(auth.nationalId)

    if (!residenceHistory) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.nationalRegistryResidenceHistoryMissing,
          summary: coreErrorMessages.nationalRegistryResidenceHistoryMissing,
        },
        404,
      )
    }

    return residenceHistory
  }

  async getCohabitants({
    auth,
  }: TemplateApiModuleActionProps): Promise<string[] | null> {
    const cohabitants: string[] | null =
      await this.nationalRegistryApi.getCohabitants(auth.nationalId)

    if (!cohabitants) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.nationalRegistryCohabitantsMissing,
          summary: coreErrorMessages.nationalRegistryCohabitantsMissing,
        },
        404,
      )
    }

    return cohabitants
  }
}
