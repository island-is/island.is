export type PerformActionResult =
  | {
      success: true
      response: unknown
    }
  | {
      success: false
      error: string
    }
