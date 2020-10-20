import { ApplicationTypes } from '@island.is/application/core'

const templates: Record<ApplicationTypes, () => Promise<unknown>> = {
  [ApplicationTypes.EXAMPLE]: () =>
    import('@island.is/application/templates/reference-template'),
  [ApplicationTypes.PARENTAL_LEAVE]: () =>
    import('@island.is/application/templates/parental-leave'),
  [ApplicationTypes.DRIVING_LESSONS]: () =>
    import('@island.is/application/templates/driving-lessons'),
  [ApplicationTypes.APPLICATION_APPLICATION]: () =>
    import('@island.is/application/templates/application-application'),
}

export default templates
