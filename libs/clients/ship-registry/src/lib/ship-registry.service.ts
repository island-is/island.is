import { Injectable } from '@nestjs/common'
import { FindShipByNameOrNumberRequest, ShipApi } from '../../gen/fetch'
import { FetchError } from '@island.is/clients/middlewares'

interface Ship {
  skraningarnumer: number
  umdaemisnafn: string
  heimahofn: string
  umdaemistolustafir: number | null
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

const getValueOrEmptyString = (value?: string | number | null) => {
  return value ? value : ''
}

const mapRegion = (ship: Ship) => {
  return `${getValueOrEmptyString(ship.umdaemisbokstafir)}${
    ship.umdaemisbokstafir && ship.umdaemistolustafir ? '-' : ''
  }${getValueOrEmptyString(ship.umdaemistolustafir)} ${
    ship.umdaemisnafn && '('
  }${getValueOrEmptyString(ship.umdaemisnafn)}${ship.umdaemisnafn && ')'}`
}

const mapShip = (ship: Ship) => {
  return {
    shipName: ship.nafnskips,
    shipType: ship.gerd,
    regno: ship.skraningarnumer,
    region: mapRegion(ship),
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
  }
}

@Injectable()
export class ShipRegistryClientService {
  constructor(private readonly shipApi: ShipApi) {}

  async findShipByNameOrNumber(input: FindShipByNameOrNumberRequest) {
    try {
      const data = (await this.shipApi.findShipByNameOrNumber(
        input,
      )) as unknown as { ships: Ship[] }

      return {
        ships: (data.ships ?? []).map(mapShip),
      }
    } catch (error) {
      if (error instanceof FetchError && error.status === 404) {
        return { ships: [] }
      }
      throw error
    }
  }
}
