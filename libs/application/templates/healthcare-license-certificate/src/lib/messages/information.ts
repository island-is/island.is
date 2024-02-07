import { defineMessages } from 'react-intl'

export const information = {
  general: defineMessages({
    sectionTitle: {
      id: 'hlc.application:information.general.sectionTitle',
      defaultMessage: 'Starfsleyfi',
      description: 'Select license section title',
    },
  }),
  labels: {
    selectLicense: defineMessages({
      pageTitle: {
        id: 'hlc.application:information.labels.selectLicense.pageTitle',
        defaultMessage: 'Starfsleyfin þín',
        description: 'Select license page title',
      },
      description: {
        id: 'hlc.application:information.labels.selectLicense.description',
        defaultMessage:
          'Hér má sjá lista yfir þau starfsleyfi sem eru skráð á þig í starfsleyfaskrá embættis landlæknis sem uppfærð er daglega.',
        description: 'Select license description',
      },
      licenseOptionSubLabelSpeciality: {
        id: 'hlc.application:information.labels.selectLicense.licenseOptionSubLabelSpeciality',
        defaultMessage: 'Sérgrein: {specialityList}',
        description: 'Select license option sub label speciality',
      },
      licenseOptionSubLabelTemporary: {
        id: 'hlc.application:information.labels.selectLicense.licenseOptionSubLabelTemporary',
        defaultMessage: 'Tímabundið starfsleyfi - Gildir til: {dateTo}',
        description: 'Select license option sub label temporary',
      },
      restrictionAlertTitle: {
        id: 'hlc.application:information.labels.selectLicense.restrictionAlertTitle',
        defaultMessage: 'Takmörkun á starfsleyfi',
        description: 'Select license restriction alert title',
      },
      restrictionAlertMessage: {
        id: 'hlc.application:information.labels.selectLicense.restrictionAlertMessage',
        defaultMessage:
          'Vinsamlega sendið póst á starfsleyfi@landlaeknir.is ef frekari upplýsingar óskast',
        description: 'Select license restriction alert message',
      },
    }),
  },
}
