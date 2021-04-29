import { ApplicationConfigurations } from '@island.is/application/core'
import { defineMessages } from 'react-intl'

const t = ApplicationConfigurations.LoginService.translation

export const technicalInfo = {
  general: defineMessages({
    pageTitle: {
      id: `${t}:section.technicalInfo.pageTitle`,
      defaultMessage: 'Tæknilegar upplýsingar',
      description: 'technicalInfo page title',
    },
  }),
  labels: defineMessages({
    type: {
      id: `${t}:section.technicalInfo.type`,
      defaultMessage: 'Tegund þjónustu',
      description: 'Technical Info type label',
    },
    typeDescription: {
      id: `${t}:section.technicalInfo.typeDescription`,
      defaultMessage:
        'Lýsing á þjónustunni sem innskráningin mun veita aðgang að',
      description: 'Technical Info typeDescription label',
    },
    typePlaceholder: {
      id: `${t}:section.technicalInfo.typePlaceholder`,
      defaultMessage: 'Dæmi: Mínar síður...',
      description: 'Technical Info typePlaceholder label',
    },
    devReturnUrl: {
      id: `${t}:section.technicalInfo.devReturnUrl`,
      defaultMessage: 'Dev Return Url',
      description: 'Technical Info devReturnUrl label',
    },
    stagingReturnUrl: {
      id: `${t}:section.technicalInfo.stagingReturnUrl`,
      defaultMessage: 'Staging Return Url',
      description: 'Technical Info stagingReturnUrl label',
    },
    prodReturnUrl: {
      id: `${t}:section.technicalInfo.prodReturnUrl`,
      defaultMessage: 'Production Return Url',
      description: 'Technical Info prodReturnUrl label',
    },
    clientId: {
      id: `${t}:section.technicalInfo.clientId`,
      defaultMessage: 'Client Id',
      description: 'Technical Info clientId label',
    },
    clientIdDescription: {
      id: `${t}:section.technicalInfo.clientIdDescription`,
      defaultMessage:
        'ID sem tengir lögaðila við rétta innskráningarþjónustu og hluti af kallinu í þjónustuna',
      description: 'Technical Info clientIdDescription label',
    },
    clientIdPlaceholder: {
      id: `${t}:section.technicalInfo.clientIdPlaceholder`,
      defaultMessage: 'Dæmi: Vantar...',
      description: 'Technical Info clientIdPlaceholder label',
    },
  }),
}
