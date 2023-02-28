import { VisuallyHidden } from 'reakit/VisuallyHidden'
import { Text, useBreakpoint } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { accessMessages, formatDelegationDate } from '../access.utils'
import * as styles from './AccessDate.css'

type AccessDateProps = {
  validTo: string
}

export const AccessDate = ({ validTo }: AccessDateProps) => {
  const { formatMessage } = useLocale()
  const { lg } = useBreakpoint()

  return (
    <div className={styles.dateContainer}>
      {!lg ? (
        <Text variant="eyebrow" fontWeight="semiBold">
          {formatMessage(accessMessages.dateValidTo)}
        </Text>
      ) : (
        <VisuallyHidden>
          {formatMessage(accessMessages.dateValidTo)}
        </VisuallyHidden>
      )}
      <Text
        variant={lg ? 'default' : 'eyebrow'}
        {...(!lg && { fontWeight: 'semiBold' })}
      >
        {formatDelegationDate(validTo)}
      </Text>
    </div>
  )
}
