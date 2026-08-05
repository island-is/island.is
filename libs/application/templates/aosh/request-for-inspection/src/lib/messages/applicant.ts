import { defineMessages } from 'react-intl'

export const applicant = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosh.rifm.application:applicant.general.sectionTitle',
      defaultMessage: 'Persónuupplýsingar',
      description: 'Title of applicant section',
    },
    title: {
      id: 'aosh.rifm.application:applicant.general.title',
      defaultMessage: 'Persónuupplýsingar',
      description: 'Title of applicant page',
    },
    description: {
      id: 'aosh.rifm.application:applicant.general.description',
      defaultMessage:
        'Persónuupplýsingar um innskráðan aðila sem skráir beiðnina.',
      description: 'Description of applicant page',
    },
  }),
  labels: defineMessages({
    name: {
      id: 'aosh.rifm.application:applicant.labels.name',
      defaultMessage: 'Fullt Nafn',
      description: 'Owner name label',
    },
    nationalId: {
      id: 'aosh.rifm.application:applicant.labels.nationalId',
      defaultMessage: 'Kennitala',
      description: 'Owner national ID label',
    },
    address: {
      id: 'aosh.rifm.application:applicant.labels.address',
      defaultMessage: 'Heimilisfang',
      description: 'Owner address label',
    },
    postCode: {
      id: 'aosh.rifm.application:applicant.labels.postCode',
      defaultMessage: 'Póstnúmer',
      description: 'Owner postcode label',
    },
    phone: {
      id: 'aosh.rifm.application:applicant.labels.phone',
      defaultMessage: 'Símanúmer',
      description: 'Owner phone number label',
    },
    email: {
      id: 'aosh.rifm.application:applicant.labels.email',
      defaultMessage: 'Netfang',
      description: 'Owner email label',
    },
  }),
}
