export interface DocumentInfoDTO {
  /**
   *
   * @type {string}
   * @memberof DocumentInfoDTO
   */
  id?: string
  /**
   *
   * @type {Date}
   * @memberof DocumentInfoDTO
   */
  documentDate?: Date
  /**
   *
   * @type {string}
   * @memberof DocumentInfoDTO
   */
  senderKennitala?: string
  /**
   *
   * @type {string}
   * @memberof DocumentInfoDTO
   */
  senderName?: string
  /**
   *
   * @type {string}
   * @memberof DocumentInfoDTO
   */
  subject?: string
  /**
   *
   * @type {string}
   * @memberof DocumentInfoDTO
   */
  categoryId?: string
  /**
   *
   * @type {boolean}
   * @memberof DocumentInfoDTO
   */
  opened?: boolean
  /**
   *
   * @type {boolean}
   * @memberof DocumentInfoDTO
   */
  withdrawn?: boolean
  /**
   *
   * @type {string}
   * @memberof DocumentInfoDTO
   */
  withdrawnReason?: string
  /**
   *
   * @type {string}
   * @memberof DocumentInfoDTO
   */
  minumumAuthenticationType?: string
}
