import type {
  AflamarkSkipsBreyttDTO,
  AflamarkSkipsUpphafDTO,
  AflamarkSkipsUpplDTO,
  AflamarkstegundirDTO,
  AflamarkTegundirByTimabilDTO,
  FisktegundDTO,
} from '../../gen/fetch'
import type { CatchQuotaCategory, ShipStatus, ShipInformation } from './types'

const mapShipInformation = (info?: AflamarkSkipsUpplDTO): ShipInformation => ({
  id: info?.einkenni ?? '',
  shipNumber: info?.skipaskrarNumer,
  name: info?.heitiSkips ?? '',
  timePeriod: info?.timabil ?? '',
})

// TODO: Add "Úthlutað aflamark" -> allocatedCatchQuota once the backend returns it
const mapCatchQuotaCategoryForTimePeriod = (
  category: AflamarkstegundirDTO,
): CatchQuotaCategory => ({
  id: category?.kvotategund,
  name: category?.kvotategundHeiti ?? '',
  allocation: category?.uthlutun,
  specialAlloction: category?.serstokUthlutun,
  betweenYears: category?.milliAra,
  betweenShips: category?.milliSkipa,
  catchQuota: category?.aflamark,
  catch: category?.afli,
  status: category?.stada,
  displacement: category?.tilfaersla,
  newStatus: category?.nyStada,
  nextYear: category?.aNaestaAr,
  excessCatch: category?.umframafli,
  unused: category?.onotad,
  totalCatchQuota: category?.heildarAflaMark,
  quotaShare: category?.hlutdeild,
  nextYearQuota: category?.aNaestaArKvoti,
  nextYearFromQuota: category?.afNaestaAriKvoti,
  percentNextYearQuota: category?.prosentaANaestaArKvoti,
  percentNextYearFromQuota: category?.prosentaAfNaestaAriKvoti,
})

export const mapShipStatusForTimePeriod = (
  info?: AflamarkSkipsUpphafDTO,
): ShipStatus => ({
  shipInformation: mapShipInformation(info?.skipUpplysingar),
  catchQuotaCategories: (info?.aflamarkstegundir ?? []).map(
    mapCatchQuotaCategoryForTimePeriod,
  ),
})

const mapCatchQuotaCategoryForCalendarYear = (
  category: AflamarkstegundirDTO,
): CatchQuotaCategory => ({
  id: category?.kvotategund,
  name: category?.kvotategundHeiti ?? '',
  allocation: category?.uthlutun,
  specialAlloction: category?.serstokUthlutun,
  betweenYears: category?.milliAra,
  betweenShips: category?.milliSkipa,
  catchQuota: category?.aflamark,
  catch: category?.afli,
  status: category?.stada,
  displacement: category?.tilfaersla,
  newStatus: category?.nyStada,
  nextYear: category?.aNaestaAr,
  excessCatch: category?.umframafli,
  unused: category?.onotad,
})

export const mapShipStatusForCalendarYear = (
  info?: AflamarkSkipsBreyttDTO,
): ShipStatus => ({
  shipInformation: mapShipInformation(info?.skipUppl),
  catchQuotaCategories: (info?.aflamarkstegundir ?? []).map(
    mapCatchQuotaCategoryForCalendarYear,
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
