import { Inject, Injectable } from '@nestjs/common'
import { EinstaklingarApi } from '@island.is/clients/national-registry-v2'
import { FetchError } from '@island.is/clients/middlewares'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { NationalRegistryPerson } from '../models/nationalRegistryPerson.model'
import { NationalRegistryResidence } from '../models/nationalRegistryResidence.model'
import { NationalRegistryAddress } from '../models/nationalRegistryAddress.model'
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

  async getNationalRegistryResidenceHistory(
    user: User,
    nationalId: string,
  ): Promise<NationalRegistryResidence[] | undefined> {
    const historyList = await this.nationalRegistryApiWithAuth(user)
      .einstaklingarGetBuseta({ id: nationalId })
      .catch((err: FetchError) => {
        if (err.status === 404) {
          return undefined
        }
        throw err
      })

    return historyList?.map(
      (heimili) =>
        ({
          address: {
            city: heimili.stadur,
            postalCode: heimili.postnumer,
            streetName: heimili.heimilisfang,
          } as NationalRegistryAddress,
          country: heimili.landakodi,
          dateOfChange: heimili.breytt,
        } as NationalRegistryResidence),
    )
  }

  async getNationalRegistryPerson(
    user: User,
    nationalId: string,
  ): Promise<NationalRegistryPerson> {
    const person = await this.nationalRegistryApiWithAuth(
      user,
    ).einstaklingarGetEinstaklingur({ id: nationalId })

    return {
      nationalId: nationalId,
      fullName: person.nafn,
      address: {
        streetName: person.logheimili?.heiti || undefined,
        postalCode: person.logheimili?.postnumer || undefined,
        city: person.logheimili?.stadur || undefined,
        municipalityCode: person.logheimili?.sveitarfelagsnumer || undefined,
      },
      genderCode: person.kynkodi,
    }
  }

  async getChildrenCustodyInformation(
    user: User,
    parentNationalId: string,
  ): Promise<
    | NationalRegistryPerson[]
    | Omit<NationalRegistryPerson, 'otherParent'>[]
    | undefined
  > {
    const nationalRegistryApi = this.nationalRegistryApiWithAuth(user)
    const childrenNationalIds = await nationalRegistryApi.einstaklingarGetForsja(
      {
        id: parentNationalId,
      },
    )
    if (!Array.isArray(childrenNationalIds)) {
      return []
    }

    const children = await Promise.all(
      childrenNationalIds.map(async (childNationalId) => {
        return await nationalRegistryApi.einstaklingarGetEinstaklingur({
          id: childNationalId,
        })
      }),
    )
    const parentAFamily = await nationalRegistryApi.einstaklingarGetFjolskylda({
      id: parentNationalId,
    })

    return await Promise.all(
      children?.map(async (child) => {
        const parents = await nationalRegistryApi.einstaklingarGetForsjaForeldri(
          { id: parentNationalId, barn: child.kennitala },
        )

        const parentBNationalId = parents.find((id) => id !== parentNationalId)
        const parentB = parentBNationalId
          ? await nationalRegistryApi.einstaklingarGetEinstaklingur({
              id: parentBNationalId,
            })
          : undefined

        const livesWithApplicant = parentAFamily.einstaklingar?.some(
          (person) => person.kennitala === child.kennitala,
        )
        const livesWithParentB = parentAFamily.einstaklingar?.some(
          (person) => person.kennitala === parentB?.kennitala,
        )

        const parentBObject = parentB?.kennitala
          ? {
              nationalId: parentB.kennitala,
              fullName: parentB.nafn,
              address: {
                streetName: parentB.logheimili?.heiti || undefined,
                postalCode: parentB.logheimili?.postnumer || undefined,
                city: parentB.logheimili?.stadur || undefined,
                municipalityCode:
                  parentB.logheimili?.sveitarfelagsnumer || undefined,
              },
              genderCode: parentB.kynkodi,
            }
          : null

        return {
          nationalId: child.kennitala,
          fullName: child.nafn,
          genderCode: child.kynkodi,
          livesWithApplicant,
          livesWithBothParents: livesWithParentB && livesWithApplicant,
          otherParent: parentBObject,
        }
      }),
    )
  }

  async getSpouse(
    user: User,
    nationalId: string,
  ): Promise<NationalRegistrySpouse> {
    const spouse = await this.nationalRegistryApiWithAuth(
      user,
    ).einstaklingarGetHjuskapur({ id: nationalId })

    return {
      nationalId: spouse.kennitalaMaka || undefined,
      name: spouse.nafnMaka || undefined,
      maritalStatus: spouse.hjuskaparkodi || undefined,
    }
  }
}
