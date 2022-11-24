export class TemplateApi<TParams = unknown> {
  // Name of the action that will be run on the API
  // these actions are exported are found in:
  // /libs/application/template-api-modules
  action: string
  // If response/error should be written to application.externalData, defaults to true
  shouldPersistToExternalData?: boolean
  // Id inside application.externalData, value of apiModuleAction is used by default
  private _externalDataId?: string
  // Should the state transition be blocked if this action errors out
  // defaults to true
  throwOnError?: boolean
  order?: number
  actionId: string
  params?: TParams

  constructor(definition: DefineTemplateApi<TParams>) {
    const {
      action,
      namespace,
      order,
      throwOnError,
      params,
      shouldPersistToExternalData,
      externalDataId,
    } = definition

    this.action = action
    this.actionId = namespace ? `${namespace}.${action}` : action
    this._externalDataId = externalDataId

    this.order = order ? order : 0
    this.params = params

    shouldPersistToExternalData !== undefined
      ? (this.shouldPersistToExternalData = shouldPersistToExternalData)
      : (this.shouldPersistToExternalData = true)

    throwOnError !== undefined
      ? (this.throwOnError = throwOnError)
      : (this.throwOnError = true)
  }

  public get externalDataId() {
    return this._externalDataId ? this._externalDataId : this.action
  }

  configure(config: ConfigureTemplateApi<TParams>) {
    const {
      order,
      params,
      shouldPersistToExternalData,
      throwOnError,
      externalDataId,
    } = config

    if (params) {
      this.params = {
        ...this.params,
        ...(params as TParams),
      }
    }

    if (externalDataId) this._externalDataId = externalDataId
    if (order) this.order = order
    if (shouldPersistToExternalData !== undefined)
      this.shouldPersistToExternalData = shouldPersistToExternalData
    if (throwOnError !== undefined) this.throwOnError = throwOnError
    return this
  }
}

interface DefineTemplateApi<TParams = unknown>
  extends Omit<TemplateApi, 'configure' | 'actionId' | 'externalDataId'> {
  externalDataId?: string
  namespace?: string
  params?: TParams
}

interface ConfigureTemplateApi<TParams = unknown>
  extends Pick<
    TemplateApi,
    'shouldPersistToExternalData' | 'order' | 'throwOnError'
  > {
  externalDataId?: string
  params?: Partial<TParams>
}

export const defineTemplateApi = <TParams = unknown>(
  definition: DefineTemplateApi<TParams>,
): TemplateApi<TParams> => {
  return new TemplateApi<TParams>(definition)
}
