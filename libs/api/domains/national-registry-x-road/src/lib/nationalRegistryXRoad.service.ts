import { Inject, Injectable } from '@nestjs/common'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { FetchError } from '@island.is/clients/middlewares'
import { EinstaklingarApi } from '@island.is/clients/national-registry-v2'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { NationalRegistryClientPerson } from '@island.is/shared/types'

import { NationalRegistryPerson } from '../models/nationalRegistryPerson.model'
import { NationalRegistryResidence } from '../models/nationalRegistryResidence.model'
import { NationalRegistrySpouse } from '../models/nationalRegistrySpouse.model'

@Injectable()
export class NationalRegistryXRoadService {
  constructor(
    private nationalRegistryApi: EinstaklingarApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  nationalRegistryApiWithAuth(auth: Auth) {
    return this.nationalRegistryApi.withMiddleware(new AuthMiddleware(auth))
  }

  private handle404(error: FetchError) {
    if (error.status === 404) {
      return undefined
    }
    throw error
  }

  async getNationalRegistryResidenceHistory(
    user: User,
    nationalId: string,
  ): Promise<NationalRegistryResidence[] | undefined> {
    const historyList = await this.nationalRegistryApiWithAuth(user)
      .einstaklingarGetBuseta({ id: nationalId })
      .catch(this.handle404)

    return historyList?.map((heimili) => ({
      address: {
        city: heimili.stadur,
        postalCode: heimili.postnumer,
        streetName: heimili.heimilisfang,
        municipalityCode: heimili.sveitarfelagsnumer,
      },
      houseIdentificationCode: heimili.huskodi,
      realEstateNumber: heimili.fasteignanumer,
      country: heimili.landakodi,
      dateOfChange: heimili.breytt,
    }))
  }

  async getNationalRegistryPerson(
    nationalId: string,
  ): Promise<NationalRegistryPerson | undefined> {
    const response = await this.nationalRegistryApi
      .einstaklingarGetEinstaklingurRaw({ id: nationalId })
      .catch(this.handle404)

    // 2022-03-08: For some reason, the API now returns "204 No Content" when nationalId doesn't exist.
    // Should remove this after they've fixed their API to return "404 Not Found".
    const person: NationalRegistryClientPerson | undefined =
      response === undefined || response.raw.status === 204
        ? undefined
        : await response.value()

    return (
      person && {
        nationalId: person.kennitala,
        fullName: person.nafn,
        address: person.logheimili && {
          streetName: person.logheimili.heiti,
          postalCode: person.logheimili.postnumer,
          city: person.logheimili.stadur,
          municipalityCode: person.logheimili.sveitarfelagsnumer,
        },
        genderCode: person.kynkodi,
      }
    )
  }

  async getChildrenCustodyInformation(
    user: User,
    parentNationalId: string,
  ): Promise<NationalRegistryPerson[]> {
    const nationalRegistryApi = this.nationalRegistryApiWithAuth(user)
    const childrenNationalIds = await nationalRegistryApi
      .einstaklingarGetForsja({
        id: parentNationalId,
      })
      .catch(this.handle404)

    if (!childrenNationalIds) {
      return []
    }

    const parentAFamily = await nationalRegistryApi.einstaklingarGetFjolskylda({
      id: parentNationalId,
    })

    return await Promise.all(
      childrenNationalIds.map(async (childNationalId) => {
        const child = await nationalRegistryApi.einstaklingarGetEinstaklingur({
          id: childNationalId,
        })

        const parents = await nationalRegistryApi.einstaklingarGetForsjaForeldri(
          { id: parentNationalId, barn: child.kennitala },
        )

        const parentBNationalId = parents.find((id) => id !== parentNationalId)
        const parentB = parentBNationalId
          ? await this.getNationalRegistryPerson(parentBNationalId)
          : undefined

        const livesWithApplicant = parentAFamily.einstaklingar?.some(
          (person) => person.kennitala === child.kennitala,
        )
        const livesWithParentB =
          parentB &&
          parentAFamily.einstaklingar?.some(
            (person) => person.kennitala === parentB.nationalId,
          )

        return {
          nationalId: child.kennitala,
          fullName: child.nafn,
          genderCode: child.kynkodi,
          livesWithApplicant,
          livesWithBothParents: livesWithParentB && livesWithApplicant,
          otherParent: parentB,
        }
      }),
    )
  }

  async getSpouse(
    user: User,
    nationalId: string,
  ): Promise<NationalRegistrySpouse | undefined> {
    const spouse = await this.nationalRegistryApiWithAuth(user)
      .einstaklingarGetHjuskapur({ id: nationalId })
      .catch(this.handle404)

    return (
      spouse && {
        nationalId: spouse.kennitalaMaka,
        name: spouse.nafnMaka,
        maritalStatus: spouse.hjuskaparkodi,
      }
    )
  }
}
