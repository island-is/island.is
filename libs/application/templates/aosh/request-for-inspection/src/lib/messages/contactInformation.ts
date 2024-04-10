import { defineMessages } from 'react-intl'

export const contactInformation = {
  general: defineMessages({
    title: {
      id: 'aosh.rifm.application:contactInformation.general.title',
      defaultMessage: 'Tengiliðaupplýsingar',
      description: 'Title of contactInformation screen',
    },
    description: {
      id: 'aosh.rifm.application:contactInformation.general.description',
      defaultMessage:
        'Vélaeftirlitsmaður mun í framhaldinu hafa samband við skráðan tengilið til að finna tíma fyrir skoðun á tæki.',
      description: 'Description of contactInformation screen',
    },
  }),
  labels: defineMessages({
    name: {
      id: 'aosh.rifm.application:contactInformation.labels.name',
      defaultMessage: 'Nafn',
      description: 'contactInformation name title',
    },
    phoneNumber: {
      id: 'aosh.rifm.application:contactInformation.labels.phoneNumber',
      defaultMessage: 'Símanúmer',
      description: 'contactInformation phoneNumber label',
    },
    email: {
      id: 'aosh.rifm.application:contactInformation.labels.postCodeLabel',
      defaultMessage: 'Netfang',
      description: 'contactInformation email label',
    },
    approveButton: {
      id: 'aosh.rifm.application:contactInformation.labels.approveButton',
      defaultMessage: 'Staðfesta',
      description: 'contactInformation approveButton label',
    },
  }),
}
