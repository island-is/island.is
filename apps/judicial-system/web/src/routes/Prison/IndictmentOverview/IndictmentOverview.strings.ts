import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  htmlTitle: {
    id: 'judicial.system.core:indictment_overview.html_title',
    defaultMessage: 'Yfirlit ákæru - Réttarvörslugátt',
    description: 'Titill á yfirliti ákæru',
  },
  title: {
    id: 'judicial.system.core:indictment_overview.title',
    defaultMessage: 'Dómur til fullnustu',
    description: 'Notaður sem titill á yfirliti ákæru fyrir fangelsi',
  },
  indictmentCompletedTitle: {
    id: 'judicial.system.core:indictment_overview.indictment_completed_title',
    defaultMessage: 'Dómsuppkvaðning {date}',
    description: 'Titill á yfirliti ákæru fyrir fangelsi',
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
  punishmentTypeTitle: {
    id: 'judicial.system.core:indictment_overview.punishmentType_title',
    defaultMessage: 'Refsitegund',
    description: 'Titill á Refsitegund',
  },
  imprisonment: {
    id: 'judicial.system.core:indictment_overview.punishmentType.imprisonment',
    defaultMessage: 'Óskilorðsbundið',
    description:
      'Notaður sem texti í óskilorðsbundið valmöguleika í Refsitegund',
  },
  probation: {
    id: 'judicial.system.core:indictment_overview.punishmentType.probation',
    defaultMessage: 'Skilorðsbundið',
    description:
      'Notaður sem texti í skilorðsbundið valmöguleika í Refsitegund',
  },
  fine: {
    id: 'judicial.system.core:court.indictment_overview.punishmentType.fine',
    defaultMessage: 'Sekt',
    description: 'Notaður sem texti í sekt valmöguleika í Refsitegund',
  },
  indictmentRulingDecisionFine: {
    id: 'judicial.system.core:court.indictment_overview.punishmentType.indictmentRulingDecisionFine',
    defaultMessage: 'Viðurlagaákvörðun',
    description: 'Notaður sem texti í viðurlagaákvörðun í Refsitegund',
  },
  signedFineInvitation: {
    id: 'judicial.system.core:court.indictment_overview.punishmentType.signedFineInvitation',
    defaultMessage: 'Áritað sektarboð',
    description: 'Notaður sem texti í sektarboð í Refsitegund',
  },
})
