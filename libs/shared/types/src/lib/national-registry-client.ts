/**
 * These are copied from '@island.is/clients/national-registry-v2' to get rid of circular dependencies.
 * Needs to be manually kept in sync. Using these types in `@island.is/api/domains/national-registry-x-road` to
 * get TypeScript errors when the types don't match.
 * Would be nice to extend the client module to map these to english-language DTOs.
 */

export interface NationalRegistryClientAddress {
  /**
   * Street name
   * @type {string}
   */
  heiti: string

  /**
   * Postal code
   * @type {string}
   */
  postnumer?: string | null

  /**
   * Location
   * @type {string}
   */
  stadur?: string | null

  /**
   * Municipality number - definition can be looked up using resources in "Lyklar"
   * @type {string}
   */
  sveitarfelagsnumer?: string | null
}

export interface NationalRegistryClientPerson {
  /**
   * NationalId
   * @type {string}
   */
  kennitala: string

  /**
   * Legal name
   * @type {string}
   */
  nafn: string

  /**
   * First name
   * @type {string}
   */
  eiginnafn?: string | null

  /**
   * Middle name
   * @type {string}
   */
  millinafn?: string | null

  /**
   * Surname
   * @type {string}
   */
  kenninafn?: string | null

  /**
   * Full name
   * @type {string}
   */
  fulltNafn?: string | null

  /**
   * Gender code - definition can be looked up using resources in "Lyklar"
   * @type {string}
   */
  kynkodi: string

  /**
   * Details can be found at: https://www.skra.is/thjonusta/einstaklingar/eg-i-thjodskra/bannmerking-aetlad-einstaklingum/
   * @type {boolean}
   */
  bannmerking: boolean

  /**
   * Date of birth
   * @type {Date}
   */
  faedingardagur: Date

  /**
   * Information about legal domicile
   * @type {NationalRegistryClientAddress}
   */
  logheimili?: NationalRegistryClientAddress | null

  /**
   * Information about residence
   * @type {NationalRegistryClientAddress}
   */
  adsetur?: NationalRegistryClientAddress | null
}
