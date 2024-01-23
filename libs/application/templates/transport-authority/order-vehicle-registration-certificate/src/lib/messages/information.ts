import { defineMessages } from 'react-intl'

export const information = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.ovrc.application:information.general.sectionTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Title of information section',
    },
    pageTitle: {
      id: 'ta.ovrc.application:information.general.pageTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Title of information page',
    },
    description: {
      id: 'ta.ovrc.application:information.general.description',
      defaultMessage: 'Skráningarskírteini er aðeins sent á lögheimili eigenda',
      description: 'Description of information page',
    },
  }),
  labels: {
    pickVehicle: defineMessages({
      sectionTitle: {
        id: 'ta.ovrc.application:information.labels.pickVehicle.sectionTitle',
        defaultMessage: 'Veldu ökutæki',
        description: 'Pick vehicle section title',
      },
      title: {
        id: 'ta.ovrc.application:information.labels.pickVehicle.title',
        defaultMessage: 'Veldu ökutæki',
        description: 'Pick vehicle title',
      },
      vehicle: {
        id: 'ta.ovrc.application:information.labels.pickVehicle.vehicle',
        defaultMessage: 'Ökutæki',
        description: 'Pick vehicle label',
      },
      placeholder: {
        id: 'ta.ovrc.application:information.labels.pickVehicle.placeholder',
        defaultMessage: 'Veldu ökutæki',
        description: 'Pick vehicle placeholder',
      },
      findPlatePlaceholder: {
        id: 'ta.ovrc.application:information.labels.pickVehicle.findPlatePlaceholder',
        defaultMessage: 'Sláðu inn plötunúmer',
        description: 'Pick vehicle find plate placeholder',
      },
      findButton: {
        id: 'ta.ovrc.application:information.labels.pickVehicle.findButton',
        defaultMessage: 'Leita',
        description: 'Pick vehicle find button',
      },
      notFoundTitle: {
        id: 'ta.tvo.application:information.labels.pickVehicle.notFoundTitle',
        defaultMessage: 'Ökutæki með plötunúmerið {plate} fannst ekki',
        description: 'vehicle not found',
      },
    }),
    vehicle: defineMessages({
      sectionTitle: {
        id: 'ta.ovrc.application:information.labels.vehicle.sectionTitle',
        defaultMessage: 'Ökutæki',
        description: 'Vehicle section title',
      },
      pageTitle: {
        id: 'ta.ovrc.application:information.vehicle.pageTitle',
        defaultMessage: 'Upplýsingar um ökutæki',
        description: 'Title of information page',
      },
      title: {
        id: 'ta.ovrc.application:information.labels.vehicle.title',
        defaultMessage: 'Ökutæki',
        description: 'Vehicle title',
      },
      plate: {
        id: 'ta.ovrc.application:information.labels.vehicle.plate',
        defaultMessage: 'Númer ökutækis',
        description: 'Vehicle plate number label',
      },
      type: {
        id: 'ta.ovrc.application:information.labels.vehicle.type',
        defaultMessage: 'Tegund ökutækis',
        description: 'Vehicle type label',
      },
    }),
    owner: defineMessages({
      title: {
        id: 'ta.ovrc.application:information.labels.owner.title',
        defaultMessage: 'Eigandi',
        description: 'Owner title',
      },
      nationalId: {
        id: 'ta.ovrc.application:information.labels.owner.nationalId',
        defaultMessage: 'Kennitala',
        description: 'Owner national ID label',
      },
      name: {
        id: 'ta.ovrc.application:information.labels.owner.name',
        defaultMessage: 'Nafn',
        description: 'Owner name label',
      },
      address: {
        id: 'ta.ovrc.application:information.labels.owner.address',
        defaultMessage: 'Lögheimili',
        description: 'Owner address label',
      },
      postalcode: {
        id: 'ta.ovrc.application:information.labels.owner.postalcode',
        defaultMessage: 'Póstnúmer',
        description: 'Owner postalcode label',
      },
      alertAddress: {
        id: 'ta.ovrc.application:information.labels.owner.alertAddress',
        defaultMessage:
          'ATH. Skráningarskírteinið verður sent á lögheimili eiganda: {address}',
        description: 'Owner alert address label',
      },
      error: {
        id: 'ta.ovrc.application:information.labels.owner.error',
        defaultMessage: 'Það kom upp villa við að sækja upplýsingar um bifreið',
        description: 'Owner error message',
      },
    }),
    coOwner: defineMessages({
      title: {
        id: 'ta.ovrc.application:information.labels.coOwner.title',
        defaultMessage: 'Meðeigandi',
        description: 'Co owner title',
      },
    }),
  },
}
