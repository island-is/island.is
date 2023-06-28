interface CommonActionErrorFields<Errors> {
  errors?: Errors | null
  /**
   * Global error message if the mutation fails
   */
  globalError?: boolean
}

export type RouterActionResponse<Data, Errors, Intent extends string> = {
  data: Data | null
  /**
   * Intent of the form
   */
  intent: Intent
} & CommonActionErrorFields<Errors>

export type RouterActionRedirect<Errors> = CommonActionErrorFields<Errors>
