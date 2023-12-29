import { Box, Text } from '@island.is/island-ui/core'
import * as styles from './FormIntro.css'
type Props = {
  title?: string
  intro?: string
  children?: React.ReactNode
}

export const FormIntro = ({ title, intro, children }: Props) => {
  if (!title && !intro && !children) return null

  return (
    <Box className={styles.wrapper}>
      {title && (
        <Text variant="h2" marginBottom={2}>
          {title}
        </Text>
      )}
      {intro && <Text>{intro}</Text>}
      {children}
    </Box>
  )
}
