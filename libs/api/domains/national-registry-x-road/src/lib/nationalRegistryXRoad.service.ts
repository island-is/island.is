import { Inject, Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { EinstaklingarApi } from '@island.is/clients/national-registry-v2'
import { NationalRegistryXRoadConfig } from './nationalRegistryXRoad.module'
import { NationalRegistryPerson } from '../models/nationalRegistryPerson.model'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class NationalRegistryXRoadService {
  constructor(
    private personApi: EinstaklingarApi,
    @Inject('Config')
    private config: NationalRegistryXRoadConfig,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async getNationalRegistryPerson(
    nationalId: string,
  ): Promise<NationalRegistryPerson | undefined> {
    try {
      const person = await this.personApi.einstaklingarGetEinstaklingur({
        id: nationalId,
        xRoadClient: this.config.xRoadClientId,
      })

      return {
        nationalId: nationalId,
        fullName: person.nafn,
        address: {
          streetName: person.logheimili?.heiti || undefined,
          postalCode: person.logheimili?.postnumer || undefined,
          city: person.logheimili?.stadur || undefined,
        },
      }
    } catch (e) {
      this.handleError(e)
    }
  }

  private async getCustody(
    parentNationalId: string,
    token: string,
  ): Promise<string[]> {
    return await fetch(
      `${this.config.xRoadBasePathWithEnv}/GOV/${this.config.xRoadTjodskraMemberCode}${this.config.xRoadTjodskraApiPath}/api/v1/einstaklingar/${parentNationalId}/forsja`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Road-Client': this.config.xRoadClientId,
        },
      },
    ).then((res) => res.json())
  }

  async getChildrenCustodyInformation(
    parentNationalId: string,
    token: string,
  ): Promise<NationalRegistryPerson[] | undefined> {
    try {
      const childrenNationalIds = await this.getCustody(parentNationalId, token)

      const children = await Promise.all(
        childrenNationalIds.map(async (childNationalId) => {
          return await this.personApi.einstaklingarGetEinstaklingur({
            id: childNationalId,
            xRoadClient: this.config.xRoadClientId,
          })
        }),
      )
      return await Promise.all(
        children.map(async (child) => {
          const parents = await this.personApi.einstaklingarGetForsjaForeldri({
            id: parentNationalId,
            barn: child.kennitala,
            xRoadClient: this.config.xRoadClientId,
          })

          const parentB = await this.personApi.einstaklingarGetEinstaklingur({
            id: parents.find((id) => id !== parentNationalId) || null,
            xRoadClient: this.config.xRoadClientId,
          })

          const parentLegalHomeNationalIds = await this.personApi.einstaklingarGetLogforeldrar(
            { id: child.kennitala, xRoadClient: this.config.xRoadClientId },
          )

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
            parents: [
              {
                nationalId: parentB.kennitala,
                fullName: parentB.nafn,
                address: {
                  streetName: parentB.logheimili?.heiti || undefined,
                  postalCode: parentB.logheimili?.postnumer || undefined,
                  city: parentB.logheimili?.stadur || undefined,
                },
              },
            ],
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
