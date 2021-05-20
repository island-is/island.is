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

  async getCustodyChildrenAndParents(
    nationalId: string,
    token: string,
  ): Promise<NationalRegistryPerson | undefined> {
    try {
      const parentA = await this.personApi.einstaklingarGetEinstaklingur({
        id: nationalId,
        xRoadClient: this.config.xRoadClientId,
      })

      const children = await this.getChildrenCustodyInformation(
        nationalId,
        token,
      )

      return {
        nationalId: nationalId,
        fullName: parentA.nafn,
        address: {
          streetName: parentA.logheimili?.heiti || undefined,
          postalCode: parentA.logheimili?.postnumer || undefined,
          city: parentA.logheimili?.stadur || undefined,
        },
        children,
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

  private async getChildrenCustodyInformation(
    parentNationalId: string,
    token: string,
  ): Promise<NationalRegistryPerson[]> {
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

        const parentLegalHomeNationalId = await this.personApi.einstaklingarGetLogforeldrar(
          { id: child.kennitala, xRoadClient: this.config.xRoadClientId },
        )

        return {
          nationalId: child.kennitala,
          fullName: child.nafn,
          livesWithApplicant: parentLegalHomeNationalId.includes(
            parentNationalId,
          ),
          livesWithBothParents: [
            parentNationalId,
            parentB.kennitala,
          ].every((id) => parentLegalHomeNationalId.includes(id)),
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
  }

  private handleError(error: any) {
    this.logger.error(error)

    throw new ApolloError(
      'Failed to resolve request',
      error?.message ?? error?.response?.message,
    )
  }
}
