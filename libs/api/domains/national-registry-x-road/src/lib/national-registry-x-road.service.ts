import { logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { EinstaklingarApi } from '@island.is/clients/tjodskra'
import { NationalRegistryXRoadConfig } from '..'
import { ChildrenCustodyResponse } from '../models/childrenCustodyResponse.model'
import { ChildrenCustodyChild } from '../models/childrenCustodyChild.model'

const handleError = (error: any) => {
  logger.error(error)

  throw new ApolloError(
    'Failed to resolve request',
    error?.message ?? error?.response?.message,
  )
}
@Injectable()
export class NationalRegistryXRoadService {
  constructor(
    private personApi: EinstaklingarApi,
    @Inject('Config')
    private config: NationalRegistryXRoadConfig,
  ) {}

  async getCustodyChildrenAndParents(
    nationalId: string,
    token: string,
  ): Promise<ChildrenCustodyResponse | undefined> {
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
        // TODO: FIX THESE UNDEFINDS AND HARD CODED VALUES IN THE RETURN VALUES
        nationalId: nationalId,
        fullName: parentA.nafn,
        address: {
          streetName: parentA.logheimili?.heiti ?? '',
          postalCode: parentA.logheimili?.postnumer ?? '',
          city: parentA.logheimili?.stadur ?? '',
        },
        children,
      }
    } catch (e) {
      handleError(e)
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
  ): Promise<ChildrenCustodyChild[]> {
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
          otherParent: {
            nationalId: parentB.kennitala,
            fullName: parentB.nafn,
            address: {
              streetName: parentB.logheimili?.heiti ?? '',
              postalCode: parentB.logheimili?.postnumer ?? '',
              city: parentB.logheimili?.stadur ?? '',
            },
          },
        }
      }),
    )
  }
}
