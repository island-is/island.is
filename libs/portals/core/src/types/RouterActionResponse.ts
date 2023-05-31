export interface RouterActionResponse<Data, Errors, Intent extends string> {
  data: Data | null
  errors?: Errors | null
  /**
   * Global error message if the mutation fails
   */
  globalError?: boolean
  /**
   * Intent of the form
   */
  intent: Intent
}
