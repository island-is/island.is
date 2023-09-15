import { formatText } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from '@formatjs/intl'

export const useMsg = (application: Application) => {
  const { formatMessage } = useLocale()

  return (d: MessageDescriptor) => formatText(d, application, formatMessage)
}
