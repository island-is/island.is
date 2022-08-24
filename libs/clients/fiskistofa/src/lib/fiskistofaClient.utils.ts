import type {
  AflamarkSkipsUpphafDTO,
  AflamarkSkipsUpplDTO,
  AflamarkstegundirDTO,
} from '../../gen/fetch'
import type {
  AllowedCatchCategory,
  AllowedCatchForShip,
  ShipInformation,
} from './fiskiStofaClient.types'

const mapShipInformation = (info?: AflamarkSkipsUpplDTO): ShipInformation => ({
  id: info?.einkenni ?? '',
  shipNumber: info?.skipNr,
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
  betweenYears: category?.milliSkipa,
  betweenShips: category?.milliAra,
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
  info: AflamarkSkipsUpphafDTO,
): AllowedCatchForShip => ({
  shipInformation: mapShipInformation(info.skipUpplysingar),
  allowedCatchCategories: (info.aflamarkstegundir ?? []).map(
    mapAllowedCatchCategory,
  ),
})
