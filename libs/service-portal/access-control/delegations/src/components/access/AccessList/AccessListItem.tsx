import classNames from 'classnames'
import { Box, Text, useBreakpoint } from '@island.is/island-ui/core'
import { AccessDate } from '../AccessDate/AccessDate'
import * as commonAccessStyles from '../access.css'
import * as styles from './AccessListItem.css'
import { useLocale } from '@island.is/localization'

interface AccessListItemProps {
  name: string
  description?: string | null
  validTo?: string
  validityPeriod?: Date | null
  indent?: boolean
  titleBold?: boolean
}

export const AccessListItem = ({
  name,
  description,
  validTo,
  validityPeriod,
  indent,
  titleBold,
}: AccessListItemProps) => {
  const { lg } = useBreakpoint()
  const { formatMessage } = useLocale()
  const hasDescription = !!description?.trim()

  // Indent the hole row for screen size smaller than lg
  // Only indent name field when screen size is lg or larger
  return (
    <Box
      className={classNames(
        commonAccessStyles.gridRow,
        validityPeriod
          ? commonAccessStyles.gridRowMaxTwoCols
          : commonAccessStyles.gridRowMaxThreeCols,
      )}
      {...(indent && { paddingLeft: [2, 2, 2, 0] })}
    >
      <Box
        {...(indent && { paddingLeft: [0, 0, 0, 4] })}
        className={styles.headerContainer}
      >
        <Text
          fontWeight={lg || titleBold ? 'semiBold' : 'regular'}
          capitalizeFirstLetter
        >
          {name}
        </Text>
        {/* For smaller devices, i.e. < lg */}
        {!lg && validTo && !validityPeriod && <AccessDate validTo={validTo} />}
      </Box>
      {!lg && hasDescription && (
        <Text variant="small" fontWeight="semiBold" marginTop={2}>
          {formatMessage({
            id: 'sp.access-control-delegations:grant',
            defaultMessage: 'Heimild',
          })}
        </Text>
      )}
      {hasDescription && <Text>{description}</Text>}
      {/* For bigger devices, i.e. > lg */}
      {lg && validTo && !validityPeriod && <AccessDate validTo={validTo} />}
    </Box>
  )
}
