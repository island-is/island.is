import * as kennitala from 'kennitala'
import some from 'lodash/some'
import { Injectable, ForbiddenException } from '@nestjs/common'

import {
  FamilyMember,
  FamilyChild,
  User,
  Gender,
  MaritalStatus,
  FamilyRelation,
} from './types'
import {
  NationalRegistryApi,
  ISLFjolskyldan,
} from '@island.is/clients/national-registry-v1'

@Injectable()
export class NationalRegistryService {
  constructor(private nationalRegistryApi: NationalRegistryApi) {}

  async getUser(nationalId: User['nationalId']): Promise<User> {
    const user = await this.nationalRegistryApi.getUser(nationalId)
    return {
      nationalId: user.Kennitala,
      name: user.Birtnafn,
      firstName: user.Eiginnafn,
      middleName: user.Millinafn,
      lastName: user.Kenninafn,
      fullName: user.Fulltnafn,
      gender: this.formatGender(user.Kyn),
      maritalStatus: this.formatMaritalStatus(user.hju),
      religion: user.Trufelag, // TODO: format from user.Tru
      familyNr: user.Fjolsknr,
      banMarking: {
        banMarked:
          user.Bannmerking === '1' || user.Bannmerking?.toLowerCase() === 'já',
        startDate: user.BannmerkingBreytt,
      },
      citizenship: {
        code: user.Rikisfang,
        name: user.RikisfangLand,
      },
      address: {
        code: user.LoghHusk,
        lastUpdated: user.LoghHuskBreytt,
        streetAddress: user.Logheimili,
        city: user.LogheimiliSveitarfelag,
        postalCode: user.Postnr,
      },
      birthPlace: {
        code: user.FaedSveit,
        city: user.Faedingarstadur,
        date: user.Faedingardagur,
      },
      ...(user.nafnmaka &&
        user.MakiKt && {
          spouse: {
            name: user.nafnmaka,
            nationalId: user.MakiKt,
            cohabitant: user.Sambudarmaki,
          },
        }),
    }
  }

  async getFamily(nationalId: User['nationalId']): Promise<FamilyMember[]> {
    const family = await this.nationalRegistryApi.getMyFamily(nationalId)

    const members = family
      .filter((familyMember) => {
        return familyMember.Kennitala !== nationalId
      })
      .map(
        (familyMember) =>
          ({
            fullName: familyMember.Nafn,
            nationalId: familyMember.Kennitala,
            gender: this.formatGender(familyMember.Kyn),

            familyRelation: this.getFamilyRelation(familyMember),
          } as FamilyMember),
      )
      .sort((a, b) => {
        return (
          kennitala.info(b.nationalId).age - kennitala.info(a.nationalId).age
        )
      })

    return members
  }

  async getFamilyMemberDetails(
    nationalId: User['nationalId'],
    familyMemberNationalId: User['nationalId'],
  ): Promise<FamilyChild> {
    const family = await this.nationalRegistryApi.getMyFamily(nationalId)
    const isAllowed = some(family, ['Kennitala', familyMemberNationalId])
    /**
     * Only show data if SSN is part of family.
     */
    if (isAllowed) {
      const familyMember = await this.nationalRegistryApi.getUser(
        familyMemberNationalId,
      )
      return {
        fullName: familyMember.Fulltnafn,
        nationalId: familyMemberNationalId,
        gender: familyMember.Kyn,
        displayName: familyMember.Birtnafn,
        middleName: familyMember.Millinafn,
        surname: familyMember.Kenninafn,
        genderDisplay: familyMember.Kynheiti,
        birthday: familyMember.Faedingardagur,
        parent1: familyMember.Foreldri1,
        nameParent1: familyMember.nafn1,
        parent2: familyMember.Foreldri2,
        nameParent2: familyMember.Nafn2,
        custody1: undefined,
        nameCustody1: undefined,
        custodyText1: undefined,
        custody2: undefined,
        nameCustody2: undefined,
        custodyText2: undefined,
        birthplace: familyMember.Faedingarstadur,
        religion: familyMember.Trufelag,
        nationality: familyMember.RikisfangLand,
        homeAddress: familyMember.Logheimili,
        municipality: familyMember.LogheimiliSveitarfelag,
        postal: `${familyMember.Postnr} ${familyMember.LogheimiliSveitarfelag}`, // Same structure as familyChild.Postaritun
        fate: familyMember.Afdrif1 || familyMember.Afdrif2,
      }
    } else {
      throw new ForbiddenException('Family member not found')
    }
  }

