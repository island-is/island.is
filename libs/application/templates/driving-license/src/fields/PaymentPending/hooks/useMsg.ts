import { MessageDescriptor } from '@formatjs/intl'

import { Application, formatText } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'

export const useMsg = (application: Application) => {
  const { formatMessage } = useLocale()

  return (d: MessageDescriptor) => formatText(d, application, formatMessage)
}
