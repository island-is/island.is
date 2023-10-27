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
        {formatMessage(m.goBackToDashboard)}
      </Button>
    </Box>
  )
}

export default GoBack
