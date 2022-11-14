import classNames from 'classnames'
import { Box, Text, useBreakpoint } from '@island.is/island-ui/core'
import { AccessDate } from '../AccessDate/AccessDate'
import * as commonAccessStyles from '../access.css'
import * as styles from './AccessListItem.css'

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
  const { lg } = useBreakpoint()

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
          fontWeight="semiBold"
          capitalizeFirstLetter
          variant={indent ? 'medium' : 'default'}
        >
          {name}
        </Text>
        {/* For smaller devices, i.e. < lg */}
        {!lg && validTo && !validityPeriod && <AccessDate validTo={validTo} />}
      </Box>
      {description?.trim() && <Text>{description}</Text>}
      {/* For bigger devices, i.e. > lg */}
      {lg && validTo && !validityPeriod && <AccessDate validTo={validTo} />}
    </Box>
  )
}
