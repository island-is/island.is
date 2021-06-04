import * as kennitala from 'kennitala'
import { Injectable } from '@nestjs/common'

import {
  FamilyMember,
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
      banMarking: {
        banMarked: user.Bannmerking === '1',
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
