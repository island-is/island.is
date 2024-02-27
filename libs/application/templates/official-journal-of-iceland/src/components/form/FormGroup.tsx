import { Box, Text } from '@island.is/island-ui/core'
import * as styles from './FormGroup.css'
type Props = {
  title?: string
  intro?: string
  children?: React.ReactNode
}

export const FormGroup = ({ title, intro, children }: Props) => {
  return (
    <Box className={styles.formGroup}>
      {(title || intro) && (
        <Box>
          {title && (
            <Text marginBottom={intro ? 1 : 0} variant="h4">
              {title}
            </Text>
          )}
          {intro && <Text>{intro}</Text>}
        </Box>
      )}
      {children}
    </Box>
  )
}
