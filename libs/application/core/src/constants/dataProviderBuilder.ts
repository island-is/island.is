interface ApplicationTemplateAPIAction {
  apiModuleAction: string
  shouldPersistToExternalData?: boolean
  externalDataId?: string
  throwOnError: boolean
  order?: number
  namespace?: SharedProviders
  params?: { [key: string]: unknown }
}

enum SharedProviders {
  NationalRegistry = 'NationalRegistry',
  FamilyRelations = 'FamiliRelations',
}

export class TemplateApiBuilder {
  private def: ApplicationTemplateAPIAction

  constructor(apiModuleAction: string, namespace?: SharedProviders) {
    this.def = {
      apiModuleAction,
      shouldPersistToExternalData: false,
      externalDataId: 'string',
      throwOnError: false,
      order: 0,
      namespace,
    }
  }

  shouldPerist() {
    this.def.shouldPersistToExternalData = true
    return this
  }

  setOrder(order: number) {
    this.def.order = order
    return this
  }

  shouldThrowOnError(should: boolean) {
    this.def.throwOnError = should
    return this
  }

  overrideExternalDataId(id: string) {
    this.def.externalDataId = id
    return this
  }

  addParameter(param: { [key: string]: unknown }) {
    this.def.params = {
      ...this.def.params,
      ...param,
    }
    return this
  }

  getDefinition() {
    return this.def
  }
}

export const buildProvider = (apiModuleAction: string): TemplateApiBuilder => {
  return new TemplateApiBuilder(apiModuleAction)
}

////

export const nationalRegistryBuilder = new TemplateApiBuilder(
  'nationalRegistry',
  SharedProviders.NationalRegistry,
)
export const sharedProviders = {
  nationalRegistryBuilder,
}

export const buildSharedProvider = (
  sharedProvider: SharedProviders,
): TemplateApiBuilder => {
  switch (sharedProvider) {
    case SharedProviders.NationalRegistry: {
      return sharedProviders.nationalRegistryBuilder
    }
    default:
      throw new Error(
        `No implementation for shared provider of type ${sharedProvider}`,
      )
  }
}

///
const myProvider = buildProvider('actionName')

const nationalRegistryProvider = buildSharedProvider(
  SharedProviders.NationalRegistry,
)
  .setOrder(0)
  .addParameter({
    coolStuff: 'yay',
  })

const FamilyRelationsProvider = buildSharedProvider(
  SharedProviders.FamilyRelations,
)

FamilyRelationsProvider.overrideExternalDataId('family').shouldThrowOnError(
  false,
)

export const apis = {
  myProvider,
  nationalRegistryProvider,
}

// inn í template ....
apis = [nationalRegistryProvider.setOrder(123), myProvider.setOrder(9)]
