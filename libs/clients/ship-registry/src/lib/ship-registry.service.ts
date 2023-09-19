import { Inject } from '@nestjs/common'
import { FindShipByNameOrNumberRequest, ShipApi } from '../../gen/fetch'
import { ShipRegistryClientConfig } from './ship-registry.config'

interface Ship {
  skraningarnumer: number
  umdaemisnafn: string
  heimahofn: string
  umdaemistolustafir: null
  bruttorumlestir: number
  bruttoTonn: number
  smidaar: number
  nafnskips: string
  skraningarstada: string
  skraningarlengd: number
  umdaemisbokstafir: string
  gerd: string
  smidastod: string
  eigendur: {
    kennitala: string
    nafn: string
    eignaprosenta: number
  }[]
  engines: {
    manufacturingNumber: null
    power: number
    year: number
    usage: {
      name: string
    }
    manufacturer: {
      code: string
      name: string
    }
  }[]
  fishery: {
    identityNumber: string
    name: string
    address: string
    postalCode: string
  }
}

export class ShipRegistryClientService {
  constructor(
    @Inject(ShipRegistryClientConfig.KEY)
    private readonly shipApi: ShipApi,
  ) {}

  async findShipByNameOrNumber(input: FindShipByNameOrNumberRequest) {
    const data = (await this.shipApi.findShipByNameOrNumber(
      input,
    )) as unknown as { ships: Ship[] }

    return {
      ships: (data.ships ?? []).map((ship) => ({
        shipName: ship.nafnskips,
        shipType: ship.gerd,
        regno: ship.skraningarnumer,
        region: `${ship.umdaemisbokstafir}-${ship.umdaemistolustafir} ${ship.umdaemisnafn}`, // TODO: add fail-safe
        portOfRegistry: ship.heimahofn,
        regStatus: ship.skraningarstada,
        grossTonnage: ship.bruttoTonn,
        length: ship.skraningarlengd,
        manufactionYear: ship.smidaar,
        manufacturer: ship.smidastod,
        owners: ship.eigendur.map((owner) => ({
          name: owner.nafn,
          nationalId: owner.kennitala,
          sharePercentage: owner.eignaprosenta,
        })),
      })),
    }
  }
}
