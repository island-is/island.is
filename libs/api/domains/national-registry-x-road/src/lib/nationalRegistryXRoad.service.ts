import { Inject, Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import {
  EinstaklingarGetBusetaRequest,
  Einstaklingsupplysingar,
  Fjolskylda,
  Heimili,
} from '@island.is/clients/national-registry-v2'
import type { NationalRegistryXRoadConfig } from './nationalRegistryXRoad.module'
import { NationalRegistryPerson } from '../models/nationalRegistryPerson.model'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { NationalRegistryResidenceHistory } from '../models/nationalRegistryResidenceHistory.model'
import { NationalRegistryResidence } from '../models/nationalRegistryResidence.model'
import { NationalRegistryAddress } from '../models/nationalRegistryAddress.model'

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

  async getNationalRegistryResidenceHistory(
    nationalId: string,
    authToken: string,
  ): Promise<NationalRegistryResidenceHistory> {
    const historyList = await this.nationalRegistryFetch<Array<Heimili>>(
      `/${nationalId}/buseta`,
      authToken,
    )

    const history = historyList.map((heimili: Heimili) => {
      // API says Date, but is string -- fallback in case that changes in the future
      const date = typeof heimili.breytt === 'string'
        ? new Date(heimili.breytt)
        : heimili.breytt
      return ({
        address: {
          city: heimili.stadur,
          postalCode: heimili.postnumer,
          streetName: heimili.heimilisfang,
        } as NationalRegistryAddress,
        country: heimili.landakodi,
        dateOfChange: date,
      } as NationalRegistryResidence)
    })

    this.computeCountryResidence(history)

    return {
      nationalId,
      history,
    }
  }

  public computeCountryResidence(history: NationalRegistryResidence[]) {
    if (history.length < 1) {
      return null
    }

    const simplified = history.map(({ dateOfChange, country }) => ({
      time: dateOfChange.getTime(),
      country,
    }))
      .sort(({ time: a }, { time: b }) => {
        // reversed order, make sure we get this right even if the national ID
        // registry is out of order
        return b - a
      })

    const now = new Date()
    const yearFromNow = new Date(
      now.getFullYear() - 1,
      now.getMonth(),
      now.getDate()
    ).getTime()

    let lastTime = now.getTime()
    let i = 0
    let current = Number.MAX_SAFE_INTEGER
    const timeByCountry: Record<string, number> = {}
    while (current > yearFromNow && simplified[i]) {
      const { time, country } = simplified[i]
      current = Math.max(time, yearFromNow)
      const period = Math.round((lastTime - current) / (86400 * 1000))
      timeByCountry[country] = (timeByCountry[country] || 0) + period
      lastTime = current
      i++
    }

    return timeByCountry
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
