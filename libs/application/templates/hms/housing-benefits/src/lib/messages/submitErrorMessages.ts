import { defineMessages } from 'react-intl'

export const submitErrorMessages = defineMessages({
  unknown: {
    id: 'hb.application:submit.error.unknown',
    defaultMessage: 'Óvænt villa kom upp við að innsendingu umsóknar.',
    description: 'HMS error code: unknown',
  },
  nullApplicationPayload: {
    id: 'hb.application:submit.error.nullApplicationPayload',
    defaultMessage: 'Ekki tókst að vinna umsóknina. Vinsamlegast reyndu aftur.',
    description: 'HMS error code: nullApplicationPayload',
  },
  invalidModelState: {
    id: 'hb.application:submit.error.invalidModelState',
    defaultMessage: 'Umsóknin uppfyllir ekki kröfur kerfisins.',
    description: 'HMS error code: invalidModelState',
  },
  propertyNotFound: {
    id: 'hb.application:submit.error.propertyNotFound',
    defaultMessage: 'Fasteign númer {propertyNumber} fannst ekki.',
    description: 'HMS error code: propertyNotFound',
  },
  leaseContractNotFound: {
    id: 'hb.application:submit.error.leaseContractNotFound',
    defaultMessage: 'Leigusamningur númer {contractNumber} fannst ekki.',
    description: 'HMS error code: leaseContractNotFound',
  },
  activeApplicationAlreadyExists: {
    id: 'hb.application:submit.error.activeApplicationAlreadyExists',
    defaultMessage:
      'Þú ert þegar með virka umsókn (Umsóknarnúmer: {applicationNumber}).',
    description: 'HMS error code: activeApplicationAlreadyExists',
  },
  invalidApplicationData: {
    id: 'hb.application:submit.error.invalidApplicationData',
    defaultMessage:
      'Gögn í umsókninni eru ógild eða vantar nauðsynlegar upplýsingar.',
    description: 'HMS error code: invalidApplicationData',
  },
  processingFailed: {
    id: 'hb.application:submit.error.processingFailed',
    defaultMessage:
      'Villa kom upp við vinnslu umsóknarinnar hjá HMS. Vinsamlegast reyndu aftur síðar.',
    description: 'HMS error code: processingFailed',
  },
})
