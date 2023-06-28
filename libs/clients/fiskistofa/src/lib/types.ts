export interface ShipInformation {
  /** einkenni - Einkennisnúmer skips */
  id: string

  /** skipaskrarnumber - Skipaskrárnúmer */
  shipNumber?: number

  /** heitiSkips - Heiti skips */
  name: string

  /** timabil - Fiskveiðiár */
  timePeriod: string
}

export interface CatchQuotaCategory {
  /** kvotategund - Auðkenni fisktegundar */
  id?: number

  /** kvotategundHeiti - Heiti fisktegundar */
  name: string

  /** uthlutun - Magn sem skip fékk úthlutað af fisktegund á timabilinu */
  allocation?: number

  /** serstokUthlutun - Magn sem skip fékk úthlutað sérstaklega af fisktegund á tímabilinu */
  specialAlloction?: number

  /** milliAra - Magn sem skip setti á milli fiskveiðiára af fisktegund*/
  betweenYears?: number

  /** milliSkipa - Magn sem skip setti á milli skipa af fisktegund*/
  betweenShips?: number

  /** aflamark - Magn aflamarks skips fyrir fisktegund (uthlutun, serstok_uthlutun, milli_ara, milli_skipa lagt saman) */
  catchQuota?: number

  /** afli - Magn af fisktegund sem skipið hefur raunverulega veitt á tímabilinu */
  catch?: number

  /** stada - Staða skips á tímabilinu (afli dreginn frá aflamarki) */
  status?: number

  /** tilfaersla - Magn sem skip hefur fært til af fisktegund á aðrar fisktegundir á tímabilinu */
  displacement?: number

  /** nyStada - Uppfærð staða skips (tekið tillit af tilfærslu: tilfærsla dregin frá stöðu) */
  newStatus?: number

  /** aNaestaAr - Magn sem skip sendir á næsta ár af fisktegund fyrir tímabilið */
  nextYear?: number

  /** umframafli - Magn umframafla tegundar fyrir skip á tímabilinu */
  excessCatch?: number

  /** onotad - Magn fisktegundar sem er ónotuð eftir útreikninga á tímabilinu */
  unused?: number

  /** heildarAflamark - Magn heildaraflamarks tiltekinnar fisktegundar á tímabilinu */
  totalCatchQuota?: number

  /** hlutdeild - Hlutfall hlutdeildar sem skip á í fisktegund á tímabilinu. (0,5 => 0,5%) */
  quotaShare?: number

  /** ANaestaArKvoti - Magn sem skip setur yfir á næsta ár af fisktegund fyrir tímabil út frá kvóta */
  nextYearQuota?: number

  /** afNaestaAriKvoti - Magn sem skip tekur af næsta ári af fisktegund fyrir tímabil út frá kvóta */
  nextYearFromQuota?: number

  /** prosentaANaestaArKvoti - Föst prósenta sem skip þarf að setja á næsta ár af fisktegund fyrir tímabil út frá kvóta */
  percentNextYearQuota?: number

  /** prosentaAfNaestaArKvoti - Föst prósenta sem skip þarf að setja af næsta ári af fisktegund fyrir tímabil út frá kvóta */
  percentNextYearFromQuota?: number

  /** Úthlutað/Áætlað aflamark */
  allocatedCatchQuota?: number

  /** thorskigildi - Þorskígildi fisktegundar. Stuðull sem segir til um verðmæti fisktegundar út frá þorsk */
  codEquivalent?: number
}

export interface ShipStatus {
  /** skipUpplysingar */
  shipInformation: ShipInformation
  /** aflamarkstegundir */
  catchQuotaCategories: CatchQuotaCategory[]
}

/** Kvótategund */
export interface QuotaType {
  /** kvotategund */
  id?: number

  /** kvotategundHeiti */
  name: string

  /** thorskigildi */
  codEquivalent?: number

  /** heildarAflamark */
  totalCatchQuota?: number
}
