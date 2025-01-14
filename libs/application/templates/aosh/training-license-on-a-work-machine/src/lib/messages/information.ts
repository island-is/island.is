import { defineMessages } from 'react-intl'

export const information = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosh.tlwm.application:information.general.sectionTitle',
      defaultMessage: 'Umsækjandi',
      description: `Section title for information`,
    },
    title: {
      id: 'aosh.tlwm.application:information.general.title',
      defaultMessage: 'Persónuupplýsingar',
      description: 'Title for information',
    },
    description: {
      id: 'aosh.tlwm.application:information.general.description',
      defaultMessage: 'Upplýsingar um skráningaraðila.',
      description: 'Description for information',
    },
  }),
  labels: defineMessages({
    name: {
      id: 'aosh.tlwm.application:information.labels.name',
      defaultMessage: 'Nafn',
      description: `Information name label`,
    },
    nationalId: {
      id: 'aosh.tlwm.application:information.labels.nationalId',
      defaultMessage: 'Kennitala',
      description: `Information nationalId label`,
    },
    address: {
      id: 'aosh.tlwm.application:information.labels.address',
      defaultMessage: 'Heimilisfang',
      description: `Information address label`,
    },
    postCode: {
      id: 'aosh.tlwm.application:information.labels.postCode',
      defaultMessage: 'Bæjarfélag og póstnúmer',
      description: `Information post code label`,
    },
    phone: {
      id: 'aosh.tlwm.application:information.labels.phone',
      defaultMessage: 'Símanúmer',
      description: `Information phone number label`,
    },
    email: {
      id: 'aosh.tlwm.application:information.labels.email',
      defaultMessage: 'Netfang',
      description: `Information email label`,
    },
    machineLicenseNumber: {
      id: 'aosh.tlwm.application:information.labels.machineLicenseNumber',
      defaultMessage: 'Númer vinnuvélaskírteinis',
      description: `Information machine license number label`,
    },
    driversLicenseNumber: {
      id: 'aosh.tlwm.application:information.labels.driversLicenseNumber',
      defaultMessage: 'Númer ökuskíretinis',
      description: `Information drivers license number label`,
    },
    driversLicenseDate: {
      id: 'aosh.tlwm.application:information.labels.driversLicenseDate',
      defaultMessage: 'Útgáfustaður ökuskíretinis',
      description: `Information drivers license date label`,
    },
  }),
}
