import { defineMessages } from 'react-intl'

export const error = defineMessages({
  errorDataProvider: {
    id: 'hlc.application:error.dataProvider',
    defaultMessage: 'Reyndu aftur síðar',
    description: 'Unhandled error in data provider',
  },
  emptyHealthLicenseList: {
    id: 'hlc.application:error.emptyHealthLicenses',
    defaultMessage:
      'Samkvæmt starfsleyfaskrá embættis landlæknis ertu ekki með skráð starfsleyfi',
    description: 'Empty health license list',
  },
})
