import { Inject, Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import {
  EinstaklingarApi,
  Einstaklingsupplysingar,
} from '@island.is/clients/national-registry-v2'
import { NationalRegistryXRoadConfig } from './nationalRegistryXRoad.module'
import { NationalRegistryPerson } from '../models/nationalRegistryPerson.model'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class NationalRegistryXRoadService {
  constructor(
    @Inject('Config')
    private config: NationalRegistryXRoadConfig,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async nationalRegistryFetch<GenericType>(
    query: string,
    authToken: string,
  ): Promise<GenericType> {
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
      this.handleError(error)
      throw error
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
  ): Promise<NationalRegistryPerson[] | undefined> {
    try {
      const childrenNationalIds = await this.getCustody(
        parentNationalId,
        authToken,
      )
      if (!childrenNationalIds) {
        return
      }
      const children = await Promise.all(
        childrenNationalIds.map(async (childNationalId) => {
          return await this.nationalRegistryFetch<Einstaklingsupplysingar>(
            `/${childNationalId}`,
            authToken,
          )
        }),
      )
      return await Promise.all(
        children.map(async (child) => {
          const parents = await this.nationalRegistryFetch<string[]>(
            `/${parentNationalId}/${child.kennitala}`,
            authToken,
          )

          const parentB = await this.nationalRegistryFetch<Einstaklingsupplysingar>(
            `/${parents.find((id) => id !== parentNationalId) || null}`,
            authToken,
          )

          const parentLegalHomeNationalIds = await this.nationalRegistryFetch<
            string[]
          >(`/${child.kennitala}/logforeldrar`, authToken)

          return {
            nationalId: child.kennitala,
            fullName: child.nafn,
            livesWithApplicant: parentLegalHomeNationalIds.includes(
              parentNationalId,
            ),
            livesWithBothParents: [
              parentNationalId,
              parentB.kennitala,
            ].every((id) => parentLegalHomeNationalIds.includes(id)),
            otherParent: {
              nationalId: parentB.kennitala,
              fullName: parentB.nafn,
              address: {
                streetName: parentB.logheimili?.heiti || undefined,
                postalCode: parentB.logheimili?.postnumer || undefined,
                city: parentB.logheimili?.stadur || undefined,
              },
            },
          }
        }),
      )
    } catch (e) {
      this.handleError(e)
    }
  }

  private handleError(error: any) {
    this.logger.error(error)

    throw new ApolloError(
      'Failed to resolve request',
      error?.message ?? error?.response?.message,
    )
  }
}
