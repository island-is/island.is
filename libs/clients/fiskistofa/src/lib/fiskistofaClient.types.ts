export interface ShipInformation {
  /** Einkennisnúmer skips */
  id: string

  /** Skipaskrárnúmer */
  shipNumber?: number

  /** Heiti skips */
  name: string

  /** Fiskveiðiár */
  timePeriod: string
}

export interface AllowedCatchCategory {
  /** Auðkenni fisktegundar */
  id?: number

  /** Heiti fisktegundar */
  name: string

  /** Magn sem skip fékk úthlutað af fisktegund á timabilinu */
  allocation?: number

  /** Magn sem skip fékk úthlutað sérstaklega af fisktegund á tímabilinu */
  specialAlloction?: number

  /** Magn sem skip setti á milli fiskveiðiára af fisktegund*/
  betweenYears?: number

  /** Magn sem skip setti á milli skipa af fisktegund*/
  betweenShips?: number

  /** Magn aflamarks skips fyrir fisktegund (uthlutun, serstok_uthlutun, milli_ara, milli_skipa lagt saman) */
  allowedCatch?: number

  /** Magn af fisktegund sem skipið hefur raunverulega veitt á tímabilinu */
  catch?: number

  /** Staða skips á tímabilinu (afli dreginn frá aflamarki) */
  status?: number

  /** Magn sem skip hefur fært til af fisktegund á aðrar fisktegundir á tímabilinu */
  displacement?: number

  /** Uppfærð staða skips (tekið tillit af tilfærslu: tilfærsla dregin frá stöðu) */
  newStatus?: number

  /** Magn sem skip sendir á næsta ár af fisktegund fyrir tímabilið */
  nextYear?: number

  /** Magn umframafla tegundar fyrir skip á tímabilinu */
  excessCatch?: number

  /** Magn fisktegundar sem er ónotuð eftir útreikninga á tímabilinu */
  unused?: number

  /** Magn heildaraflamarks tiltekinnar fisktegundar á tímabilinu */
  totalAllowedCatch?: number

  /** Hlutfall hlutdeildar sem skip á í fisktegund á tímabilinu. (0,5 => 0,5%) */
  rateOfShare?: number

  /** Magn sem skip setur yfir á næsta ár af fisktegund fyrir tímabil út frá kvóta */
  nextYearQuota?: number

  /** Magn sem skip tekur af næsta ári af fisktegund fyrir tímabil út frá kvóta */
  nextYearFromQuota?: number
}

export interface AllowedCatchForShip {
  shipInformation: ShipInformation
  allowedCatchCategories: AllowedCatchCategory[]
}
