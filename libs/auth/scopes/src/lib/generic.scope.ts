export enum GenericScope {
  /**
   * This scope is assigned to users
   * It ensures the token is allowed to communicate within the island.is ecosystem
   */
  internal = '@island.is/internal',

  /**
   * This scope is assigned to systems
   * It ensures endpoints are not accessible to request with user tokens
   * Only systems within island.is should be able to acquire this token
   */
  system = '@island.is/system',
}
