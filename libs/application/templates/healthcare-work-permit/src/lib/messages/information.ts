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
          'Hér að neðan er listi yfir loknar prófgráður sem gefa réttindi til starfsleyfa. ',
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
      restrictionGraduationDate: {
        id: 'hwp.application:information.labels.selectWorkPermit.restrictionGraduationDate',
        defaultMessage:
          'Prófgráða er of gömul. Ekki er hægt að veita starfsleyfi',
        description:
          'Select work permit restriction message, graduation date too old',
      },
      restrictionFoundationMissing: {
        id: 'hwp.application:information.labels.selectWorkPermit.restrictionFoundationMissing',
        defaultMessage: 'Ekki fannst grunnnám',
        description:
          'Select work permit restriction message, foundation program missing',
      },
      restrictionDataError: {
        id: 'hwp.application:information.labels.selectWorkPermit.restrictionDataError',
        defaultMessage: 'Villa í gögnum, engin dagsetning fannst',
        description: 'Select work permit restriction message, error in data',
      },
      restrictionFoundationDate: {
        id: 'hwp.application:information.labels.selectWorkPermit.restrictionFoundationDate',
        defaultMessage: 'Útskrift grunnnáms fyrir starfsleyfi er of gömull',
        description:
          'Select work permit restriction message, foundation graduation date is too old',
      },
      restrictionAlreadyHasLicense: {
        id: 'hwp.application:information.labels.selectWorkPermit.restrictionAlreadyHasLicense',
        defaultMessage: 'Þegar útgefið',
        description:
          'Select work permit restriction message, user already has this license',
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
