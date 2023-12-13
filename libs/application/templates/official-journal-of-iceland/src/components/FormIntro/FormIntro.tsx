import { Box, Text } from '@island.is/island-ui/core'
import * as styles from './FormIntro.css'
type Props = {
  title?: string
  description?: string
  children?: React.ReactNode
}

export const FormIntro = ({ title, description, children }: Props) => {
  if (!title && !description) return null

  return (
    <Box className={styles.wrapper}>
      {title && (
        <Text variant="h2" marginBottom={2}>
          {title}
        </Text>
      )}
      {description && <Text>{description}</Text>}
      {children}
    </Box>
  )
}
