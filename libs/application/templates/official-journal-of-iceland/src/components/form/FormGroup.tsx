import { Box, Text } from '@island.is/island-ui/core'
import * as styles from './FormGroup.css'
import { MessageDescriptor } from 'react-intl'
import { useLocale } from '@island.is/localization'
type Props = {
  title?: string | MessageDescriptor
  intro?: string | MessageDescriptor
  children?: React.ReactNode
}

export const FormGroup = ({ title, intro, children }: Props) => {
  const { formatMessage: f } = useLocale()

  const titleText = title
    ? typeof title !== 'string'
      ? f(title)
      : title
    : undefined
  const introText = intro
    ? typeof intro !== 'string'
      ? f(intro)
      : intro
    : undefined

  return (
    <Box className={styles.formGroup}>
      {(title || intro) && (
        <Box>
          {titleText && (
            <Text marginBottom={introText ? 1 : 0} variant="h4">
              {titleText}
            </Text>
          )}
          {introText && <Text>{introText}</Text>}
        </Box>
      )}
      {children}
    </Box>
  )
}
