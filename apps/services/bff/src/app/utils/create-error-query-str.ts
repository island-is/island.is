export type CreateErrorQueryStrArgs = {
  code: number
  error: string
}

/**
 * This utility function creates a query string with the bff_error and bff_error_description parameters
 */
export const createErrorQueryStr = ({
  code,
  error,
}: CreateErrorQueryStrArgs) => {
  return new URLSearchParams({
    bff_error_code: code.toString(),
    bff_error_description: error,
  }).toString()
}
