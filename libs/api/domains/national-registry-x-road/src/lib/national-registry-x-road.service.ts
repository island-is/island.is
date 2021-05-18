import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { EinstaklingarApi } from '@island.is/clients/tjodskra'
import {
  NationalRegistry,
  Child,
} from '@island.is/application/templates/family-matters-core/types'

type TjodskraRequestParams = {
  id: string
  xRoadClient: string
}

const handleError = (error: any) => {
  logger.error(error)

  throw new ApolloError(
    'Failed to resolve request',
    error?.message ?? error?.response?.message,
  )
}
@Injectable()
export class NationalRegistryXRoadService {
  constructor(private einstaklingarApi: EinstaklingarApi) {}
  async getCustodyChildrenAndParents(
    nationalId: string,
  ): Promise<NationalRegistry | undefined> {
    try {
      const requestObj: TjodskraRequestParams = {
        id: nationalId,
        xRoadClient: process.env.XROAD_CLIENT_ID ?? '',
      }

      const parentA = await this.einstaklingarApi.einstaklingarGetEinstaklingur(
        requestObj,
      )

      console.log('parent', parentA)

      const children = await this.getChildrenCustodyInformation(requestObj)

      console.log('children', children)

      return {
        // TODO: FIX THESE UNDEFINDS AND HARD CODED VALUES IN THE RETURN VALUE
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
      console.log('error', e)
      handleError(e)
    }
  }

  private async getChildrenCustodyInformation(
    requestObj: TjodskraRequestParams,
  ): Promise<Child[]> {
    let childrenNationalIds = await this.einstaklingarApi.einstaklingarGetForsja(
      requestObj,
    )

    let children = await Promise.all(
      childrenNationalIds.map(async (nationalId) => {
        return await this.einstaklingarApi.einstaklingarGetEinstaklingur({
          id: nationalId,
          xRoadClient: requestObj.xRoadClient,
        })
      }),
    )

    return await Promise.all(
      children.map(async (child) => {
        let parents = await this.einstaklingarApi.einstaklingarGetForsjaForeldri(
          { id: requestObj.id, barn: '', xRoadClient: requestObj.xRoadClient },
        )

        let parentB = await this.einstaklingarApi.einstaklingarGetEinstaklingur(
          {
            id: parents.find((id) => id !== requestObj.id) || null,
            xRoadClient: requestObj.xRoadClient,
          },
        )

        let parentLegalHomeNationalId = await this.einstaklingarApi.einstaklingarGetLogforeldrar(
          { id: child.kennitala, xRoadClient: requestObj.xRoadClient },
        )

        return {
          nationalId: child.kennitala,
          fullName: child.nafn,
          address: {
            streetName: child.logheimili?.heiti,
            postalCode: child.logheimili?.postnumer,
            city: child.logheimili?.stadur,
          },
          livesWithApplicant: parentLegalHomeNationalId.includes(requestObj.id),
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
