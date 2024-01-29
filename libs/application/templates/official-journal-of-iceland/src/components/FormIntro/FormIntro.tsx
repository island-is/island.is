import { Box, Text } from '@island.is/island-ui/core'
import * as styles from './FormIntro.css'
type Props = {
  title?: string
  intro?: string
  button?: React.ReactNode
  children?: React.ReactNode
}

export const FormIntro = ({ title, intro, button, children }: Props) => {
  if (!title && !intro && !children) return null

  return (
    <>
      <Box className={styles.titleWrapper}>
        {title && <Text variant="h2">{title}</Text>}
        {button && button}
      </Box>
      <Box className={styles.wrapper}>
        {intro && <Text>{intro}</Text>}
        {children}
      </Box>
    </>
  )
}
