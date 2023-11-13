import {
  Box,
  Button,
  LinkV2,
  ResponsiveProp,
  ResponsiveSpace,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ServicePortalPath, m } from '../../'
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
  const { formatMessage } = useLocale()
  return (
    <Box
      display={display}
      printHidden
      marginBottom={marginBottom}
      className={noUnderline ? styles.noUnderline : undefined}
    >
      <LinkV2 href={ServicePortalPath.MinarSidurPath}>
        <Button
          preTextIcon="arrowBack"
          preTextIconType="filled"
          size="small"
          type="button"
          variant="text"
          truncate={truncate}
          as="span"
        >
          {formatMessage(m.goBackToDashboard)}
        </Button>
      </LinkV2>
    </Box>
  )
}

export default GoBack
