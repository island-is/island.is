interface CommonActionErrorFields<Errors> {
  errors?: Errors | null
  /**
   * Global error message if the mutation fails
   */
  globalError?: boolean
}

export type RawRouterActionResponse<Data, Errors> = {
  data: Data | null
} & CommonActionErrorFields<Errors>

export type RouterActionResponse<Data, Errors, Intent extends string> = {
  /**
   * Intent of the form
   */
  intent: Intent
} & RawRouterActionResponse<Data, Errors>

export type RouterActionRedirect<Errors> = CommonActionErrorFields<Errors>
