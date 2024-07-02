import { defineMessages } from 'react-intl'

export const error = defineMessages({
  errorSheriffApiTitle: {
    id: 'mc.application:error.errorSheriffApiTitle',
    defaultMessage: 'Villa hefur komið upp á milli Ísland.is og sýslumanna',
    description:
      "An error has occurred between Ísland.is and the sheriff's office",
  },
  errorSheriffApiMessage: {
    id: 'mc.application:error.errorSheriffApiMessage',
    defaultMessage: 'Vinsamlega reyndu aftur síðar',
    description: 'Please try again later',
  },
  errorNoSelectedProperty: {
    id: 'mc.application:error.errorNoSelectedProperty',
    defaultMessage: 'Vinsamlega veldu eign til að halda áfram',
    description: 'Error if there is no selected property',
  },
})
