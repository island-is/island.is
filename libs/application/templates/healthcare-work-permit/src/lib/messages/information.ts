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
        defaultMessage: 'Brautskráninganar þínar',
        description: 'Select work permit page',
      },
      description: {
        id: 'hwp.application:information.labels.selectWorkPermit.description',
        defaultMessage:
          'Hér má sjá lista yfir þau starfsleyfi sem eru skráð á þig í starfsleyfaskrá embættis landlæknis sem uppfærð er daglega.',
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
    }),
  },
}
