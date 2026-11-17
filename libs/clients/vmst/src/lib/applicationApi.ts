import {
  ApplicationApi,
  ApplicationGetApplicationRequest,
  ApplicationResponse,
  ApplicationResponseFromJSON,
} from '../../gen/fetch'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * VMST's `GET /applications/{applicationId}` returns the application itself,
 * not wrapped in `{ application }` as the generated client describes. Both are
 * read, so callers still get `ApplicationResponse`.
 */
export const applicationResponseFromJson = (
  json: unknown,
): ApplicationResponse => {
  if (!isRecord(json)) {
    return {}
  }

  return ApplicationResponseFromJSON(
    'application' in json ? json : { application: json },
  )
}

/** `ApplicationApi` that reads an application in the shape VMST returns. */
export class VmstApplicationApi extends ApplicationApi {
  async applicationGetApplication(
    requestParameters: ApplicationGetApplicationRequest,
  ): Promise<ApplicationResponse> {
    const response = await this.applicationGetApplicationRaw(requestParameters)

    return applicationResponseFromJson(await response.raw.json())
  }
}
