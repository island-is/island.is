import { ReactNode } from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'

/**
 * Lightweight card wrapper for a key-info section. Mirrors the purple eyebrow
 * title of InfoLineStack but without its forced dividers / array-of-children
 * constraint, so sections with conditional read/edit content render predictably.
 */
export const KeyInfoSection = ({
  title,
  action,
  children,
}: {
  title: MessageDescriptor | string
  /** Optional control rendered inline with the title, e.g. an edit button. */
  action?: ReactNode
  children: ReactNode
}) => {
  const { formatMessage } = useLocale()
  return (
    <Box>
      <Box
        display="flex"
        flexDirection={['column', 'row']}
        justifyContent={['flexStart', 'spaceBetween']}
        alignItems={['flexStart', 'center']}
        rowGap={1}
        paddingBottom={2}
      >
        <Text variant="eyebrow" color="purple400">
          {formatMessage(title)}
        </Text>
        {action}
      </Box>
      {children}
    </Box>
  )
}

export default KeyInfoSection
