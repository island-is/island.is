import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../../types'
import {
  ApplicantChildCustodyInformation,
  NationalRegistryIndividual,
  NationalRegistryOtherIndividual,
  NationalRegistryParameters,
  NationalRegistryBirthplace,
  NationalRegistryResidenceHistory,
  ChildrenCustodyInformationParameters,
  NationalRegistryParent,
  NationalRegistryMaritalTitle,
  BirthplaceParameters,
  NationalRegistryCustodian,
  NationalRegistrySpouseV3,
} from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import {
  NationalRegistryV3ApplicationsClientService,
  CitizenshipDto,
  CohabitationDto,
  IndividualDto,
  IndividualLiteDto,
} from '@island.is/clients/national-registry-v3-applications'
import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages } from '@island.is/application/core'
import { EES } from './EES'
import { User } from '@island.is/auth-nest-tools'

@Injectable()
export class NationalRegistryService extends BaseTemplateApiService {
  constructor(
    private readonly nationalRegistryV3Api: NationalRegistryV3ApplicationsClientService,
  ) {
    super('NationalRegistry')
  }

  async nationalRegistry({
    auth,
    params,
  }: TemplateApiModuleActionProps<NationalRegistryParameters>): Promise<NationalRegistryIndividual | null> {
    const individual = await this.getIndividual(auth.nationalId, auth)
    //Check if individual is found in national registry
    if (!individual) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.nationalIdNotFoundInNationalRegistryTitle,
          summary:
            coreErrorMessages.nationalIdNotFoundInNationalRegistrySummary,
        },
        404,
      )
    }

    // Case when parent can apply for custody child without fulfilling some requirements
    if (params?.allowPassOnChild) {
      const children = await this.nationalRegistryV3Api.getCustodyChildren(auth)
      await this.validateChildren(params, children, auth)
    }

    //allow parents whose children are icelandic citizenships in, but if no children, then check citizenship
    if (params?.allowIfChildHasCitizenship) {
      const children = await this.nationalRegistryV3Api.getCustodyChildren(auth)
      if (children.length > 0) {
        let foundChildWithIcelandicCitizenship = false
        for (const child of children) {
          const individual = await this.getIndividual(child, auth)
          if (individual?.citizenship?.code === 'IS') {
            foundChildWithIcelandicCitizenship = true
            break
          }
        }
        //if child validates with icelandic citizenship, then do not check parents citizenship
        if (foundChildWithIcelandicCitizenship) {
          params = { ...params, icelandicCitizenship: false }
        }
      }
    }

    // Validate individual
    this.validateIndividual(individual, false, params)

    return individual
  }

  private validateIndividual(
    individual: NationalRegistryIndividual,
    isChild: boolean,
    params?: NationalRegistryParameters,
  ) {
    if (params?.legalDomicileIceland && !params?.allowPassOnChild) {
      this.validateDomicileInIceland(individual)
    }

    if (params?.icelandicCitizenship) {
      this.validateIcelandicCitizenship(individual)
    }

    if (params?.ageToValidate && !isChild) {
      this.validateAge(params, individual)
    }

    if (params?.citizenshipWithinEES) {
      this.validateCitizenshipWithinEES(individual)
    }
  }

  private async validateChildren(
    params: NationalRegistryParameters,
    childrenId: string[],
    auth: User,
  ) {
    for (const id of childrenId) {
      const individual = await this.getIndividual(id, auth)
      if (individual) {
        this.validateIndividual(individual, true, params)
      }
    }
  }

  private validateCitizenshipWithinEES(individual: NationalRegistryIndividual) {
    const isWithinEES = EES.some(
      (country) => country.alpha2Code === individual.citizenship?.code,
    )
    if (!isWithinEES) {
      // If individuals citizenship is not within EES
      throw new TemplateApiError(
        {
          title: coreErrorMessages.nationalRegistryCitizenshipNotWithinEES,
          summary: coreErrorMessages.nationalRegistryCitizenshipNotWithinEES,
        },
        400,
      )
    }
  }

  private validateDomicileInIceland(individual: NationalRegistryIndividual) {
    const domicileCode = individual?.address?.municipalityCode
    if (!domicileCode || domicileCode.substring(0, 2) === '99') {
      // If no individual has a domicile in Iceland, then we fail this check
      throw new TemplateApiError(
        {
          title: coreErrorMessages.nationalRegistryLegalDomicileNotIceland,
          summary: coreErrorMessages.nationalRegistryLegalDomicileNotIceland,
        },
        400,
      )
    }
  }

  private validateIcelandicCitizenship(individual: NationalRegistryIndividual) {
    const citizenship = individual?.citizenship
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

  private validateAge(
    params: NationalRegistryParameters,
    individual: NationalRegistryIndividual,
  ) {
    if (
      params?.ageToValidate &&
      individual?.age &&
      individual.age < params.ageToValidate
    ) {
      if (params.ageToValidateError) {
        throw new TemplateApiError(params.ageToValidateError, 400)
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

  private formatNationalRegistryIndividual(
    person: IndividualDto,
    cohabitationInfo: CohabitationDto | null,
    citizenship: CitizenshipDto | null,
  ): NationalRegistryIndividual {
    const givenName = person.givenName
    const familyName = person.familyName
    const birthdate = person.birthdate
    const genderCode = person.genderCode
    const genderDescription = person.genderDescription
    const maritalTitle = cohabitationInfo
      ? {
          code: cohabitationInfo.cohabitationCode,
          description: cohabitationInfo.cohabitationCodeDescription,
        }
      : null
    const address = person.legalDomicile
      ? {
          streetAddress: person.legalDomicile.streetAddress,
          postalCode: person.legalDomicile.postalCode,
          locality: person.legalDomicile.locality,
          city: person.legalDomicile.locality,
          municipalityCode: person.legalDomicile.municipalityNumber,
        }
      : null
    return (
      person && {
        nationalId: person.nationalId,
        givenName,
        familyName,
        fullName: person.name,
        age: this.getAgeFromDateOfBirth(birthdate ?? new Date()),
        citizenship: citizenship
          ? {
              code: citizenship.countryCode,
              name: citizenship.countryName,
            }
          : null,
        address: address && {
          streetAddress: address.streetAddress,
          postalCode: address.postalCode,
          locality: address.locality,
          city: address.city,
          municipalityCode: address.municipalityCode,
        },
        genderCode,
        genderDescription,
        maritalTitle,
        birthDate: birthdate ?? new Date(),
      }
    )
  }

  private formatNationalRegistryOtherIndividual(
    person: IndividualLiteDto,
  ): NationalRegistryOtherIndividual {
    return {
      nationalId: person.nationalId,
      fullName: person.name,
      address: person.legalDomicile
        ? {
            streetAddress: person.legalDomicile.streetAddress,
            postalCode: person.legalDomicile.postalCode,
            locality: person.legalDomicile.locality,
            city: person.legalDomicile.locality,
            municipalityCode: person.legalDomicile.municipalityNumber,
          }
        : null,
    }
  }

  /**
   * The new version of the getIndividual introduces the
   * gendercode and genderdescription fields.
   * The values are as follows:
   *
   * genderCode | genderDescription
   * -----------|------------------
   * 1          | Karl
   * 2          | Kona
   * 3          | Drengur
   * 4          | Stúlka
   * 7          | Kynsegin/annað fullorðinn
   * 8          | Kynsegin/annað barn
   */
  async getIndividual(
    nationalId: string,
    auth: User,
    params: NationalRegistryParameters | undefined = undefined,
  ): Promise<NationalRegistryIndividual | null> {
    const person = await this.nationalRegistryV3Api.getIndividual(
      nationalId,
      auth,
    )
    const citizenship = await this.nationalRegistryV3Api.getCitizenship(
      nationalId,
      auth,
    )

    // get marital title
    const cohabitationInfo =
      await this.nationalRegistryV3Api.getCohabitationInfo(nationalId, auth)

    // validate if already has icelandic citizenship
    if (params?.validateAlreadyHasIcelandicCitizenship) {
      const citizenshipIceland = 'IS'
      if (citizenship?.countryCode === citizenshipIceland) {
        throw new TemplateApiError(
          {
            title:
              coreErrorMessages.nationalRegistryAlreadyIcelandicCitizenTitle,
            summary:
              coreErrorMessages.nationalRegistryAlreadyIcelandicCitizenSummary,
          },
          400,
        )
      }
    }
    return person
      ? this.formatNationalRegistryIndividual(
          person,
          cohabitationInfo,
          citizenship,
        )
      : null
  }

  /**
   * Get information about an individual that is not the logged in user.
   * There is much less data available for other individuals than for the logged in user.
   * Note especially that the firstName and lastName fields are replaced with a fullName field
   */
  async getOtherIndividual(
    nationalId: string,
    auth: User,
  ): Promise<NationalRegistryOtherIndividual | null> {
    const otherIndividual = await this.nationalRegistryV3Api.getOtherIndividual(
      nationalId,
      auth,
    )
    return otherIndividual
      ? this.formatNationalRegistryOtherIndividual(otherIndividual)
      : null
  }

  async getParents({
    auth,
  }: TemplateApiModuleActionProps): Promise<NationalRegistryParent[] | null> {
    const childUser = auth
    const parentNationalIds = await this.nationalRegistryV3Api.getLegalParents(
      childUser,
    )

    const parents = parentNationalIds.map((i) => {
      return { nationalId: i }
    })

    const parentOneDetails =
      parents.length > 0 &&
      (await this.nationalRegistryV3Api.getOtherIndividual(
        parents[0].nationalId,
        auth,
      ))
    const parentTwoDetails =
      parents.length > 1 &&
      (await this.nationalRegistryV3Api.getOtherIndividual(
        parents[1].nationalId,
        auth,
      ))

    const parentOne: NationalRegistryParent | null = parentOneDetails
      ? {
          nationalId: parentOneDetails.nationalId,
          fullName: parentOneDetails.name,
          legalDomicile: parentOneDetails.legalDomicile,
        }
      : null
    const parentTwo: NationalRegistryParent | null = parentTwoDetails
      ? {
          nationalId: parentTwoDetails.nationalId,
          fullName: parentTwoDetails.name,
          legalDomicile: parentTwoDetails.legalDomicile,
        }
      : null

    const parentsWithDetails = []

    if (parentOne) {
      parentsWithDetails.push(parentOne)
    }
    if (parentTwo) {
      parentsWithDetails.push(parentTwo)
    }

    return parentsWithDetails
  }

  async childrenCustodyInformation({
    auth,
    params,
  }: TemplateApiModuleActionProps<ChildrenCustodyInformationParameters>): Promise<
    ApplicantChildCustodyInformation[]
  > {
    const parentUser = auth
    const childrenNationalIds =
      await this.nationalRegistryV3Api.getCustodyChildren(parentUser)

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

    const parentAFamily = (await this.nationalRegistryV3Api.getFamily(
      parentUser,
    )) || {
      individuals: [],
    }
    const parentAFamilyMembers = parentAFamily?.individuals ?? []

    const children: Array<ApplicantChildCustodyInformation | null> =
      await Promise.all(
        childrenNationalIds.map(async (childNationalId) => {
          const childPerson = parentAFamilyMembers.find(
            (person) => person.nationalId === childNationalId,
          )

          if (!childPerson) {
            return null
          }

          const domicileCode = childPerson?.residence?.municipalityNumber

          let domicileInIceland = true
          if (!domicileCode || domicileCode.substring(0, 2) === '99') {
            domicileInIceland = false
          }

          const parents =
            await this.nationalRegistryV3Api.getOtherCustodyParents(
              parentUser,
              childPerson.nationalId,
            )

          const parentBNationalId = parents.find(
            (id) => id !== parentUser.nationalId,
          )
          const parentB = parentBNationalId
            ? await this.getOtherIndividual(parentBNationalId, auth)
            : undefined

          const livesWithApplicant = parentAFamilyMembers.some(
            (person) => person.nationalId === childPerson.nationalId,
          )
          const livesWithParentB =
            parentB &&
            parentAFamilyMembers.some(
              (person) => person.nationalId === parentBNationalId,
            )

          return {
            nationalId: childPerson.nationalId,
            givenName: childPerson.givenName,
            familyName: childPerson.familyName,
            fullName: childPerson.name,
            genderCode: childPerson.genderCode,
            livesWithApplicant,
            livesWithBothParents: livesWithParentB ?? livesWithApplicant,
            otherParent: parentB,
            citizenship: null, // No longer accessible from v3,
            domicileInIceland,
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

  async getSpouse({
    auth,
  }: TemplateApiModuleActionProps): Promise<NationalRegistrySpouseV3 | null> {
    const cohabitationInfo =
      await this.nationalRegistryV3Api.getCohabitationInfo(
        auth.nationalId,
        auth,
      )

    const spouseIndividual = cohabitationInfo
      ? await this.getOtherIndividual(cohabitationInfo.spouseNationalId, auth)
      : undefined

    return (
      cohabitationInfo && {
        nationalId: cohabitationInfo.spouseNationalId,
        name: cohabitationInfo.spouseName,
        maritalStatus: cohabitationInfo.cohabitationCode,
        maritalDescription: cohabitationInfo?.cohabitationCodeDescription,
        lastModified: cohabitationInfo.lastModified,
        birthplace: null, // No longer accessible from v3,
        citizenship: null, // No longer accessible from v3,
        address: spouseIndividual?.address,
      }
    )
  }

  async getMaritalTitle({
    auth,
  }: TemplateApiModuleActionProps): Promise<NationalRegistryMaritalTitle | null> {
    const cohabitationInfo =
      await this.nationalRegistryV3Api.getCohabitationInfo(
        auth.nationalId,
        auth,
      )
    return (
      cohabitationInfo && {
        code: cohabitationInfo?.cohabitationCode,
        description: cohabitationInfo?.cohabitationCodeDescription,
      }
    )
  }

  async getBirthplace({
    auth,
    params,
  }: TemplateApiModuleActionProps<BirthplaceParameters>): Promise<NationalRegistryBirthplace | null> {
    const birthplace = await this.nationalRegistryV3Api.getBirthplace(
      auth.nationalId,
      auth,
    )

    if (params?.validateNotEmpty) {
      if (!birthplace?.locality) {
        throw new TemplateApiError(
          {
            title: coreErrorMessages.nationalRegistryBirthplaceMissing,
            summary: coreErrorMessages.nationalRegistryBirthplaceMissing,
          },
          404,
        )
      }
    }

    return (
      birthplace && {
        dateOfBirth: birthplace.birthdate,
        location: birthplace.locality,
        municipalityCode: birthplace.municipalityNumber,
        municipalityName: birthplace.locality,
      }
    )
  }

  async getCurrentResidence({
    auth,
  }: TemplateApiModuleActionProps): Promise<NationalRegistryResidenceHistory | null> {
    const residency: NationalRegistryResidenceHistory | null =
      await this.nationalRegistryV3Api.getCurrentResidence(
        auth.nationalId,
        auth,
      )

    if (!residency) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.nationalRegistryResidenceHistoryMissing,
          summary: coreErrorMessages.nationalRegistryResidenceHistoryMissing,
        },
        404,
      )
    }

    return residency
  }

  async getResidenceHistory({
    auth,
  }: TemplateApiModuleActionProps): Promise<
    NationalRegistryResidenceHistory[] | null
  > {
    const residenceHistory: NationalRegistryResidenceHistory[] | null =
      await this.nationalRegistryV3Api.getResidenceHistory(
        auth.nationalId,
        auth,
      )

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
      await this.nationalRegistryV3Api.getCohabitants(auth.nationalId, auth)

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

  async getCohabitantsDetailed(
    props: TemplateApiModuleActionProps,
  ): Promise<(NationalRegistryIndividual | null)[]> {
    const cohabitants = await this.getCohabitants(props)
    const auth = props.auth

    const detailedCohabitants =
      await this.nationalRegistryV3Api.getCohabitantsDetailed(
        auth.nationalId,
        auth,
      )

    if (!cohabitants) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.nationalRegistryCohabitantsMissing,
          summary: coreErrorMessages.nationalRegistryCohabitantsMissing,
        },
        404,
      )
    }

    const cohabitantsDetails = await Promise.all(
      detailedCohabitants?.cohabitants
        .filter((cohabitant) => cohabitant != null)
        .map(async (cohabitant) => {
          if (cohabitant) {
            const individual = await this.formatNationalRegistryIndividual(
              cohabitant,
              null,
              null,
            )
            return individual
          }
          return null
        }) ?? [],
    )

    return cohabitantsDetails
  }

  async getCustodians({
    auth,
  }: TemplateApiModuleActionProps): Promise<NationalRegistryCustodian[]> {
    const custodianNationalIds =
      await this.nationalRegistryV3Api.getMyCustodians(auth)

    const custodians: NationalRegistryCustodian[] = []

    for (const nationalId of custodianNationalIds) {
      const details = await this.nationalRegistryV3Api.getOtherIndividual(
        nationalId,
        auth,
      )
      if (details) {
        custodians.push({
          nationalId: details.nationalId,
          name: details.name,
          legalDomicile: details.legalDomicile,
        })
      }
    }

    return custodians
  }
}
