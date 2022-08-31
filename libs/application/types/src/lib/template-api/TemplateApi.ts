export interface AnyParamsObject {
  [key: string]: any
}

export class TemplateApi<TParams = AnyParamsObject> {
  // Name of the action that will be run on the API
  // these actions are exported are found in:
  // /libs/application/template-api-modules
  action: string
  // If response/error should be written to application.externalData, defaults to true
  shouldPersistToExternalData?: boolean
  // Id inside application.externalData, value of apiModuleAction is used by default
  externalDataId?: string
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
    } = definition

    this.action = action
    this.actionId = namespace ? `${namespace}.${action}` : action

    this.order = order ? order : 0
    this.params = params

    shouldPersistToExternalData !== undefined
      ? (this.shouldPersistToExternalData = shouldPersistToExternalData)
      : (this.shouldPersistToExternalData = true)

    throwOnError !== undefined
      ? (this.throwOnError = throwOnError)
      : (this.throwOnError = true)
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

    if (externalDataId) this.externalDataId = externalDataId
    if (order) this.order = order
    if (shouldPersistToExternalData !== undefined)
      this.shouldPersistToExternalData = shouldPersistToExternalData
    if (throwOnError !== undefined) this.throwOnError = throwOnError
    return this
  }
}

interface DefineTemplateApi<TParams = AnyParamsObject>
  extends Omit<TemplateApi, 'configure' | 'actionId'> {
  namespace?: string
  params?: TParams
}

interface ConfigureTemplateApi<TParams = AnyParamsObject>
  extends Pick<
    TemplateApi,
    'shouldPersistToExternalData' | 'order' | 'throwOnError' | 'externalDataId'
  > {
  params?: Partial<TParams>
}

export const defineTemplateApi = <TParams = AnyParamsObject>(
  definition: DefineTemplateApi<TParams>,
): TemplateApi<TParams> => {
  return new TemplateApi<TParams>(definition)
}

/**
 * - Vinna beint með providers. defineProvider + configure, eða eitthvað.
 * - Getum smíðað "actionId" til að tengja saman form builder og api.
 * - Pæla í naming...
 * -
 *
 *
 * Naming?
 * ++ TemplateApi, api.
 *
 * namespace -
 * action - Mætti vera styttra, action?
 * actionId -
 * provider - Meikar sense í external data provider samhengi, en mætti kannski vera almennara til að covera fleiri use case. Api?
 * externalDataId -
 */
