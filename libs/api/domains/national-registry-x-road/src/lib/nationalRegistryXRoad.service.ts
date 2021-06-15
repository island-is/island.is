import { Inject, Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import {
  Einstaklingsupplysingar,
  Fjolskylda,
} from '@island.is/clients/national-registry-v2'
import type { NationalRegistryXRoadConfig } from './nationalRegistryXRoad.module'
import { NationalRegistryPerson } from '../models/nationalRegistryPerson.model'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class NationalRegistryXRoadService {
  constructor(
    @Inject('Config')
    private config: NationalRegistryXRoadConfig,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  // This code is specifically set up for family-matter applications and might not suit everyone without changes
  // Not using the generated code since it expects the 'Authorization' header to come from
  // the NationalRegistryModule providers instead of a request parameter.
  private async nationalRegistryFetch<T>(
    query: string,
    authToken: string,
  ): Promise<T> {
    try {
      const {
        xRoadBasePathWithEnv,
        xRoadTjodskraMemberCode,
        xRoadTjodskraApiPath,
        xRoadClientId,
      } = this.config
      return fetch(
        `${xRoadBasePathWithEnv}/GOV/${xRoadTjodskraMemberCode}${xRoadTjodskraApiPath}/api/v1/einstaklingar${query}`,
        {
          headers: {
            Authorization: `${authToken}`,
            'X-Road-Client': xRoadClientId,
          },
        },
      ).then((res) => res.json())
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getNationalRegistryPerson(
    nationalId: string,
    authToken: string,
  ): Promise<NationalRegistryPerson> {
    const person = await this.nationalRegistryFetch<Einstaklingsupplysingar>(
      `/${nationalId}`,
      authToken,
    )
    return {
      nationalId: nationalId,
      fullName: person.nafn,
      address: {
        streetName: person.logheimili?.heiti || undefined,
        postalCode: person.logheimili?.postnumer || undefined,
        city: person.logheimili?.stadur || undefined,
      },
    }
  }

  private async getCustody(
    parentNationalId: string,
    authToken: string,
  ): Promise<string[]> {
    return await this.nationalRegistryFetch<string[]>(
      `/${parentNationalId}/forsja`,
      authToken,
    )
  }

  async getChildrenCustodyInformation(
    parentNationalId: string,
    authToken: string,
  ): Promise<
    | NationalRegistryPerson[]
    | Omit<NationalRegistryPerson, 'otherParent'>[]
    | undefined
  > {
    try {
      const childrenNationalIds = await this.getCustody(
        parentNationalId,
        authToken,
      )
      if (!Array.isArray(childrenNationalIds)) {
        return []
      }

      const children = await Promise.all(
        childrenNationalIds.map(async (childNationalId) => {
          return await this.nationalRegistryFetch<Einstaklingsupplysingar>(
            `/${childNationalId}`,
            authToken,
          )
        }),
      )
      const parentAFamily = await this.nationalRegistryFetch<Fjolskylda>(
        `/${parentNationalId}/fjolskylda`,
        authToken,
      )

      return await Promise.all(
        children?.map(async (child) => {
          const parents = await this.nationalRegistryFetch<string[]>(
            `/${parentNationalId}/forsja/${child.kennitala}`,
            authToken,
          )

          const parentB = await this.nationalRegistryFetch<Einstaklingsupplysingar>(
            `/${parents.find((id) => id !== parentNationalId) || null}`,
            authToken,
          )

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
                },
              }
            : null

          return {
            nationalId: child.kennitala,
            fullName: child.nafn,
            livesWithApplicant,
            livesWithBothParents: livesWithParentB && livesWithApplicant,
            otherParent: parentBObject,
          }
        }),
      )
    } catch (e) {
      throw this.handleError(e)
    }
  }

  private handleError(error: any) {
    this.logger.error(error)

    return new ApolloError(
      'Failed to resolve request',
      error?.message ?? error?.response?.message,
    )
  }
}
