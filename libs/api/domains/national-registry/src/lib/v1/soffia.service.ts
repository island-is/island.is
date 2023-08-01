import * as kennitala from 'kennitala'
import some from 'lodash/some'
import { Injectable, ForbiddenException, Inject, } from '@nestjs/common'

import { FamilyMember, FamilyChild, User } from './types'
import { NationalRegistryApi } from '@island.is/clients/national-registry-v1'
import { FamilyCorrectionInput } from './dto/FamilyCorrectionInput.input'
import { PersonV1 } from '../shared/types'
import { mapGender, mapMaritalStatus } from '../shared/mapper'
import { FamilyCorrectionResponse } from '../shared/models'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'

@Injectable()
export class SoffiaService {
  constructor(
    private nationalRegistryApi: NationalRegistryApi,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async getUser(nationalId: User['nationalId']): Promise<User> {
    const user = await this.nationalRegistryApi.getUser(nationalId)
    this.logger.debug(JSON.stringify(user))
    return {
      nationalId: user.Kennitala,
      name: user.Birtnafn,
      firstName: user.Eiginnafn,
      middleName: user.Millinafn,
      lastName: user.Kenninafn,
      fullName: user.Fulltnafn,
      gender: mapGender(user.Kyn),
      maritalStatus: mapMaritalStatus(user.hju),
      religion: user.Trufelag, // TODO: format from user.Tru
      familyNr: user.Fjolsknr,
      banMarking: {
        banMarked:
          user.Bannmerking === '1' || user.Bannmerking?.toLowerCase() === 'já',
        startDate: user.BannmerkingBreytt,
      },
      citizenship: {
        code: user.Rikisfang ?? '',
        name: user.RikisfangLand ?? '',
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
  async getPerson(nationalId: string): Promise<PersonV1> {
    const user = await this.nationalRegistryApi.getUser(nationalId)
    this.logger.debug(JSON.stringify(user))
    return {
      api: 'v1',
      rawData: user,
      nationalId: user.Kennitala,
      fullName: user.Fulltnafn,
      firstName: user.Eiginnafn,
      middleName: user.Millinafn,
      lastName: user.Kenninafn,
      nationalIdType: null,
      legalResidence: user.Logheimili,
      gender: mapGender(user.Kyn),
      religion: user.Trufelag,
      exceptionFromDirectMarketing:
        user.Bannmerking === '1' || user.Bannmerking?.toLowerCase() === 'já',
      fate: user.Afdrif1 || user.Afdrif2,
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
            gender: mapGender(familyMember.Kyn),
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
        firstName: familyMember.Eiginnafn,
        nationalId: familyMemberNationalId,
        gender: familyMember.Kyn,
        displayName: familyMember.Birtnafn,
        middleName: familyMember.Millinafn,
        surname: familyMember.Kenninafn,
        lastName: familyMember.Kenninafn,
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
        firstName: familyChild.Eiginnafn,
        lastName: familyChild.Kenninafn,
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

  async postUserCorrection(
    input: FamilyCorrectionInput,
    nationalId: User['nationalId'],
  ): Promise<FamilyCorrectionResponse> {
    const userChildren = await this.nationalRegistryApi.getMyChildren(
      nationalId,
    )
    const isAllowed = some(userChildren, ['Barn', input.nationalIdChild])

    /**
     * Only show data if child SSN is part of user's family.
     */
    if (!isAllowed) {
      throw new ForbiddenException('Child not found')
    }

    const user = await this.getUser(nationalId)

    const correctionInput = {
      ...input,
      name: user.fullName,
      nationalId: nationalId,
    }

    const userCorrectionResponse = await this.nationalRegistryApi.postUserCorrection(
      correctionInput,
    )

    return userCorrectionResponse
  }
}
