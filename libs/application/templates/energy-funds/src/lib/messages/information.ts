import { defineMessages } from 'react-intl'

export const information = {
  general: defineMessages({
    sectionTitle: {
      id: 'ef.application:information.general.sectionTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Title of information section',
    },
    pageTitle: {
      id: 'ef.application:information.general.pageTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Title of information page',
    },
  }),
  labels: {
    vehicle: defineMessages({
      sectionTitle: {
        id: 'ef.application:information.labels.vehicle.sectionTitle',
        defaultMessage: 'Ökutæki',
        description: 'Vehicle section title',
      },
      pageTitle: {
        id: 'ef.application:information.vehicle.pageTitle',
        defaultMessage: 'Upplýsingar um ökutæki',
        description: 'Title of information page',
      },
      title: {
        id: 'ef.application:information.labels.vehicle.title',
        defaultMessage: 'Ökutæki',
        description: 'Vehicle title',
      },
      description: {
        id: 'ef.application:information.labels.vehicle.title',
        defaultMessage:
          'Athugaðu að ekki er veittur styrkur fyrir kaup á bifreiðum sem kosta meira en 10.000.000,-',
        description: 'Vehicle description',
      },
      plate: {
        id: 'ef.application:information.labels.vehicle.plate',
        defaultMessage: 'Númer ökutækis',
        description: 'Vehicle plate number label',
      },
      type: {
        id: 'ef.application:information.labels.vehicle.type',
        defaultMessage: 'Tegund ökutækis',
        description: 'Vehicle type label',
      },
    }),
    pickVehicle: defineMessages({
      sectionTitle: {
        id: 'ef.application:information.labels.pickVehicle.sectionTitle',
        defaultMessage: 'Veldu ökutæki',
        description: 'Pick vehicle section title',
      },
      title: {
        id: 'ef.application:information.labels.pickVehicle.title',
        defaultMessage: 'Veldu ökutæki sem á að sækja um styrk fyrir',
        description: 'Pick vehicle title',
      },
      description: {
        id: 'ef.application:information.labels.pickVehicle.description',
        defaultMessage:
          'Hér að neðan er listi yfir ökutæki í þinni eigu, nýskráðir frá og með 1. janúar 2024. Veldu það ökutæki sem á að sækja um fyrir.',
        description: 'Pick vehicle description',
      },
      vehicle: {
        id: 'ef.application:information.labels.pickVehicle.vehicle',
        defaultMessage: 'Ökutæki',
        description: 'Pick vehicle label',
      },
      placeholder: {
        id: 'ef.application:information.labels.pickVehicle.placeholder',
        defaultMessage: 'Veldu ökutæki',
        description: 'Pick vehicle placeholder',
      },
      checkboxNotCheckable: {
        id: 'ef.application:information.labels.pickVehicle.checkboxNotCheckable',
        defaultMessage: 'Ökutækið hefur nú þegar fengið styrk',
        description: 'Checkbox not checkable tag label',
      },
      checkboxCheckableTag: {
        id: 'ef.application:information.labels.pickVehicle.checkboxCheckableTag',
        defaultMessage: 'Styrkur {amount}',
        description: 'Checkbox checkable tag label',
      },
    }),
  },
}
