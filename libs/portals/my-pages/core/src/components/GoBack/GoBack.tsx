import {
  Box,
  Button,
  ResponsiveProp,
  ResponsiveSpace,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { LinkResolver, m } from '../../'
import * as styles from './GoBack.css'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'

type GoBackProps = {
  display?: ResponsiveProp<
    'none' | 'flex' | 'block' | 'inline' | 'inlineBlock' | 'inlineFlex'
  >
  noUnderline?: boolean
  truncate?: boolean
  marginBottom?: ResponsiveSpace
  path?: string
  label?: string
}
export const GoBack = ({
  display = ['none', 'none', 'block'],
  noUnderline,
  truncate,
  marginBottom = 3,
  path = '/',
  label,
}: GoBackProps) => {
  const { formatMessage } = useLocale()
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  return (
    <Box
      display={display}
      printHidden
      marginBottom={marginBottom}
      className={noUnderline ? styles.noUnderline : undefined}
    >
      <LinkResolver href={path}>
        <Button
          preTextIcon="arrowBack"
          preTextIconType="filled"
          size="small"
          type="button"
          variant="text"
          truncate={truncate}
          as="span"
          unfocusable
        >
          {formatMessage(
            isMobile ? m.goBackToDashboardShort : m.goBackToDashboard,
          )}
        </Button>
      </LinkResolver>
    </Box>
  )
}

export default GoBack
