import { Hidden, Text, useBreakpoint } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import format from 'date-fns/format'
import { accessMessages, DATE_FORMAT } from '../access.utils'
import * as styles from './AccessDate.css'

type AccessDateProps = {
  validTo: string
}

export const AccessDate = ({ validTo }: AccessDateProps) => {
  const { formatMessage } = useLocale()
  const { lg } = useBreakpoint()

  return (
    <div className={styles.dateContainer}>
      <Hidden above="sm">
        <Text variant="eyebrow" fontWeight="semiBold">
          {formatMessage(accessMessages.dateValidTo)}
        </Text>
      </Hidden>
      <Text
        variant={lg ? 'default' : 'eyebrow'}
        {...(!lg && { fontWeight: 'semiBold' })}
      >
        {format(new Date(validTo), DATE_FORMAT)}
      </Text>
    </div>
  )
}
