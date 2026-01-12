import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  htmlTitle: {
    id: 'judicial.system.core:indictment_overview.html_title',
    defaultMessage: 'Yfirlit ákæru - Réttarvörslugátt',
    description: 'Titill á yfirliti ákæru',
  },
  title: {
    id: 'judicial.system.core:indictment_overview.title_v1',
    defaultMessage:
      '{isFine, select, true {Viðurlagaákvörðun} other {Dómur}} til fullnustu',
    description: 'Notaður sem titill á yfirliti ákæru fyrir fangelsi',
  },
  indictmentCompletedTitle: {
    id: 'judicial.system.core:indictment_overview.indictment_completed_title',
    defaultMessage: 'Dómsuppkvaðning {date}',
    description: 'Undirtitill á yfirliti ákæru fyrir fangelsi',
  },
  indictmentReceivedTitle: {
    id: 'judicial.system.core:indictment_overview.indictment_received_title',
    defaultMessage: 'Móttekið {date}',
    description: 'Undirtitill á yfirliti ákæru fyrir fangelsi',
  },
  infoCardDefendantsTitle: {
    id: 'judicial.system.core:indictment_overview.info_card_defendants_title',
    defaultMessage: 'Dómfelld{count, plural, one {i} other {u}}',
    description: 'Titill á upplýsingakorti um dómfelldu',
  },
  verdictTitle: {
    id: 'judicial.system.core:indictment_overview.verdict_title',
    defaultMessage: 'Dómur',
    description: 'Titill á Dómur hluta',
  },
  courtRecordTitle: {
    id: 'judicial.system.core:indictment_overview.court_record_title',
    defaultMessage: 'Þingbók',
    description: 'Titill á Þingbók hluta',
  },
  punishmentTypeTitle: {
    id: 'judicial.system.core:indictment_overview.punishment_type_title',
    defaultMessage: 'Refsitegund',
    description: 'Titill á Refsitegund',
  },
  punishmentTypeImprisonment: {
    id: 'judicial.system.core:indictment_overview.punishment_type_imprisonment',
    defaultMessage: 'Óskilorðsbundið',
    description:
      'Notaður sem texti í óskilorðsbundið valmöguleika í Refsitegund',
  },
  punishmentTypeProbation: {
    id: 'judicial.system.core:indictment_overview.punishment_type_probation',
    defaultMessage: 'Skilorðsbundið',
    description:
      'Notaður sem texti í skilorðsbundið valmöguleika í Refsitegund',
  },
  punishmentTypeFine: {
    id: 'judicial.system.core:indictment_overview.punishment_type_fine',
    defaultMessage: 'Sekt',
    description: 'Notaður sem texti í sekt valmöguleika í Refsitegund',
  },
  punishmentTypeIndictmentRulingDecisionFine: {
    id: 'judicial.system.core:indictment_overview.punishment_type_indictment_ruling_decision_fine',
    defaultMessage: 'Viðurlagaákvörðun',
    description: 'Notaður sem texti í viðurlagaákvörðun í Refsitegund',
  },
  punishmentTypeSignedFineInvitation: {
    id: 'judicial.system.core:indictment_overview.punishment_type_signed_fine_invitation',
    defaultMessage: 'Áritað sektarboð',
    description: 'Notaður sem texti í sektarboð í Refsitegund',
  },
  sentToPrisonAdminFileTitle: {
    id: 'judicial.system.core:indictment_overview.sent_to_prison_admin_file_title',
    defaultMessage: 'Fullnusta',
    description: 'Titill á til fullnustu skjali',
  },
  criminalRecordUpdateSection: {
    id: 'judicial.system.core:indictment_overview.criminal_record_update_section',
    defaultMessage: 'Tilkynning til sakaskrár',
    description: 'Titill á Tilkynning til sakaskrár',
  },
})
