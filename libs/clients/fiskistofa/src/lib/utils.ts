import type {
  AflamarkSkipsBreyttDTO,
  AflamarkSkipsUpphafDTO,
  AflamarkSkipsUpplDTO,
  AflamarkstegundirDTO,
  AflamarkTegundirByTimabilDTO,
} from '../../gen/fetch'
import type {
  CatchQuotaCategory,
  ShipStatus,
  ShipInformation,
  QuotaType,
} from './types'

const mapShipInformation = (info?: AflamarkSkipsUpplDTO): ShipInformation => ({
  id: info?.einkenni ?? '',
  shipNumber: info?.skipaskrarNumer,
  name: info?.heitiSkips ?? '',
  timePeriod: info?.timabil ?? '',
})

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
  quotaShare: category?.hlutdeild,
  nextYearQuota: category?.aNaestaArKvoti,
  nextYearFromQuota: category?.afNaestaAriKvoti,
  percentNextYearQuota: category?.prosentaANaestaArKvoti,
  percentNextYearFromQuota: category?.prosentaAfNaestaAriKvoti,
  allocatedCatchQuota: category?.uthlutadAflamarkKvoti,
  codEquivalent: category?.thorskigildi,

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  totalCatchQuota: (category as unknown as any)?.heildarAflamark,
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
  codEquivalent: category?.thorskigildi,
})

export const mapShipStatusForCalendarYear = (
  info?: AflamarkSkipsBreyttDTO,
): ShipStatus => ({
  shipInformation: mapShipInformation(info?.skipUppl),
  catchQuotaCategories: (info?.aflamarkstegundir ?? []).map(
    mapCatchQuotaCategoryForCalendarYear,
  ),
})

export const mapQuotaType = (type: AflamarkTegundirByTimabilDTO): QuotaType => {
  return {
    id: type?.kvotategund,
    name: type?.kvotategundHeiti ?? '',
    codEquivalent: type?.thorskigildi,
    totalCatchQuota: type?.heildarAflamark,
  }
}
