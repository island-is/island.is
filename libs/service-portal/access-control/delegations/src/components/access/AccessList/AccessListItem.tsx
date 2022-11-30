import classNames from 'classnames'
import { Box, Text, useBreakpoint } from '@island.is/island-ui/core'
import { AccessDate } from '../AccessDate/AccessDate'
import { useLocale } from '@island.is/localization'
import * as commonAccessStyles from '../access.css'
import * as styles from './AccessListItem.css'

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

  return (
    <>
      <Box
        paddingLeft={indent ? [2, 2, 2, 4] : [0, 0, 0, 2]}
        className={classNames(
          commonAccessStyles.gridItem,
          styles.headerContainer,
        )}
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
      {hasDescription && !lg ? (
        <Box
          {...(indent && { paddingLeft: [2, 2, 2, 0] })}
          className={classNames(commonAccessStyles.gridItem)}
        >
          <Text variant="small" fontWeight="semiBold">
            {formatMessage({
              id: 'sp.access-control-delegations:grant',
              defaultMessage: 'Heimild',
            })}
          </Text>
          <Text>{description}</Text>
        </Box>
      ) : hasDescription ? (
        <Box
          {...(indent && { paddingLeft: [2, 2, 2, 0] })}
          className={classNames(commonAccessStyles.gridItem)}
        >
          <Text>{description}</Text>
        </Box>
      ) : null}
      {/* For bigger devices, i.e. > lg */}
      {lg && validTo && !validityPeriod ? (
        <Box
          {...(indent && { paddingLeft: [2, 2, 2, 0] })}
          className={classNames(commonAccessStyles.gridItem)}
        >
          <AccessDate validTo={validTo} />
        </Box>
      ) : null}
    </>
  )
}
