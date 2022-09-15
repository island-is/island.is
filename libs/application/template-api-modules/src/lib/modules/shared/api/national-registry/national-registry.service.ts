import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../../types'
import * as kennitala from 'kennitala'

import {
  NationalRegistryApi,
  ISLFjolskyldan,
} from '@island.is/clients/national-registry-v1'
import {
  NationalRegistryParameters,
  NationalRegistryUser,
} from '@island.is/application/types'
import { TemplateApiError } from '@island.is/nest/problem'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { coreErrorMessages } from '@island.is/application/core'

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
export class NationalRegistryService extends BaseTemplateApiService {
  constructor(private readonly nationalRegistryApi: NationalRegistryApi) {
    super('NationalRegistry')
  }

  async getUser({
    auth,
    params,
  }: TemplateApiModuleActionProps<NationalRegistryParameters>): Promise<NationalRegistryUser> {
    const user = await this.nationalRegistryApi.getUser(auth.nationalId)

    const result = {
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

    if (params?.ageToValidate) {
      if (params.ageToValidate > result.age)
        throw new TemplateApiError(
          {
            title: coreErrorMessages.nationalRegistryAgeLimitNotMetTitle,
            summary:
              coreErrorMessages.couldNotAssignApplicationErrorDescription,
          },
          400,
        )
    }

    return result
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
    return ['1', '2', '7'].includes(person.Kyn)
  }
}
