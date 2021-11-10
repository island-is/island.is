import { Inject, Injectable } from '@nestjs/common'
import { EinstaklingarApi } from '@island.is/clients/national-registry-v2'
import { FetchError } from '@island.is/clients/middlewares'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { NationalRegistryPerson } from '../models/nationalRegistryPerson.model'
import { NationalRegistryResidence } from '../models/nationalRegistryResidence.model'
import { NationalRegistrySpouse } from '../models/nationalRegistrySpouse.model'

interface FasteignirResponse {
  fasteignir: [
    {
      fasteignanumer: string
      sjalfgefidStadfang: {
        birting: string
        postnumer: number
        birtingStutt: string
        stadfanganumer: number
        landeignarnumer: number
        sveitarfelagBirting: string
      }
    },
  ]
}

interface NotkunareiningarResponse {
  notkunareiningar: [
    {
      merking: string
      skyring: string
      birtStaerd: number
      brunabotamat: number
      notkunBirting: string
      fasteignanumer: string
      byggingararBirting: string
      notkunareininganumer: string
      birtStaerdMaelieining: string
    },
  ]
}

interface ThinglystirEigendurResponse {
  thinglystirEigendur: [
    {
      nafn: string
      kaupdagur: string
      kennitala: string
      eignarhlutfall: number
      heimildBirting: string
    },
  ]
}

interface FasteignResponse {
  fasteignanumer: string
  sjalfgefidStadfang: {
    postnumer: number
  }
  fasteignamat: {
    gildandiAr: number
    fyrirhugadAr: number
    gildandiFasteignamat: number
    gildandiLodarhlutamat: number
    gildandiMannvirkjamat: number
    fyrirhugadFasteignamat: number
    fyrirhugadLodarhlutamat: number
    fyrirhugadMannvirkjamat: number
  }
  notkunareiningar: NotkunareiningarResponse
  thinglystirEigendur: ThinglystirEigendurResponse
}

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

  private async nationalRegistryFetchFasteignir<T>(
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
      this.logger.warn(
        `${xRoadBasePathWithEnv}/GOV/${xRoadTjodskraMemberCode}/SKRA-Protected/Fasteignir-v1/api/v1/fasteignir${query}`,
      )
      return fetch(
        `${xRoadBasePathWithEnv}/GOV/${xRoadTjodskraMemberCode}/SKRA-Protected/Fasteignir-v1/api/v1/fasteignir${query}`,
        {
          headers: {
            Authorization: authToken,
            'Authorization-Identity': authToken,
            'X-Road-Client': xRoadClientId,
          },
        },
      ).then((res) => res.json())
    } catch (error) {
      throw this.handleError(error)
    }
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
    user: User,
    nationalId: string,
  ): Promise<NationalRegistryPerson | undefined> {
    const person = await this.nationalRegistryApiWithAuth(user)
      .einstaklingarGetEinstaklingur({ id: nationalId })
      .catch(this.handle404)

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

  async getCustody(
    parentNationalId: string,
    authToken: string,
  ): Promise<string[]> {
    return await this.nationalRegistryFetch<string[]>(
      `/${parentNationalId}/forsja`,
      authToken,
    )
  }

  async getCustodyParents(
    parentNationalId: string,
    nationalId: string,
    authToken: string,
  ): Promise<string[]> {
    return await this.nationalRegistryFetch<string[]>(
      `/${parentNationalId}/forsja/${nationalId}`,
      authToken,
    )
  }

  async getFamily(nationalId: string, authToken: string): Promise<string[]> {
    const family = await this.nationalRegistryFetch<Fjolskylda>(
      `/${nationalId}/fjolskylda`,
      authToken,
    )
    if (!family) {
      this.logger.warn('Fjolskylda is null')
      return []
    }
    if (!family.einstaklingar) {
      this.logger.warn('Fjolskylda einstaklingar is null')
      return []
    }
    return family.einstaklingar.map((einstaklingur) => einstaklingur.kennitala)
  }

  async getFasteignir(
    nationalId: string,
    authToken: string,
  ): Promise<string[]> {
    const data = await this.nationalRegistryFetchFasteignir<FasteignirResponse>(
      `?kennitala=${nationalId}`,
      authToken,
    )
    this.logger.warn(JSON.stringify(data))
    if (!data) {
      this.logger.warn('no data')
      return []
    }
    if (!data.fasteignir) {
      this.logger.warn('no fasteignir')
      return []
    }
    return data.fasteignir.map((fasteign) => fasteign.fasteignanumer)
  }

  async getFasteign(
    fasteignanumer: string,
    authToken: string,
  ): Promise<string[]> {
    const data = await this.nationalRegistryFetchFasteignir<FasteignResponse>(
      `/${fasteignanumer}`,
      authToken,
    )
    this.logger.warn(JSON.stringify(data))
    if (!data) {
      this.logger.warn('no data')
      return []
    }
    if (!data.fasteignamat) {
      this.logger.warn('no fasteignamat')
      return []
    }
    return [`${data.fasteignamat.gildandiFasteignamat}`]
  }

  async getFasteignEigendur(
    fasteignanumer: string,
    authToken: string,
  ): Promise<string[]> {
    const data = await this.nationalRegistryFetchFasteignir<ThinglystirEigendurResponse>(
      `/${fasteignanumer}/thinglystir-eigendur`,
      authToken,
    )
    this.logger.warn(JSON.stringify(data))
    if (!data) {
      this.logger.warn('no data')
      return []
    }
    if (!data.thinglystirEigendur) {
      this.logger.warn('no thinglystirEigendur')
      return []
    }
    return data.thinglystirEigendur.map((eigandi) => eigandi.nafn)
  }

  async getFasteignNotkun(
    fasteignanumer: string,
    authToken: string,
  ): Promise<string[]> {
    const data = await this.nationalRegistryFetchFasteignir<NotkunareiningarResponse>(
      `/${fasteignanumer}/notkunareiningar`,
      authToken,
    )
    this.logger.warn(JSON.stringify(data))
    if (!data) {
      this.logger.warn('no data')
      return []
    }
    if (!data.notkunareiningar) {
      this.logger.warn('no notkunareiningar')
      return []
    }
    return data.notkunareiningar.map((eining) => eining.notkunareininganumer)
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
          ? await this.getNationalRegistryPerson(user, parentBNationalId)
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
