/**
 * Whether the responses of each operation in an OpenAPI document declare a JSON body, keyed by
 * `METHOD /path` as the document writes it and then by the response keys that can answer a 2xx
 * (`200`, `204`, `2XX`, `default`). Generated per client by the openapi-ts plugin in
 * `responseBodiesPlugin.ts`, as `responseBodies` in `responseBodies.gen.ts`.
 */
export type ResponseBodies = Readonly<
  Record<string, Readonly<Record<string, boolean>>>
>

/** The part of an openapi-ts IR response object that {@link toResponseBodies} reads. */
type DocumentedResponse = { mediaType?: string }

type ResponseLike = {
  status: number
  headers: { get(name: string): string | null }
}

type RequestOptionsLike = {
  method?: string
  url: string
  meta?: Record<string, unknown>
}

const jsonMediaType = /^application\/(.*\+)?json(;.*)?$/i
const successResponseKey = /^(2(\d\d|XX)|default)$/i

export const operationKey = (method: string, path: string) =>
  `${method.toUpperCase()} ${path}`

/**
 * One operation's entry in {@link ResponseBodies}. Only JSON bodies count, since an empty text or
 * binary body can be valid.
 */
export const toResponseBodies = (
  responses: Readonly<Record<string, DocumentedResponse | undefined>>,
): Record<string, boolean> => {
  const bodies: Record<string, boolean> = {}

  for (const [key, response] of Object.entries(responses)) {
    if (response && successResponseKey.test(key)) {
      const normalizedKey =
        key.toLowerCase() === 'default' ? 'default' : key.toUpperCase()
      bodies[normalizedKey] = jsonMediaType.test(response.mediaType ?? '')
    }
  }

  return bodies
}

/** Thrown for an empty 2xx whose documented response declares a JSON body. */
export class EmptyResponseBodyError extends Error {
  constructor(operation: string, status: number) {
    super(
      `Empty ${status} response for ${operation}, which the OpenAPI document says has a JSON body`,
    )
    this.name = 'EmptyResponseBodyError'
  }
}

/**
 * An openapi-ts client response interceptor that throws {@link EmptyResponseBodyError} for an
 * empty 2xx when the response the document declares for that status (the exact code, else `2XX`,
 * else `default`) has a JSON body. The generated client returns `{}` for an empty response without
 * parsing or validating it, so it would otherwise pass as a valid body. An operation documenting
 * 200 with a body and 204 without one may answer with an empty 204, but not with an empty 200.
 *
 * A call that accepts an empty body anyway passes `meta: { allowEmptyResponseBody: true }`.
 *
 * ```ts
 * client.interceptors.response.use(requireResponseBodies(responseBodies))
 * ```
 */
export const requireResponseBodies =
  (responseBodies: ResponseBodies) =>
  <R extends ResponseLike>(
    response: R,
    _request: unknown,
    options: RequestOptionsLike,
  ): R => {
    // The test the generated client uses to skip parsing. Any other empty body fails to parse as
    // JSON there.
    const isEmpty =
      response.status === 204 || response.headers.get('Content-Length') === '0'

    if (
      !isEmpty ||
      response.status < 200 ||
      response.status > 299 ||
      options.meta?.allowEmptyResponseBody === true
    ) {
      return response
    }

    const operation = operationKey(options.method ?? 'GET', options.url)
    const bodies = responseBodies[operation]
    const requiresBody =
      bodies?.[response.status] ?? bodies?.['2XX'] ?? bodies?.default

    if (requiresBody) {
      throw new EmptyResponseBodyError(operation, response.status)
    }

    return response
  }
