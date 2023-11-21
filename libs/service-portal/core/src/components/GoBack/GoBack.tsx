import {
  Box,
  Button,
  ResponsiveProp,
  ResponsiveSpace,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useNavigate } from 'react-router-dom'
import { m } from '../../'
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
}
export const GoBack = ({
  display = ['none', 'none', 'block'],
  noUnderline,
  truncate,
  marginBottom = 3,
}: GoBackProps) => {
  const navigate = useNavigate()
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
      <Button
        preTextIcon="arrowBack"
        preTextIconType="filled"
        size="small"
        type="button"
        variant="text"
        truncate={truncate}
        onClick={() => navigate('/')}
      >
        {formatMessage(
          isMobile ? m.goBackToDashboardShort : m.goBackToDashboard,
        )}
      </Button>
    </Box>
  )
}

export default GoBack