  async getChildren(nationalId: User['nationalId']): Promise<FamilyChild[]> {
    const myChildren = await this.nationalRegistryApi.getMyChildren(nationalId)

    const members = myChildren
      .filter((familyChild) => {
        const isNotUser = familyChild.Barn !== nationalId
        const isUnderEighteen = kennitala.info(familyChild.Barn).age < 18

        return isNotUser && isUnderEighteen
      })
      .map((familyChild) => ({
        fullName: familyChild.FulltNafn,
        nationalId: familyChild.Barn,
        gender: familyChild.Kyn,
        displayName: familyChild.BirtNafn,
        middleName: familyChild.Millinafn,
        surname: familyChild.Kenninafn,
        genderDisplay: familyChild.Kynheiti,
        birthday: familyChild.Faedingardagur,
        parent1: familyChild.Foreldri1,
        nameParent1: familyChild.NafnForeldri1,
        parent2: familyChild.Foreldri2,
        nameParent2: familyChild.NafnForeldri2,
        custody1: familyChild.Forsja1,
        nameCustody1: familyChild.NafnForsja1,
        custodyText1: familyChild.Forsjatxt1,
        custody2: familyChild.Forsja2,
        nameCustody2: familyChild.NafnForsja2,
        custodyText2: familyChild.Forsjatxt2,
        birthplace: familyChild.Faedingarstadur,
        religion: familyChild.Trufelag,
        nationality: familyChild.Rikisfang,
        homeAddress: familyChild.Logheimili,
        municipality: familyChild.Sveitarfelag,
        postal: familyChild.Postaritun,
        fate: familyChild.Afdrif,
      }))
      .sort((a, b) => {
        return (
          kennitala.info(b.nationalId).age - kennitala.info(a.nationalId).age
        )
      })

    return members
  }

  private formatGender(genderIndex: string): Gender {
    switch (genderIndex) {
      case '1':
        return Gender.MALE
      case '2':
        return Gender.FEMALE
      case '3':
        return Gender.MALE_MINOR
      case '4':
        return Gender.FEMALE_MINOR
      case '7':
        return Gender.TRANSGENDER
      case '8':
        return Gender.TRANSGENDER_MINOR
      default:
        return Gender.UNKNOWN
    }
  }

  private formatMaritalStatus(maritalCode: string): MaritalStatus {
    switch (maritalCode) {
      case '1':
        return MaritalStatus.UNMARRIED
      case '3':
        return MaritalStatus.MARRIED
      case '4':
        return MaritalStatus.WIDOWED
      case '5':
        return MaritalStatus.SEPARATED
      case '6':
        return MaritalStatus.DIVORCED
      case '7':
        return MaritalStatus.MARRIED_LIVING_SEPARATELY
      case '8':
        return MaritalStatus.MARRIED_TO_FOREIGN_LAW_PERSON
      case '9':
        return MaritalStatus.UNKNOWN
      case '0':
        return MaritalStatus.FOREIGN_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON
      case 'L':
        return MaritalStatus.ICELANDIC_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON
      default:
        return MaritalStatus.UNMARRIED
    }
  }

  private getFamilyRelation(person: ISLFjolskyldan): FamilyRelation {
    if (this.isChild(person)) {
      return FamilyRelation.CHILD
    }
    return FamilyRelation.SPOUSE
  }

  private isParent(person: ISLFjolskyldan): boolean {
    return ['1', '2'].includes(person.Kyn)
  }

  private isChild(person: ISLFjolskyldan): boolean {
    const ADULT_AGE_LIMIT = 18

    return (
      !this.isParent(person) &&
      kennitala.info(person.Kennitala).age < ADULT_AGE_LIMIT
    )
  }
}
