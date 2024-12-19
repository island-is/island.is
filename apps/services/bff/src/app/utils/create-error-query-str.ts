export type CreateErrorQueryStrArgs = {
  statusCode: number
  message?: string
  code?: string
}

/**
 * This utility function creates a query string with the error details
 */
export const createErrorQueryStr = ({
  statusCode,
  code,
  message,
}: CreateErrorQueryStrArgs) => {
  return new URLSearchParams({
    bff_error_status_code: statusCode.toString(),
    ...(message && {
      bff_error_message: message,
    }),
    ...(code && { bff_error_code: code }),
  }).toString()
}
