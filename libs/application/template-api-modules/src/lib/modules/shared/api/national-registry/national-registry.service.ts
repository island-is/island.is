import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../../types'
import {
  ApplicantChildCustodyInformation,
  NationalRegistryIndividual,
  NationalRegistrySpouse,
  NationalRegistryParameters,
  NationalRegistryBirthplace,
  NationalRegistryResidenceHistory,
  ChildrenCustodyInformationParameters,
  NationalRegistryParent,
  NationalRegistryMaritalTitle,
  BirthplaceParameters,
} from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import {
  EinstaklingurDTOAllt,
  NationalRegistryV3ClientService,
} from '@island.is/clients/national-registry-v3'
import { AssetsXRoadService } from '@island.is/api/domains/assets'
import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages } from '@island.is/application/core'

@Injectable()
export class NationalRegistryService extends BaseTemplateApiService {
  constructor(
    private readonly nationalRegistryApi: NationalRegistryClientService,
    private readonly nationalRegistryV3Api: NationalRegistryV3ClientService,
    private readonly assetsXRoadService: AssetsXRoadService,
  ) {
    super('NationalRegistry')
  }

  async nationalRegistry({
    auth,
    params,
  }: TemplateApiModuleActionProps<NationalRegistryParameters>): Promise<NationalRegistryIndividual | null> {
    const individual = await this.getIndividual(auth.nationalId)

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
      const family = await this.nationalRegistryV3Api.getFamily(auth.nationalId)
      const children =
        family?.born?.map((child) => <string>child.barnKennitala) ?? []
      await this.validateChildren(params, children)
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
  }

