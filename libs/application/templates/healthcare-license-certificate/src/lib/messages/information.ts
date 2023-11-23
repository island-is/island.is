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
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam dictum consequat justo in sagittis.',
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
        defaultMessage: 'Vinsamlegast hafið samband við Landækni',
        description: 'Select license restriction alert message',
      },
    }),
  },
}
