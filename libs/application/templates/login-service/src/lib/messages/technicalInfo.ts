import { defineMessages } from 'react-intl'

export const technicalInfo = {
  general: defineMessages({
    pageTitle: {
      id: `ls.application:section.technicalInfo.pageTitle`,
      defaultMessage: 'Tæknilegar upplýsingar',
      description: 'technicalInfo page title',
    },
  }),
  labels: defineMessages({
    type: {
      id: `ls.application:section.technicalInfo.type`,
      defaultMessage: 'Tegund þjónustu',
      description: 'Technical Info type label',
    },
    typeDescription: {
      id: `ls.application:section.technicalInfo.typeDescription`,
      defaultMessage:
        'Lýsing á þjónustunni sem innskráningin mun veita aðgang að',
      description: 'Technical Info typeDescription label',
    },
    typePlaceholder: {
      id: `ls.application:section.technicalInfo.typePlaceholder`,
      defaultMessage: 'Dæmi: Mínar síður...',
      description: 'Technical Info typePlaceholder label',
    },
    devReturnUrl: {
      id: `ls.application:section.technicalInfo.devReturnUrl`,
      defaultMessage: 'Dev Return Url',
      description: 'Technical Info devReturnUrl label',
    },
    stagingReturnUrl: {
      id: `ls.application:section.technicalInfo.stagingReturnUrl`,
      defaultMessage: 'Staging Return Url',
      description: 'Technical Info stagingReturnUrl label',
    },
    prodReturnUrl: {
      id: `ls.application:section.technicalInfo.prodReturnUrl`,
      defaultMessage: 'Production Return Url',
      description: 'Technical Info prodReturnUrl label',
    },
    clientId: {
      id: `ls.application:section.technicalInfo.clientId`,
      defaultMessage: 'Client Id',
      description: 'Technical Info clientId label',
    },
    clientIdDescription: {
      id: `ls.application:section.technicalInfo.clientIdDescription`,
      defaultMessage:
        'ID sem tengir lögaðila við rétta innskráningarþjónustu og hluti af kallinu í þjónustuna',
      description: 'Technical Info clientIdDescription label',
    },
    clientIdPlaceholder: {
      id: `ls.application:section.technicalInfo.clientIdPlaceholder`,
      defaultMessage: 'Dæmi: Vantar...',
      description: 'Technical Info clientIdPlaceholder label',
    },
  }),
}
