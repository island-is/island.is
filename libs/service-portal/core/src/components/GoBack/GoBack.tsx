import {
  Box,
  Button,
  ResponsiveProp,
  ResponsiveSpace,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { LinkResolver, m } from '../../'
import * as styles from './GoBack.css'

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
          {label ?? formatMessage(m.goBackToDashboard)}
        </Button>
      </LinkResolver>
    </Box>
  )
}

export default GoBack
