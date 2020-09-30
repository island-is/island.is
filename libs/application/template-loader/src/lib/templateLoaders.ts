import { ApplicationTypes } from '@island.is/application/core'

const templates: Record<ApplicationTypes, () => Promise<unknown>> = {
  [ApplicationTypes.EXAMPLE]: () =>
    import(
      '@island.is/application/templates/reference-template'
    ).then((module) => Promise.resolve(module.default)),
  [ApplicationTypes.PARENTAL_LEAVE]: () =>
    import('@island.is/application/templates/parental-leave').then((module) =>
      Promise.resolve(module.default),
    ),
  [ApplicationTypes.DRIVING_LESSONS]: () =>
    import('@island.is/application/templates/driving-lessons').then((module) =>
      Promise.resolve(module.default),
    ),
}

export default templates
