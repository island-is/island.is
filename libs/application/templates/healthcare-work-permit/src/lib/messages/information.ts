import { defineMessages } from 'react-intl'

export const information = {
  general: defineMessages({
    sectionTitle: {
      id: 'hwp.application:information.general.sectionTitle',
      defaultMessage: 'Starfsleyfi',
      description: 'Select work permit section title',
    },
  }),
  labels: {
    selectWorkPermit: defineMessages({
      pageTitle: {
        id: 'hwp.application:information.labels.selectWorkPermit.pageTitle',
        defaultMessage: 'Starfsleyfi',
        description: 'Work permit',
      },
      sectionTitle: {
        id: 'hwp.application:information.labels.selectWorkPermit.sectionTitle',
        defaultMessage: 'Veldu það nám sem þú vilt fá starfsleyfi fyrir',
        description: 'Pick your work permit programme',
      },
      description: {
        id: 'hwp.application:information.labels.selectWorkPermit.description',
        defaultMessage:
          'Hér að neðan er listi yfir loknar prófgráður frá Háskóla Íslands sem gefa réttindi til starfsleyfa. ',
        description: 'Select work permit description',
      },
      workPermitOptionSubLabelSpeciality: {
        id: 'hwp.application:information.labels.selectWorkPermit.workPermitOptionSubLabelSpeciality',
        defaultMessage: 'Sérgrein: {specialityList}',
        description: 'Select work permit option sub label speciality',
      },
      workPermitOptionSubLabelTemporary: {
        id: 'hwp.application:information.labels.selectWorkPermit.workPermitOptionSubLabelTemporary',
        defaultMessage: 'Tímabundið starfsleyfi - Gildir til: {dateTo}',
        description: 'Select work permit option sub label temporary',
      },
      restrictionAlertTitle: {
        id: 'hwp.application:information.labels.selectWorkPermit.restrictionAlertTitle',
        defaultMessage: 'Takmörkun á starfsleyfi',
        description: 'Select work permit restriction alert title',
      },
      restrictionAlertMessage: {
        id: 'hwp.application:information.labels.selectWorkPermit.restrictionAlertMessage',
        defaultMessage:
          'Vinsamlega sendið póst á starfsleyfi@landlaeknir.is ef frekari upplýsingar óskast',
        description: 'Select work permit restriction alert message',
      },
      infoMessage: {
        id: 'hwp.application:information.labels.selectWorkPermit.infoMessage',
        defaultMessage:
          'Athugið, ekki eru allar gráður aðgengilegar í sjálfafgreiðslu, til að mynda vegna kröfu um starfsreynslu eða annarra gagna sem þarf að yfirfara. Ef þú finnur ekki gráðuna þína skaltu  fylgja leiðbeiningunum hér.',
        description:
          'Info message for user regarding self serviced work permits',
      },
    }),
  },
}
