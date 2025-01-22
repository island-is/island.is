import { defineMessages } from 'react-intl'

export const information = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosh.sr.application:information.general.sectionTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Title of information section',
    },
    pageTitle: {
      id: 'aosh.sr.application:information.general.pageTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Title of information page',
    },
    description: {
      id: 'aosh.sr.application:information.general.description',
      defaultMessage:
        'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
      description: 'Description of information page',
    },
    dividerTitle: {
      id: 'aosh.sr.application:information.general.deviderTitle',
      defaultMessage: 'Tengiliðaupplýsingar',
      description: 'Title of information devider',
    },
  }),
  labels: {
    pickMachine: defineMessages({
      sectionTitle: {
        id: 'aosh.sr.application:information.labels.pickMachine.sectionTitle',
        defaultMessage: 'Veldu tæki',
        description: 'Pick machine section title',
      },
      title: {
        id: 'aosh.sr.application:information.labels.pickMachine.title',
        defaultMessage: 'Veldu tæki',
        description: 'Pick machine title',
      },
      description: {
        id: 'aosh.sr.application:information.labels.pickMachine.description',
        defaultMessage:
          'Hér að neðan er listi yfir vélar og tæki í þinni eigu.',
        description: 'Pick machine description',
      },
      vehicle: {
        id: 'aosh.sr.application:information.labels.pickMachine.vehicle',
        defaultMessage: 'Tæki',
        description: 'Pick machine label',
      },
      placeholder: {
        id: 'aosh.sr.application:information.labels.pickMachine.placeholder',
        defaultMessage: 'Veldu tæki',
        description: 'Pick machine placeholder',
      },
      hasErrorTitle: {
        id: 'aosh.sr.application:information.labels.pickMachine.hasErrorTitle',
        defaultMessage: 'Ekki er hægt að götuskrá þetta tæki vegna:',
        description: 'Pick machine has an error title',
      },
      notFoundTitle: {
        id: 'aosh.sr.application:information.labels.pickMachine.notFoundTitle',
        defaultMessage: 'Eitthvað fór úrskeiðis',
        description: 'Pick machine not found title',
      },
      notFoundMessage: {
        id: 'aosh.sr.application:information.labels.pickMachine.notFoundMessage',
        defaultMessage: 'Tæki fannst ekki',
        description: 'Pick machine not found message',
      },
      findRegistrationNumberPlaceholder: {
        id: 'aosh.sr.application:information.labels.pickMachine.findRegistrationNumberPlaceholder',
        defaultMessage: 'Sláðu inn skráningarnúmer',
        description: 'Pick machine find registration number placeholder',
      },
      findButton: {
        id: 'aosh.sr.application:information.labels.pickMachine.findButton',
        defaultMessage: 'Leita',
        description: 'Pick machine find button',
      },
      inspectBeforeRegistration: {
        id: 'aosh.sr.application:information.labels.pickMachine.inspectBeforeRegistration',
        defaultMessage: 'Hafið samband við Vinnueftirlitið til að götuskrá',
        description: 'Pick machine inspect before registration',
      },
      invalidRegistrationType: {
        id: 'aosh.sr.application:information.labels.pickMachine.invalidRegistrationType',
        defaultMessage: 'Ekki er hægt að götuskrá tæki í þessum flokk',
        description: 'Pick machine invalid registration type tag',
      },
    }),
    machine: defineMessages({
      sectionTitle: {
        id: 'aosh.sr.application:information.labels.machine.sectionTitle',
        defaultMessage: 'Tæki',
        description: 'Machine section title',
      },
      title: {
        id: 'aosh.sr.application:information.labels.machine.title',
        defaultMessage: 'Tæki',
        description: 'Machine title',
      },
      description: {
        id: 'aosh.sr.application:information.labels.machine.description',
        defaultMessage:
          'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar.',
        description: 'Machine description',
      },
      plate: {
        id: 'aosh.sr.application:information.labels.machine.plate',
        defaultMessage: 'Plötuskráningarnúmer',
        description: 'Machine plate number label',
      },
      type: {
        id: 'aosh.sr.application:information.labels.machine.type',
        defaultMessage: 'Tegund',
        description: 'Machine type label',
      },
      date: {
        id: 'aosh.sr.application:information.labels.machine.date',
        defaultMessage: 'Dagsetning kaupsamnings',
        description: 'Date of purchase agreement label',
      },
      registrationNumber: {
        id: 'aosh.sr.application:information.labels.machine.registrationNumber',
        defaultMessage: 'Skráningarnúmer',
        description: 'Registration number label',
      },
      category: {
        id: 'aosh.sr.application:information.labels.machine.category',
        defaultMessage: 'Yfirflokkur',
        description: 'Category label',
      },
      ownerNumber: {
        id: 'aosh.sr.application:information.labels.machine.ownerNumber',
        defaultMessage: 'Eigandanúmer',
        description: 'Owner number label',
      },
      subType: {
        id: 'aosh.sr.application:information.labels.machine.subType',
        defaultMessage: 'Gerð',
        description: 'Sub type label',
      },
    }),
    seller: defineMessages({
      sectionTitle: {
        id: 'aosh.sr.application:information.labels.seller.sectionTitle',
        defaultMessage: 'Seljandi',
        description: 'Seller section title',
      },
      title: {
        id: 'aosh.sr.application:information.labels.seller.title',
        defaultMessage: 'Seljandi',
        description: 'Seller title',
      },
      subtitle: {
        id: 'aosh.sr.application:information.labels.seller.subtitle',
        defaultMessage: 'Aðaleigandi',
        description: 'Main owner title',
      },
      description: {
        id: 'aosh.sr.application:information.labels.seller.description',
        defaultMessage:
          'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar.',
        description: 'Seller description',
      },
      nationalId: {
        id: 'aosh.sr.application:information.labels.seller.nationalId',
        defaultMessage: 'Kennitala seljanda',
        description: 'Seller national ID label',
      },
      name: {
        id: 'aosh.sr.application:information.labels.seller.name',
        defaultMessage: 'Nafn seljanda',
        description: 'Seller name label',
      },
      email: {
        id: 'aosh.sr.application:information.labels.seller.email',
        defaultMessage: 'Netfang',
        description: 'Seller email label',
      },
      phone: {
        id: 'aosh.sr.application:information.labels.seller.phone',
        defaultMessage: 'Gsm númer',
        description: 'Seller phone number label',
      },
    }),
    machineSubSection: defineMessages({
      error: {
        id: 'aosh.sr.application:information.labels.machineSubSection.error',
        defaultMessage: 'Það kom upp villa við að sækja upplýsingar um tæki',
        description: 'Machine error message',
      },
    }),
    contact: defineMessages({
      name: {
        id: 'aosh.sr.application:information.labels.contact.name',
        defaultMessage: 'Nafn',
        description: 'Contact name label',
      },
      email: {
        id: 'aosh.sr.application:information.labels.contact.email',
        defaultMessage: 'Netfang',
        description: 'Contact email label',
      },
      phone: {
        id: 'aosh.sr.application:information.labels.contact.phone',
        defaultMessage: 'Gsm númer',
        description: 'Contact phone number label',
      },
    }),
  },
}
