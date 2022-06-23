/**
 *
 * @export
 * @interface Vehicle
 */
export interface Vehicle {
  /**
   *
   * @type {boolean}
   * @memberof Vehicle
   */
  isCurrent?: boolean
  /**
   *
   * @type {string}
   * @memberof Vehicle
   */
  permno?: string | null
  /**
   *
   * @type {string}
   * @memberof Vehicle
   */
  regno?: string | null
  /**
   *
   * @type {string}
   * @memberof Vehicle
   */
  vin?: string | null
  /**
   *
   * @type {string}
   * @memberof Vehicle
   */
  type?: string | null
  /**
   *
   * @type {string}
   * @memberof Vehicle
   */
  color?: string | null
  /**
   *
   * @type {string}
   * @memberof Vehicle
   */
  firstRegDate?: string | null
  /**
   *
   * @type {string}
   * @memberof Vehicle
   */
  modelYear?: string | null
  /**
   *
   * @type {string}
   * @memberof Vehicle
   */
  productYear?: string | null
  /**
   *
   * @type {string}
   * @memberof Vehicle
   */
  registrationType?: string | null
  /**
   *
   * @type {string}
   * @memberof Vehicle
   */
  role?: string | null
  /**
   *
   * @type {string}
   * @memberof Vehicle
   */
  operatorStartDate?: string | null
  /**
   *
   * @type {string}
   * @memberof Vehicle
   */
  operatorEndDate?: string | null
  /**
   *
   * @type {boolean}
   * @memberof Vehicle
   */
  outOfUse?: boolean
  /**
   *
   * @type {boolean}
   * @memberof Vehicle
   */
  otherOwners?: boolean
  /**
   *
   * @type {string}
   * @memberof Vehicle
   */
  termination?: string | null
  /**
   *
   * @type {string}
   * @memberof Vehicle
   */
  buyerPersidno?: string | null
  /**
   *
   * @type {string}
   * @memberof Vehicle
   */
  ownerPersidno?: string | null
  /**
   *
   * @type {string}
   * @memberof Vehicle
   */
  vehicleStatus?: string | null
  /**
   *
   * @type {string}
   * @memberof Vehicle
   */
  useGroup?: string | null
  /**
   *
   * @type {string}
   * @memberof Vehicle
   */
  vehGroup?: string | null
  /**
   *
   * @type {string}
   * @memberof Vehicle
   */
  plateStatus?: string | null
}

/**
 *
 * @export
 * @interface PersidnoLookup
 */
export interface UsersVehicles {
  /**
   *
   * @type {string}
   * @memberof PersidnoLookup
   */
  persidno?: string | null
  /**
   *
   * @type {string}
   * @memberof PersidnoLookup
   */
  name?: string | null
  /**
   *
   * @type {string}
   * @memberof PersidnoLookup
   */
  address?: string | null
  /**
   *
   * @type {string}
   * @memberof PersidnoLookup
   */
  postStation?: string | null
  /**
   *
   * @type {Array<Vehicle>}
   * @memberof PersidnoLookup
   */
  vehicleList?: Array<Vehicle> | null
  /**
   *
   * @type {string}
   * @memberof PersidnoLookup
   */
  createdTimestamp?: string | null
}
