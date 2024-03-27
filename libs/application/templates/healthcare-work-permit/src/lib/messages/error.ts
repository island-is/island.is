import { defineMessages } from 'react-intl'

export const error = defineMessages({
  errorDataProvider: {
    id: 'hwp.application:error.dataProvider',
    defaultMessage: 'Reyndu aftur síðar',
    description: 'Unhandled error in data provider',
  },
  emptyCareerResponseTitle: {
    id: 'hlc.application:error.emptyHealthLicenseListTitle',
    defaultMessage:
      'Samkvæmt þjónustu Háskóla Íslands ertu ekki með brautskráningu á skrá',
    description: 'Empty career response',
  },
  emptyCareerResponseMessage: {
    id: 'hlc.application:error.emptyHealthLicenseListMessage',
    defaultMessage:
      'Samkvæmt þjónustu Háskóla Íslands ertu ekki með brautskráningu á skrá',
    description: 'Empty career response',
  },
})
