import classNames from 'classnames'
import { Box, Text, useBreakpoint } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import format from 'date-fns/format'
import { accessMessages, DATE_FORMAT } from './access.utils'
import * as styles from './access.css'

interface AccessListItemProps {
  name: string
  description?: string | null
  validTo?: string
  validityPeriod?: string
  indent?: boolean
}

export const AccessListItem = ({
  name,
  description,
  validTo,
  validityPeriod,
  indent,
}: AccessListItemProps) => {
  const { formatMessage } = useLocale()
  const { lg } = useBreakpoint()

  // Indent the hole row for screen size smaller than lg
  // Only indent name field when screen size is lg or larger
  return (
    <Box
      className={classNames(
        styles.gridRow,
        validityPeriod ? styles.gridRowMaxTwoCols : styles.gridRowMaxThreeCols,
      )}
      {...(indent && { paddingLeft: [2, 2, 2, 0] })}
    >
      <Box {...(indent && { paddingLeft: [0, 0, 0, 4] })}>
        <Text
          fontWeight="semiBold"
          capitalizeFirstLetter
          variant={indent ? 'medium' : 'default'}
        >
          {name}
        </Text>
      </Box>
      {description?.trim() && <Text>{description}</Text>}
      {!validityPeriod ||
        (!lg && validTo && (
          <Box paddingTop={[2, 2, 2, 0]}>
            {!lg && (
              <Text variant="small" fontWeight="semiBold">
                {formatMessage(accessMessages.dateValidTo)}
              </Text>
            )}
            <Text variant={lg ? 'default' : 'small'}>
              {format(new Date(validTo), DATE_FORMAT)}
            </Text>
          </Box>
        ))}
    </Box>
  )
}
