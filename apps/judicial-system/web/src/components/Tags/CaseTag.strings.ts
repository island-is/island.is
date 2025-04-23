import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  draft: {
    id: 'judicial.system.core:case_tag.draft',
    defaultMessage: 'Drög',
    description: 'Notað fyrir "Drög" tagg',
  },
  beingReviewed: {
    id: 'judicial.system.core:case_tag.being_reviewed',
    defaultMessage: 'Í yfirlestri',
    description: 'Notað fyrir "Í yfirlestri" tagg',
  },
  new: {
    id: 'judicial.system.core:case_tag.new',
    defaultMessage: 'Nýtt',
    description: 'Notað fyrir "Nýtt" tagg',
  },
  unknown: {
    id: 'judicial.system.core:case_tag.unknown',
    defaultMessage: 'Óþekkt',
    description: 'Notað fyrir "Óþekkt" tagg',
  },
  sent: {
    id: 'judicial.system.core:case_tag.sent',
    defaultMessage: 'Sent',
    description: 'Notað fyrir "Sent" tagg',
  },
  postponedUntilVerdict: {
    id: 'judicial.system.core:case_tag.postponed_until_verdict',
    defaultMessage: 'Dómtekið',
    description: 'Notað fyrir "Dómtekið" tagg',
  },
  scheduled: {
    id: 'judicial.system.core:case_tag.scheduled',
    defaultMessage: 'Á dagskrá',
    description: 'Notað fyrir "Á dagskrá" tagg',
  },
  reassignment: {
    id: 'judicial.system.core:case_tag.reassignment',
    defaultMessage: 'Endurúthlutun',
    description: 'Notað fyrir "Endurúthlutun" tagg',
  },
  received: {
    id: 'judicial.system.core:case_tag.received',
    defaultMessage: 'Móttekið',
    description: 'Notað fyrir "Móttekið" tagg',
  },
  complete: {
    id: 'judicial.system.core:case_tag.inactive',
    defaultMessage: 'Lokið',
    description: 'Notað fyrir "Lokið" tagg',
  },
  completed: {
    id: 'judicial.system.core:case_tag.completed',
    defaultMessage:
      '{indictmentRulingDecision, select, RULING {Dómur} FINE {Viðurlagaákvörðun} DISMISSAL {Frávísun} CANCELLATION {Niðurfelling} other {Lokið}}',
    description: 'Notað sem merki þegar mál í stöðu "Dómþulur" í málalista',
  },
  recalled: {
    id: 'judicial.system.core:case_tag.recalled',
    defaultMessage: 'Afturkallað',
    description: 'Notað fyrir "Afturkallað" tagg',
  },
  merged: {
    id: 'judicial.system.core:case_tag.merged',
    defaultMessage: 'Sameinað',
    description: 'Notað fyrir "Sameinað" tagg',
  },
  indictmentFine: {
    id: 'judicial.system.core:case_tag.fine',
    defaultMessage: 'Viðurlagaákvörðun',
    description: 'Notað fyrir "Viðurlagaákvörðun" tagg',
  },
  indictmentCancellation: {
    id: 'judicial.system.core:case_tag.cancellation',
    defaultMessage: 'Niðurfelling',
    description: 'Notað fyrir "Niðurfelling" tagg',
  },
  indictmentRuling: {
    id: 'judicial.system.core:case_tag.ruling',
    defaultMessage: 'Dómur',
    description: 'Notað fyrir "Dómur" tagg',
  },
  indictmentDismissal: {
    id: 'judicial.system.core:case_tag.dismissal',
    defaultMessage: 'Frávísun',
    description: 'Notað fyrir "Frávísun" tagg',
  },
  indictmentMerged: {
    id: 'judicial.system.core:case_tag.merged',
    defaultMessage: 'Sameinað',
    description: 'Notað fyrir "Sameinað" tagg',
  },
  indictmentWithdrawal: {
    id: 'judicial.system.core:case_tag.withdrawal',
    defaultMessage: 'Afturkallað',
    description: 'Notað fyrir "Afturkallað" tagg',
  },
  punishmentTypeImprisonment: {
    id: 'judicial.system.core:case_tag.punishment_type_imprisonment',
    defaultMessage: 'Óskb.',
    description: 'Notað fyrir "Óskilorðsbundið" tagg',
  },
  punishmentTypeProbation: {
    id: 'judicial.system.core:case_tag.punishment_type_probation',
    defaultMessage: 'Skb.',
    description: 'Notað fyrir "Skilorðsbundið" tagg',
  },
  punishmentTypeFine: {
    id: 'judicial.system.core:case_tag.punishment_type_fine',
    defaultMessage: 'Sekt',
    description: 'Notað fyrir "Sekt" tagg',
  },
  punishmentTypeIndictmentRulingDecisionFine: {
    id: 'judicial.system.core:case_tag.punishment_type_indictment_ruling_decision_fine',
    defaultMessage: 'VL',
    description: 'Notað fyrir "Viðurlagaákvörðun" tagg',
  },
  punishmentTypeSignedFineInvitation: {
    id: 'judicial.system.core:case_tag.punishment_type_signed_fine_invitation',
    defaultMessage: 'ÁS',
    description: 'Notað fyrir "Áritað sektarboð" tagg',
  },
  punishmentTypeOther: {
    id: 'judicial.system.core:case_tag.punishment_type_other',
    defaultMessage: 'Annað',
    description: 'Notað fyrir "Annað" tagg',
  },
})
