export interface ExternalLinks {
  /**
   * Fully qualified url to a website containing information
   * about the responsible party/owner of the service.
   */
  responsibleParty: string

  /**
   * Fully qualified url to the API documentation page.
   * Optional.
   */
  documentation?: string

  /**
   * Fully qualified url to an online page or form a
   * consumer can report bugs about the service.
   * Optional.
   */
  bugReport?: string

  /**
   * Gully qualified url to an online page or form a
   * consumer can ask for a new feature in api service.
   * Optional.
   */
  featureRequest?: string
}
