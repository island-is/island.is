import { defineMessages } from 'react-intl'

export const error = defineMessages({
  errorDataProvider: {
    id: 'hlc.application:error.dataProvider',
    defaultMessage: 'Reyndu aftur síðar',
    description: 'Unhandled error in data provider',
  },
  emptyHealthLicenseList: {
    id: 'hlc.application:error.emptyHealthLicenses',
    defaultMessage: 'Þú ert ekki með nein virk starfsleyfi',
    description: 'Empty health license list',
  },
})
