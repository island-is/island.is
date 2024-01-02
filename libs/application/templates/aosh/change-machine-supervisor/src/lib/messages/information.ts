import { defineMessages } from 'react-intl'

export const information = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosh.tmo.application:information.general.sectionTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Title of information section',
    },
    pageTitle: {
      id: 'aosh.tmo.application:information.general.pageTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Title of information page',
    },
    description: {
      id: 'aosh.tmo.application:information.general.description',
      defaultMessage:
        'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
      description: 'Description of information page',
    },
  }),
  labels: {
    pickMachine: defineMessages({
      sectionTitle: {
        id: 'aosh.tmo.application:information.labels.pickMachine.sectionTitle',
        defaultMessage: 'Veldu tæki',
        description: 'Pick machine section title',
      },
      title: {
        id: 'aosh.tmo.application:information.labels.pickMachine.title',
        defaultMessage: 'Veldu tæki til eigendaskipta',
        description: 'Pick machine title',
      },
      description: {
        id: 'aosh.tmo.application:information.labels.pickMachine.description',
        defaultMessage:
          'Hér að neðan er listi yfir vélar og tæki í þinni eigu. Veldu það tæki sem þú vilt selja',
        description: 'Pick machine description',
      },
      vehicle: {
        id: 'aosh.tmo.application:information.labels.pickMachine.vehicle',
        defaultMessage: 'Tæki',
        description: 'Pick machine label',
      },
      placeholder: {
        id: 'aosh.tmo.application:information.labels.pickMachine.placeholder',
        defaultMessage: 'Veldu tæki',
        description: 'Pick machine placeholder',
      },
      hasErrorTitle: {
        id: 'aosh.tmo.application:information.labels.pickMachine.hasErrorTitle',
        defaultMessage: 'Ekki er hægt að selja þetta tæki vegna:',
        description: 'Pick machine has an error title',
      },
    }),
    machine: defineMessages({
      sectionTitle: {
        id: 'aosh.tmo.application:information.labels.machine.sectionTitle',
        defaultMessage: 'Tæki',
        description: 'Machine section title',
      },
      title: {
        id: 'aosh.tmo.application:information.labels.machine.title',
        defaultMessage: 'Tæki',
        description: 'Machine title',
      },
      description: {
        id: 'aosh.tmo.application:information.labels.machine.description',
        defaultMessage:
          'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar.',
        description: 'Machine description',
      },
      plate: {
        id: 'aosh.tmo.application:information.labels.machine.plate',
        defaultMessage: 'Plötuskráningarnúmer',
        description: 'Machine plate number label',
      },
      type: {
        id: 'aosh.tmo.application:information.labels.machine.type',
        defaultMessage: 'Tegund',
        description: 'Machine type label',
      },
      date: {
        id: 'aosh.tmo.application:information.labels.machine.date',
        defaultMessage: 'Dagsetning kaupsamnings',
        description: 'Date of purchase agreement label',
      },
      registrationNumber: {
        id: 'aosh.tmo.application:information.labels.machine.registrationNumber',
        defaultMessage: 'Skráningarnúmer',
        description: 'Registration number label',
      },
      category: {
        id: 'aosh.tmo.application:information.labels.machine.category',
        defaultMessage: 'Yfirflokkur',
        description: 'Category label',
      },
      ownerNumber: {
        id: 'aosh.tmo.application:information.labels.machine.ownerNumber',
        defaultMessage: 'Eigandanúmer',
        description: 'Owner number label',
      },
      subType: {
        id: 'aosh.tmo.application:information.labels.machine.subType',
        defaultMessage: 'Gerð',
        description: 'Sub type label',
      },
    }),
    seller: defineMessages({
      sectionTitle: {
        id: 'aosh.tmo.application:information.labels.seller.sectionTitle',
        defaultMessage: 'Seljandi',
        description: 'Seller section title',
      },
      title: {
        id: 'aosh.tmo.application:information.labels.seller.title',
        defaultMessage: 'Seljandi',
        description: 'Seller title',
      },
      subtitle: {
        id: 'aosh.tmo.application:information.labels.seller.subtitle',
        defaultMessage: 'Aðaleigandi',
        description: 'Main owner title',
      },
      description: {
        id: 'aosh.tmo.application:information.labels.seller.description',
        defaultMessage:
          'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar.',
        description: 'Seller description',
      },
      nationalId: {
        id: 'aosh.tmo.application:information.labels.seller.nationalId',
        defaultMessage: 'Kennitala seljanda',
        description: 'Seller national ID label',
      },
      name: {
        id: 'aosh.tmo.application:information.labels.seller.name',
        defaultMessage: 'Nafn seljanda',
        description: 'Seller name label',
      },
      email: {
        id: 'aosh.tmo.application:information.labels.seller.email',
        defaultMessage: 'Netfang',
        description: 'Seller email label',
      },
      phone: {
        id: 'aosh.tmo.application:information.labels.seller.phone',
        defaultMessage: 'Gsm númer',
        description: 'Seller phone number label',
      },
    }),
    machineSubSection: defineMessages({
      error: {
        id: 'aosh.tmo.application:information.labels.machineSubSection.error',
        defaultMessage: 'Það kom upp villa við að sækja upplýsingar um tæki',
        description: 'Machine error message',
      },
    }),
    supervisor: defineMessages({
      title: {
        id: 'aosh.tmo.application:information.labels.supervisor.title',
        defaultMessage: 'Umráðamaður',
        description: 'Operator title',
      },
      description: {
        id: 'aosh.tmo.application:information.labels.supervisor.description',
        defaultMessage:
          'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar.',
        description: 'Operator description',
      },
      nationalId: {
        id: 'aosh.tmo.application:information.labels.supervisor.nationalId',
        defaultMessage: 'Kennitala umráðamanns',
        description: 'Operator national ID label',
      },
      name: {
        id: 'aosh.tmo.application:information.labels.supervisor.name',
        defaultMessage: 'Nafn umráðamanns',
        description: 'Operator name label',
      },
      email: {
        id: 'aosh.tmo.application:information.labels.supervisor.email',
        defaultMessage: 'Netfang',
        description: 'Operator email label',
      },
      phone: {
        id: 'aosh.tmo.application:information.labels.supervisor.phone',
        defaultMessage: 'Gsm númer',
        description: 'Operator phone number label',
      },
      remove: {
        id: 'aosh.tmo.application:information.labels.supervisor.remove',
        defaultMessage: 'Fjarlægja umráðamann',
        description: 'Operator remove label',
      },
      add: {
        id: 'aosh.tmo.application:information.labels.supervisor.add',
        defaultMessage: 'Bæta við umráðamanni',
        description: 'Operator add label',
      },
      identicalError: {
        id: 'ta.cov.application:information.labels.supervisor.identicalError',
        defaultMessage: 'Það má ekki nota sömu kennitölu tvisvar',
        description: 'operator identical error',
      },
    }),
  },
}
