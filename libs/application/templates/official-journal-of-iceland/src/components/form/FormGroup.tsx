import { Box, Text } from '@island.is/island-ui/core'
import * as styles from './FormGroup.css'
type Props = {
  title?: string
  description?: string
  children?: React.ReactNode
}

export const FormGroup = ({ title, description, children }: Props) => {
  return (
    <Box className={styles.formGroup}>
      {(title || description) && (
        <Box>
          {title && (
            <Text marginBottom={description ? 2 : 0} variant="h4">
              {title}
            </Text>
          )}
          {description && <Text>{description}</Text>}
        </Box>
      )}
      {children}
    </Box>
  )
}
