import type {
  AflamarkSkipsBreyttDTO,
  AflamarkSkipsUpphafDTO,
  AflamarkSkipsUpplDTO,
  AflamarkstegundirDTO,
  AflamarkTegundirByTimabilDTO,
  FisktegundDTO,
} from '../../gen/fetch'
import type {
  AllowedCatchCategory,
  AllowedCatchForShip,
  ShipInformation,
} from './fiskiStofaClient.types'

const mapShipInformation = (info?: AflamarkSkipsUpplDTO): ShipInformation => ({
  id: info?.einkenni ?? '',
  shipNumber: info?.skipaskrarNumer,
  name: info?.heitiSkips ?? '',
  timePeriod: info?.timabil ?? '',
})

const mapAllowedCatchCategory = (
  category: AflamarkstegundirDTO,
): AllowedCatchCategory => ({
  id: category?.kvotategund,
  name: category?.kvotategundHeiti ?? '',
  allocation: category?.uthlutun,
  specialAlloction: category?.serstokUthlutun,
  betweenYears: category?.milliAra,
  betweenShips: category?.milliSkipa,
  allowedCatch: category?.aflamark,
  catch: category?.afli,
  status: category?.stada,
  displacement: category?.tilfaersla,
  newStatus: category?.nyStada,
  nextYear: category?.aNaestaAr,
  excessCatch: category?.umframafli,
  unused: category?.onotad,
  totalAllowedCatch: category?.heildarAflaMark,
  rateOfShare: category?.hlutdeild,
  nextYearQuota: category?.aNaestaArKvoti,
  nextYearFromQuota: category?.afNaestaAriKvoti,
})

export const mapAllowedCatchForShip = (
  info?: AflamarkSkipsUpphafDTO,
): AllowedCatchForShip => ({
  shipInformation: mapShipInformation(info?.skipUpplysingar),
  allowedCatchCategories: (info?.aflamarkstegundir ?? []).map(
    mapAllowedCatchCategory,
  ),
})

const mapChangedAllowedCatchCategory = (
  category: AflamarkstegundirDTO,
): AllowedCatchCategory => ({
  id: category?.kvotategund,
  name: category?.kvotategundHeiti ?? '',
  allocation: category?.uthlutun,
  specialAlloction: category?.serstokUthlutun,
  betweenYears: category?.milliAra,
  betweenShips: category?.milliSkipa,
  allowedCatch: category?.aflamark,
  catch: category?.afli,
  status: category?.stada,
  displacement: category?.tilfaersla,
  newStatus: category?.nyStada,
  nextYear: category?.aNaestaAr,
  excessCatch: category?.umframafli,
  unused: category?.onotad,
})

export const mapChangedAllowedCatchForShip = (
  info?: AflamarkSkipsBreyttDTO,
): AllowedCatchForShip => ({
  shipInformation: mapShipInformation(info?.skipUppl),
  allowedCatchCategories: (info?.aflamarkstegundir ?? []).map(
    mapChangedAllowedCatchCategory,
  ),
})

export const mapFishes = (fishes: FisktegundDTO[]) => {
  return fishes.map((fish) => ({
    id: fish?.fisktegundKodi,
    name: fish?.heiti ?? '',
  }))
}

export const mapQuotaType = (type: AflamarkTegundirByTimabilDTO) => {
  return {
    from: type?.gildirFra ?? '',
    to: type?.gildirTil ?? '',
    id: type?.kvotategund,
    name: type?.kvotategundHeiti ?? '',
  }
}