  private async validateChildren(
    params: NationalRegistryParameters,
    childrenId: string[],
  ) {
    for (const id of childrenId) {
      const individual = await this.getIndividual(id)
      if (individual) {
        this.validateIndividual(individual, true, params)
      }
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

  private mapEinstaklingurToNationalRegistryIndividual(
    person: EinstaklingurDTOAllt,
  ): NationalRegistryIndividual {
    return (
      person && {
        nationalId: person.kennitala || '',
        givenName: person.fulltNafn?.eiginNafn || '',
        familyName: person.fulltNafn?.kenniNafn || '',
        fullName: person.fulltNafn?.fulltNafn || '',
        age: this.getAgeFromDateOfBirth(
          person.faedingarstadur?.faedingarDagur || new Date(0),
        ),
        citizenship:
          {
            code: person.rikisfang?.rikisfangKodi || null,
            name: person.rikisfang?.rikisfangLand || null,
          } || null,
        address:
          {
            streetAddress: person.heimilisfang?.husHeiti || null,
            postalCode: person.heimilisfang?.postnumer || null,
            locality: person.heimilisfang?.poststod || null,
            city: person.heimilisfang?.sveitarfelag || null,
            municipalityCode: person.itarupplysingar?.logheimiliskodi || null,
          } || null,
        genderCode: person.kyn?.kynKodi || '',
        maritalTitle: {
          code: person.hjuskaparstada?.hjuskaparstadaKodi || '',
          description: person.hjuskaparstada?.hjuskaparstadaTexti || '',
        },
        birthDate: person.faedingarstadur?.faedingarDagur || new Date(0),
      }
    )
  }

  private livesWith(
    personA: EinstaklingurDTOAllt,
    personB: EinstaklingurDTOAllt,
  ): boolean {
    return (
      personA?.itarupplysingar?.adsetur?.husHeiti ===
        personB?.itarupplysingar?.adsetur?.husHeiti &&
      personA?.itarupplysingar?.adsetur?.postnumer ===
        personB?.itarupplysingar?.adsetur?.postnumer &&
      personA?.itarupplysingar?.adsetur?.sveitarfelag ===
        personB?.itarupplysingar?.adsetur?.sveitarfelag
    )
  }

  async getIndividual(
    nationalId: string,
    params: NationalRegistryParameters | undefined = undefined,
  ): Promise<NationalRegistryIndividual | null> {
    const person = await this.nationalRegistryV3Api.getAllDataIndividual(
      nationalId,
    )

    if (!person) {
      return null
    }

    // validate if already has icelandic citizenship
    if (params?.validateAlreadyHasIcelandicCitizenship) {
      const citizenshipIceland = 'IS'
      if (person?.rikisfang?.rikisfangKodi === citizenshipIceland) {
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
    return this.mapEinstaklingurToNationalRegistryIndividual(person)
  }

  async getParents({
    auth,
  }: TemplateApiModuleActionProps): Promise<NationalRegistryParent[] | null> {
    const parentUser = auth

    const family = await this.nationalRegistryV3Api.getFamily(
      parentUser.nationalId,
    )
    const parentNationalIds = family?.logForeldrar || []

    const parents = parentNationalIds.map((i) => {
      return { nationalId: i.logForeldriKennitala || '' }
    })

    const parentOneDetails =
      parents.length > 0 &&
      (await this.nationalRegistryApi.getIndividual(parents[0].nationalId))
    const parentTwoDetails =
      parents.length > 1 &&
      (await this.nationalRegistryApi.getIndividual(parents[1].nationalId))

    const parentOne: NationalRegistryParent | null = parentOneDetails
      ? {
          nationalId: parentOneDetails.nationalId,
          givenName: parentOneDetails.givenName,
          familyName: parentOneDetails.familyName,
        }
      : null
    const parentTwo: NationalRegistryParent | null = parentTwoDetails
      ? {
          nationalId: parentTwoDetails.nationalId,
          givenName: parentTwoDetails.givenName,
          familyName: parentTwoDetails.familyName,
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

    const family = await this.nationalRegistryV3Api.getFamily(
      parentUser.nationalId,
    )

    const parentA = await this.nationalRegistryV3Api.getAllDataIndividual(
      parentUser.nationalId,
    )

    if (!family || !parentA) {
      return []
    }

    const childrenNationalIdsV3 = parentA?.forsja?.born
      ?.map((child) => {
        return child.barnKennitala
      })
      .filter((id) => typeof id === 'string') // Filter out undefined values for casting below

    if (params?.validateHasChildren) {
      if (!childrenNationalIdsV3 || childrenNationalIdsV3.length === 0) {
        throw new TemplateApiError(
          {
            title: coreErrorMessages.nationalRegistryHasNoChildrenTitle,
            summary: coreErrorMessages.nationalRegistryHasNoChildrenSummary,
          },
          400,
        )
      }
    }

    if (
      childrenNationalIdsV3 === undefined ||
      childrenNationalIdsV3.length === 0
    ) {
      return []
    }

    const children: Array<ApplicantChildCustodyInformation | null> =
      await Promise.all(
        childrenNationalIdsV3.map(async (childNationalId) => {
          const childV3 = await this.nationalRegistryV3Api.getAllDataIndividual(
            <string>childNationalId,
          )

          let domicileInIceland = true
          const domicileCode = childV3?.itarupplysingar?.logheimiliskodi
          if (!domicileCode || domicileCode.substring(0, 2) === '99') {
            domicileInIceland = false
          }

          if (!childV3) {
            return null
          }

          const parentBNationalId =
            childV3?.forsja?.forsjaradilar &&
            childV3?.forsja?.forsjaradilar.find(
              (parent) => parent.forsjaAdiliKennitala !== parentUser.nationalId,
            )?.forsjaAdiliKennitala

          if (!parentBNationalId) {
            return null
          }

          const parentB = await this.nationalRegistryV3Api.getAllDataIndividual(
            parentBNationalId,
          ) // fetch all data rather than just use getIndividual to ensure field parity

          if (!parentB) {
            return null
          }

          const livesWithApplicant = this.livesWith(parentA, childV3)
          const livesWithParentB = this.livesWith(parentB, childV3)

          return {
            nationalId: childV3.kennitala || '',
            givenName: childV3.fulltNafn?.eiginNafn || '',
            familyName: childV3.fulltNafn?.kenniNafn || '',
            fullName: childV3.fulltNafn?.fulltNafn || '',
            genderCode: childV3.kyn?.kynKodi || '',
            livesWithApplicant,
            livesWithBothParents: livesWithParentB ?? livesWithApplicant,
            otherParent:
              this.mapEinstaklingurToNationalRegistryIndividual(parentB),
            citizenship: {
              code: childV3.rikisfang?.rikisfangKodi || '',
              name: childV3.rikisfang?.rikisfangLand || '',
            },
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

  async getMyRealEstates({ auth }: TemplateApiModuleActionProps) {
    return await this.assetsXRoadService.getRealEstatesWithDetail(auth, '1')
  }

  async getSpouse({
    auth,
  }: TemplateApiModuleActionProps): Promise<NationalRegistrySpouse | null> {
    const person = await this.nationalRegistryV3Api.getAllDataIndividual(
      auth.nationalId,
    )
    const spouseNationalId = person?.hjuskaparstada?.makiKennitala
    const spouse = spouseNationalId
      ? await this.nationalRegistryV3Api.getAllDataIndividual(spouseNationalId)
      : undefined

    return spouse
      ? {
          nationalId: spouseNationalId || '',
          name: spouse?.fulltNafn?.fulltNafn || '',
          maritalStatus: person?.hjuskaparstada?.hjuskaparstadaKodi || '',
          birthplace: spouse?.faedingarstadur && {
            dateOfBirth: spouse?.faedingarstadur.faedingarDagur || new Date(0),
            location: spouse?.faedingarstadur.faedingarStadurHeiti,
            municipalityCode: spouse?.faedingarstadur.faedingarStadurKodi,
          },
          citizenship:
            {
              code: spouse?.rikisfang?.rikisfangKodi || null,
              name: spouse?.rikisfang?.rikisfangLand || null,
            } || null,
          address: {
            streetAddress: spouse?.heimilisfang?.husHeiti || null,
            postalCode: spouse?.heimilisfang?.postnumer || null,
            locality: spouse?.heimilisfang?.poststod || null,
            city: spouse?.heimilisfang?.sveitarfelag || null,
            municipalityCode: spouse?.itarupplysingar?.logheimiliskodi || null,
          },
        }
      : null
  }

  async getMaritalTitle({
    auth,
  }: TemplateApiModuleActionProps): Promise<NationalRegistryMaritalTitle | null> {
    const personV3 = await this.nationalRegistryV3Api.getAllDataIndividual(
      auth.nationalId,
    )

    return personV3?.hjuskaparstada
      ? {
          code: personV3.hjuskaparstada.hjuskaparstadaKodi,
          description: personV3.hjuskaparstada.hjuskaparstadaTexti,
        }
      : null
  }

  async getBirthplace({
    auth,
    params,
  }: TemplateApiModuleActionProps<BirthplaceParameters>): Promise<NationalRegistryBirthplace | null> {
    const personV3 = await this.nationalRegistryV3Api.getAllDataIndividual(
      auth.nationalId,
    )

    if (params?.validateNotEmpty) {
      if (!personV3?.faedingarstadur?.faedingarStadurHeiti) {
        throw new TemplateApiError(
          {
            title: coreErrorMessages.nationalRegistryBirthplaceMissing,
            summary: coreErrorMessages.nationalRegistryBirthplaceMissing,
          },
          404,
        )
      }
    }

    return personV3?.faedingarstadur
      ? {
          dateOfBirth: personV3.faedingarstadur.faedingarDagur || new Date(0),
          location: personV3.faedingarstadur.faedingarStadurHeiti,
          municipalityCode: personV3.faedingarstadur.faedingarStadurKodi,
        }
      : null
  }

  async getCurrentResidence({
    // Not updated since much of the information is no longer available in V3
    auth,
  }: TemplateApiModuleActionProps): Promise<NationalRegistryResidenceHistory | null> {
    const residencyV3 = await this.nationalRegistryV3Api.getAllDataIndividual(
      auth.nationalId,
    )

    const residency: NationalRegistryResidenceHistory | null =
      await this.nationalRegistryApi.getCurrentResidence(auth.nationalId)

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
    // Not updated since residence history no longer exists in V3
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
    const personV3 = await this.nationalRegistryV3Api.getAllDataIndividual(
      auth.nationalId,
    )

    const cohabitantsV3 = personV3?.logheimilistengsl?.logheimilismedlimir
      ?.map((cohabitant) => {
        return cohabitant.kennitala
      })
      .filter((cohabitant) => {
        return typeof cohabitant === 'string'
      })

    if (!cohabitantsV3) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.nationalRegistryCohabitantsMissing,
          summary: coreErrorMessages.nationalRegistryCohabitantsMissing,
        },
        404,
      )
    }

    return <string[]>cohabitantsV3 // Cast due to filter above
  }

  async getCohabitantsDetailed(
    props: TemplateApiModuleActionProps,
  ): Promise<(NationalRegistryIndividual | null)[]> {
    const cohabitants = await this.getCohabitants(props)

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
      cohabitants.map(async (cohabitant) => {
        const individual = await this.getIndividual(cohabitant)
        return individual
      }),
    )

    return cohabitantsDetails
  }
}
