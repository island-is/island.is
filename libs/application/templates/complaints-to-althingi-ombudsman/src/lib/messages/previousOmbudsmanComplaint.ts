import { defineMessages } from 'react-intl'

export const previousOmbudsmanComplaint = {
  general: defineMessages({
    sectionTitle: {
      id: `ctao.application:general.previousOmbudsmanComplaint.sectionTitle`,
      defaultMessage: 'Fylgiskjöld',
      description: 'Section title',
    },
    title: {
      id: `ctao.application:general.previousOmbudsmanComplaint.title`,
      defaultMessage: 'Hefur þú leitað áður til umboðsmanns vegna málsins?',
      description: 'Main heading for the section',
    },
  }),
  moreInfo: defineMessages({
    title: {
      id: `ctao.application:general.previousOmbudsmanComplaint.moreInfo.title`,
      defaultMessage: 'Nánari rökstuðningur kvörtunar og önnur fylgiskjöl',
      description: 'Title for the description field',
    },
    label: {
      id: `ctao.application:general.previousOmbudsmanComplaint.moreInfo.label`,
      defaultMessage: 'Nánari skýring',
      description: 'Label for the description field',
    },
  }),
}
