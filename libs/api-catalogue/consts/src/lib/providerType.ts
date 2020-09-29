/**
 * Enum for types of providers in X-Road environment
 */
export enum ProviderType {
  /**
   * PRIVATE providers are ignored for indexing to Elastic
   */
  PRIVATE = 1,

  /**
   * PROTECTED providers are added to Elastic indexing but
   * not API Gateway
   */
  PROTECTED = 2,

  /**
   * PUBLIC providers are added to API Gateway additionally to the
   * Elastic indexing
   */
  PUBLIC = 3,
}
