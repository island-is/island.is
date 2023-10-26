import { Box, Button, ResponsiveProp } from '@island.is/island-ui/core'
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
  marginBottom?: ResponsiveProp<
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 'none'
    | 9
    | 10
    | 20
    | 21
    | 8
    | 6
    | 7
    | 12
    | 14
    | 15
    | 22
    | 23
    | 24
    | 25
    | 26
    | 27
    | 28
    | 29
    | 30
    | 31
    | 'auto'
    | 'smallGutter'
    | 'gutter'
    | 'containerGutter'
    | 'p1'
    | 'p2'
    | 'p3'
    | 'p4'
    | 'p5'
  >
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
