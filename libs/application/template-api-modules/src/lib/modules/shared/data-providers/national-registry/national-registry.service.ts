import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../..'
import { TemplateApiModuleActionProps } from '../../../../types'
import { NationalRegistryUser } from './models/nationalRegistryUser'
import * as kennitala from 'kennitala'

import { ProblemError } from '@island.is/nest/problem'
import { ProblemType } from '@island.is/shared/problem'
import {
  NationalRegistryApi,
  ISLFjolskyldan,
} from '@island.is/clients/national-registry-v1'

export enum FamilyRelation {
  CHILD = 'child',
  SPOUSE = 'spouse',
  PARENT = 'parent',
}
export interface FamilyMember {
  nationalId: string
  fullName: string
  familyRelation: FamilyRelation
}

@Injectable()
export class NationalRegistryService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly nationalRegistryApi: NationalRegistryApi,
  ) {}

  async getUser({
    auth,
  }: TemplateApiModuleActionProps): Promise<NationalRegistryUser> {
    const user = await this.nationalRegistryApi.getUser(auth.nationalId)

    return {
      nationalId: user.Kennitala,
      fullName: user.Fulltnafn,
      age: kennitala.info(auth.nationalId).age,
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
    }
  }

  async getFamily({ auth }: TemplateApiModuleActionProps) {
    const { nationalId } = auth
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

  private getFamilyRelation(person: ISLFjolskyldan): FamilyRelation {
    if (this.isChild(person)) {
      return FamilyRelation.CHILD
    }
    return FamilyRelation.SPOUSE
  }

  private isChild(person: ISLFjolskyldan): boolean {
    const ADULT_AGE_LIMIT = 18

    return (
      !this.isParent(person) &&
      kennitala.info(person.Kennitala).age < ADULT_AGE_LIMIT
    )
  }

  private isParent(person: ISLFjolskyldan): boolean {
    return ['1', '2'].includes(person.Kyn)
  }
}
