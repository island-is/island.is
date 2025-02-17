import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  indictmentSentToCourt: {
    id: 'judicial.system.core:info_card_indictment.indictment_sent_to_court',
    defaultMessage: 'Útgáfudagur',
    description: 'Notaður sem titill á "Útgáfudagur" hluta af yfirliti ákæru.',
  },
  prosecutor: {
    id: 'judicial.system.core:info_card_indictment.prosecutor',
    defaultMessage: 'Ákærandi',
    description: 'Notaður sem titill á "ákærandi" hluta af yfirliti ákæru.',
  },
  offense: {
    id: 'judicial.system.core:info_card_indictment.offense',
    defaultMessage: 'Brot',
    description: 'Notaður sem titill á "brot" hluta af yfirliti ákæru.',
  },
  indictmentReviewer: {
    id: 'judicial.system.core:info_card_indictment.indictment_reviewer',
    defaultMessage: 'Yfirlestur',
    description: 'Notaður sem titill á "yfirlestur" hluta af yfirliti ákæru.',
  },
  indictmentReviewDecision: {
    id: 'judicial.system.core:info_card_indictment.indictment_review_decision',
    defaultMessage: 'Ákvörðun',
    description: 'Notaður sem titill á "ákvörðun" hluta af yfirliti ákæru.',
  },
  reviewTagAppealed: {
    id: 'judicial.system.core:info_card_indictment.review_tag_appealed_v3',
    defaultMessage:
      '{isFine, select, true {Kæra viðurlagaákvörðun} other {Áfrýja dómi}}',
    description:
      'Notað sem texti á tagg fyrir "Áfrýjun" tillögu í yfirliti ákæru.',
  },
  reviewTagAccepted: {
    id: 'judicial.system.core:info_card_indictment.review_tag_completed_v2',
    defaultMessage:
      'Una {isFine, select, true {viðurlagaákvörðun} other {dómi}}',
    description: 'Notað sem texti á tagg fyrir "Una" tillögu í yfirliti ákæru.',
  },
  indictmentReviewedDateTitle: {
    id: 'judicial.system.core:info_card_indictment.indictment_reviewed_date_title',
    defaultMessage: 'Dagsetning áritunar',
    description: 'Notaður sem titill á "Dagsetning" hluta af yfirliti ákæru.',
  },
  indictmentMergedTitle: {
    id: 'judicial.system.core:info_card_indictment.indictment_merged_title',
    defaultMessage: 'Sameinað máli',
    description: 'Notaður sem titill á "Sameinað" hluta af yfirliti ákæru.',
  },
  mergedFromTitle: {
    id: 'judicial.system.core:info_card_indictment.merged_from_title',
    defaultMessage: 'Sameinað úr',
    description: 'Notaður sem titill á "Sameinað úr" hluta af yfirliti ákæru.',
  },
  civilClaimant: {
    id: 'judicial.system.core:info_card_indictment.civil_claimant',
    defaultMessage: 'Kröfuhafi',
    description:
      'Notaður sem titill á "kröfuhafa" hluta í yfirliti ákæru þegar kröfuhafi er einn.',
  },
  civilClaimants: {
    id: 'judicial.system.core:info_card_indictment.civil_claimants',
    defaultMessage: 'Kröfuhafar',
    description:
      'Notaður sem titill á "kröfuhafar" hluta í yfirliti ákæru þegar kröfuhafar eru fleiri en einn.',
  },
  name: {
    id: 'judicial.system.core:info_card.defendant_info.name',
    defaultMessage: 'Nafn',
    description: 'Notaður sem titill fyrir nafn',
  },
  externalMergeCase: {
    id: 'judicial.system.core:info_card_indictment.external_merge_case',
    defaultMessage: '{mergeCaseNumber} utan Réttarvörslugáttar',
    description:
      'Notaður texti fyrir "Sameinað máli" sem er aðeins til utan gáttar',
  },
})
