export enum ProblemType {
  HTTP_NO_CONTENT = 'https://httpstatuses.org/204',
  HTTP_BAD_REQUEST = 'https://httpstatuses.org/400',
  HTTP_UNAUTHORIZED = 'https://httpstatuses.org/401',
  HTTP_FORBIDDEN = 'https://httpstatuses.org/403',
  HTTP_NOT_FOUND = 'https://httpstatuses.org/404',
  HTTP_INTERNAL_SERVER_ERROR = 'https://httpstatuses.org/500',
  VALIDATION_FAILED = 'https://docs.devland.is/reference/problems/validation-failed',
  BAD_SUBJECT = 'https://docs.devland.is/reference/problems/bad-subject',
  TEMPLATE_API_ERROR = 'https://docs.devland.is/reference/problems/template-api-error',
  ATTEMPT_FAILED = 'https://docs.devland.is/reference/problems/attempt-failed',
  BAD_SESSION = 'https://docs.devland.is/reference/problems/bad-session',
}
