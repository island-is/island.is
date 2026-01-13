import { defineMessages } from 'react-intl'

export const selectVehicle = {
  general: defineMessages({
    sectionTitle: {
      id: 'mcar.application:information.general.sectionTitle',
      defaultMessage: 'Ökutæki',
      description: 'Title of information section',
    },
    pageTitle: {
      id: 'mcar.application:information.general.pageTitle',
      defaultMessage: 'Veldu ökutæki sem á að skrá sem mílubíl',
      description: 'Title of information page',
    },
    description: {
      id: 'mcar.application:information.general.description',
      defaultMessage:
        'Hér að neðan er listi yfir ökutæki í þinni eigu. Veldu það ökutæki sem á að breyta skráningu á.',
      description: 'Description of information page',
    },
  }),
  labels: defineMessages({
    title: {
      id: 'mcar.application:information.labels.pickVehicle.title',
      defaultMessage: 'Veldu ökutæki sem á að skrá sem mílubíl',
      description: 'Pick vehicle title',
    },
    submit: {
      id: 'mcar.application:information.labels.pickVehicle.submit',
      defaultMessage: 'Breyta skráningu',
      description: 'Pick vehicle submit button',
    },
    vehicle: {
      id: 'mcar.application:information.labels.pickVehicle.vehicle',
      defaultMessage: 'Ökutæki',
      description: 'Pick vehicle label',
    },
    placeholder: {
      id: 'mcar.application:information.labels.pickVehicle.placeholder',
      defaultMessage: 'Veldu ökutæki',
      description: 'Pick vehicle placeholder',
    },
    findPlatePlaceholder: {
      id: 'mcar.application:information.labels.pickVehicle.findPlatePlaceholder',
      defaultMessage: 'Sláðu inn plötunúmer',
      description: 'Pick vehicle find plate placeholder',
    },
    findButton: {
      id: 'mcar.application:information.labels.pickVehicle.findButton',
      defaultMessage: 'Leita',
      description: 'Pick vehicle find button',
    },
    notFoundTitle: {
      id: 'mcar.application:information.labels.pickVehicle.notFoundTitle',
      defaultMessage: 'Eitthvað fór úrskeiðis',
      description: 'vehicle not found',
    },
    notFoundMessage: {
      id: 'mcar.application:information.labels.pickVehicle.notFoundMessage',
      defaultMessage: 'Ökutæki með plötunúmerið {plate} fannst ekki',
      description: 'vehicle not found message',
    },
    plate: {
      id: 'mcar.application:information.labels.vehicle.plate',
      defaultMessage: 'Númer ökutækis',
      description: 'Vehicle plate number label',
    },
  }),
  validation: defineMessages({
    requiredValidVehicle: {
      id: 'mcar.application:information.validation.requiredValidVehicle',
      defaultMessage: 'Þetta ökutæki er nú þegar skráð sem mílubíll',
      description: 'Error message if the vehicle chosen is already a mile car',
    },
  }),
  errors: defineMessages({
    requiredValidVehicle: {
      id: 'mcar.application:error.requiredValidVehicle',
      defaultMessage: 'Ökutæki þarf að vera gilt',
      description:
        'Error message if the vehicle chosen is invalid or not chosen',
    },
  }),
}
