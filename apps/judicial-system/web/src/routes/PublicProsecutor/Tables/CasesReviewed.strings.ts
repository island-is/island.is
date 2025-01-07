import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  title: {
    id: 'judicial.system.core:public_prosecutor.tables.cases_reviewed.title',
    defaultMessage: 'Yfirlesin mál',
    description: 'Notaður sem titill á yfirlesin mál málalista',
  },
  reviewTagAppealed: {
    id: 'judicial.system.core:public_prosecutor.tables.cases_reviewed.review_tag_appealed',
    defaultMessage: 'Áfrýjun',
    description:
      'Notað sem texti á tagg fyrir "Áfrýjun" tillögu í yfirlesin mál málalista',
  },
  reviewTagAccepted: {
    id: 'judicial.system.core:public_prosecutor.tables.cases_reviewed.review_tag_completed',
    defaultMessage: 'Unun',
    description:
      'Notað sem texti á tagg fyrir "Unun" tillögu í yfirlesin mál málalista',
  },
  reviewTagFineAppealed: {
    id: 'judicial.system.core:public_prosecutor.tables.cases_reviewed.review_tag_fine_appealed',
    defaultMessage: 'Kært',
    description:
      'Notað sem texti á tagg fyrir "Kært" tillögu í yfirlesin mál málalista',
  },
  infoContainerMessage: {
    id: 'judicial.system.core:public_prosecutor.tables.cases_reviewed.info_container_message',
    defaultMessage: 'Engin yfirlesin mál.',
    description:
      'Notaður sem skilaboð í upplýsingaglugga ef engin yfirlesin mál eru til.',
  },
  infoContainerTitle: {
    id: 'judicial.system.core:public_prosecutor.tables.cases_reviewed.info_container_title',
    defaultMessage: 'Engin mál',
    description:
      'Notaður sem titill á upplýsingaglugga ef engin yfirlesin mál eru til.',
  },
  tagVerdictUnviewed: {
    id: 'judicial.system.core:public_prosecutor.tables.cases_reviewed.tag_verdict_unviewed',
    defaultMessage: 'Óbirt',
    description:
      'Notað sem texti á taggi fyrir "Dómur óbirtur" í yfirlesin mál málalista',
  },
  tagVerdictViewOnDeadline: {
    id: 'judicial.system.core:public_prosecutor.tables.cases_reviewed.tag_verdict_on_appeal_deadline',
    defaultMessage: 'Á fresti',
    description:
      'Notað sem texti á taggi fyrir "Á fresti" í yfirlesin mál málalista',
  },
  tagVerdictViewComplete: {
    id: 'judicial.system.core:public_prosecutor.tables.cases_reviewed.tag_verdict_viewed',
    defaultMessage: 'Fullunnið',
    description:
      'Notað sem texti á taggi fyrir "Dómur birtur" í yfirlesin mál málalista',
  },
  tagVerdictViewSentToPrisonAdmin: {
    id: 'judicial.system.core:public_prosecutor.tables.cases_reviewed.tag_verdict_sent_to_prison_admin',
    defaultMessage: 'Til fullnustu',
    description:
      'Notað sem texti á taggi fyrir "Til fullnustu" í yfirlesin mál málalista',
  },
  tagDefendantAppealedVerdict: {
    id: 'judicial.system.core:public_prosecutor.tables.cases_reviewed.tag_defendant_appealed_verdict',
    defaultMessage: 'Ákærði áfrýjar',
    description:
      'Notað sem texti á taggi fyrir "Ákærði áfrýjar" í yfirlesin mál málalista',
  },
})
