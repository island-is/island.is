import { defineMessages } from 'react-intl'

export const error = defineMessages({
  errorDataProvider: {
    id: 'hlc.application:error.dataProvider',
    defaultMessage: 'Reyndu aftur síðar',
    description: 'Unhandled error in data provider',
  },
  emptyHealthLicenseListTitle: {
    id: 'hlc.application:error.emptyHealthLicenseListTitle',
    defaultMessage:
      'Samkvæmt starfsleyfaskrá embættis landlæknis ertu ekki með skráð starfsleyfi',
    description: 'Empty health license list',
  },
  emptyHealthLicenseListMessage: {
    id: 'hlc.application:error.emptyHealthLicenseListMessage',
    defaultMessage:
      'Samkvæmt starfsleyfaskrá embættis landlæknis ertu ekki með skráð starfsleyfi',
    description: 'Empty health license list',
  },
})
