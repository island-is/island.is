import { Inject, Injectable } from '@nestjs/common'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import { User } from '@island.is/auth-nest-tools'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  NationalRegistryPerson,
  NationalRegistryPersonDiscriminated,
} from '../../models/nationalRegistryPerson.model'
import { NationalRegistryReligion } from '../../models/nationalRegistryReligion.model'
import { NationalRegistryCitizenship } from '../../models/nationalRegistryCitizenship.model'
import { NationalRegistryBirthplace } from '../../models/nationalRegistryBirthplace.model'
import { NationalRegistryFamilyMember } from '../../models/nationalRegistryFamilyMember.model'
import { NationalRegistrySpouse } from '../../models/nationalRegistrySpouse.model'
import { NationalRegistryChildGuardianship } from '../../models/nationalRegistryChildGuardianship.model'
import { NationalRegistryName } from '../../models/nationalRegistryName.model'
import { NationalRegistryResidence } from '../../models/nationalRegistryResidenceInfo.model'

@Injectable()
export class NationalRegistryXRoadService {
  constructor(
    private nationalRegistryApi: NationalRegistryClientService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async getNationalRegistryResidenceHistory(
    nationalId: string,
  ): Promise<NationalRegistryResidence[] | null> {
    const historyList = await this.nationalRegistryApi.getResidenceHistory(
      nationalId,
    )

    return historyList.map((entry) => ({
      address: {
        city: entry.city,
        postalCode: entry.postalCode,
        streetName: entry.streetName,
        municipalityCode: entry.municipalityCode,
      },
      houseIdentificationCode: entry.houseIdentificationCode,
      realEstateNumber: entry.realEstateNumber,
      country: entry.country,
      dateOfChange: entry.dateOfChange,
    }))
  }

  async getChildGuardianship(
    user: User,
    childNationalId: string,
  ): Promise<NationalRegistryChildGuardianship | null> {
    const childrenNationalIds = await this.nationalRegistryApi.getCustodyChildren(
      user,
    )

    const isChildOfUser = childrenNationalIds.some(
      (childId) => childId === childNationalId,
    )

    if (!isChildOfUser) {
      return null
    }

    const residenceParent = await this.nationalRegistryApi.getChildResidenceParent(
      user,
      childNationalId,
    )
    const legalDomicileParent = await this.nationalRegistryApi.getChildDomicileParent(
      user,
      childNationalId,
    )

    return {
      childNationalId,
      legalDomicileParent,
      residenceParent,
    }
  }

  async getNationalRegistryPerson(
    nationalId: string,
  ): Promise<NationalRegistryPersonDiscriminated | null> {
    const person = await this.nationalRegistryApi.getIndividual(nationalId)
    return (
      person && {
        nationalId: person.nationalId,
        fullName: person.name,
        exceptionFromDirectMarketing: person.exceptionFromDirectMarketing,
        address: person.legalDomicile && {
          streetName: person.legalDomicile.streetAddress,
          postalCode: person.legalDomicile.postalCode,
          city: person.legalDomicile.locality,
          municipalityCode: person.legalDomicile.municipalityNumber,
        },
        genderCode: person.genderCode,
        api: 'v2',
      }
    )
  }

  async getChildrenCustodyInformation(
    parentUser: User,
  ): Promise<NationalRegistryPerson[]> {
    const childrenNationalIds = await this.nationalRegistryApi.getCustodyChildren(
      parentUser,
    )

    if (childrenNationalIds.length === 0) {
      return []
    }

    const parentAFamily = await this.nationalRegistryApi.getFamily(
      parentUser.nationalId,
    )
    const parentAFamilyMembers = parentAFamily?.individuals ?? []

    const children: Array<NationalRegistryPerson | null> = await Promise.all(
      childrenNationalIds.map(async (childNationalId) => {
        const child = await this.nationalRegistryApi.getIndividual(
          childNationalId,
        )

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
          ? await this.getNationalRegistryPerson(parentBNationalId)
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
          fullName: child.name,
          genderCode: child.genderCode,
          livesWithApplicant,
          livesWithBothParents: livesWithParentB ?? livesWithApplicant,
          otherParent: parentB,
        }
      }),
    )

    return children.filter(
      (child): child is NationalRegistryPerson => child != null,
    )
  }

  async getSpouse(nationalId: string): Promise<NationalRegistrySpouse | null> {
    const spouse = await this.nationalRegistryApi.getCohabitationInfo(
      nationalId,
    )

    this.logger.debug(JSON.stringify(spouse))

    return (
      spouse && {
        nationalId: spouse.spouseNationalId,
        name: spouse.spouseName,
        maritalStatus: spouse.cohabitationCode,
      }
    )
  }

  async getFamily(nationalId: string): Promise<NationalRegistryFamilyMember[]> {
    const family = await this.nationalRegistryApi.getFamily(nationalId)

    return (family?.individuals ?? []).map((member) => ({
      nationalId: member.nationalId,
      fullName: member.name,
      genderCode: member.genderCode,
      address: member.residence && {
        streetName: member.residence.streetAddress,
        postalCode: member.residence.postalCode,
        city: member.residence.locality,
        municipalityCode: member.residence.municipalityNumber,
      },
    }))
  }

  async getBirthplace(
    nationalId: string,
  ): Promise<NationalRegistryBirthplace | null> {
    const birthplace = await this.nationalRegistryApi.getBirthplace(nationalId)
    this.logger.debug(JSON.stringify(birthplace))
    return (
      birthplace && {
        dateOfBirth: birthplace.birthdate,
        location: birthplace.locality,
        municipalityCode: birthplace.municipalityNumber,
      }
    )
  }

  async getCitizenship(
    nationalId: string,
  ): Promise<NationalRegistryCitizenship | null> {
    const citizenship = await this.nationalRegistryApi.getCitizenship(
      nationalId,
    )

    return (
      citizenship && {
        code: citizenship.countryCode,
        name: citizenship.countryName,
      }
    )
  }

  async getReligions(): Promise<NationalRegistryReligion[] | null> {
    const religions = await this.nationalRegistryApi.getReligionCodes()
    return religions
  }
}
