import {
  AlertMessage,
  AlertMessageProps,
  Box,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './FormIntro.css'
import { useLocale } from '@island.is/localization'
import { general } from '../../lib/messages'

type WarningProps = {
  type?: AlertMessageProps['type']
  title?: string
  message: string
}

type Props = {
  title?: string
  intro?: string
  button?: React.ReactNode
  warning?: WarningProps
  children?: React.ReactNode
}

export const FormIntro = ({
  title,
  intro,
  button,
  children,
  warning,
}: Props) => {
  const { formatMessage } = useLocale()

  const warningTitle = warning?.title
    ? warning.title
    : formatMessage(general.warningTitle)

  if (!title && !intro && !children) return null

  return (
    <Box className={styles.formIntro}>
      {(title || button) && (
        <Box marginBottom={2} className={styles.titleWrapper}>
          {title && <Text variant="h2">{title}</Text>}
          {button && button}
        </Box>
      )}
      {(intro || children) && (
        <Box marginBottom={4} className={styles.contentWrapper}>
          {intro && <Text>{intro}</Text>}
          {children}
        </Box>
      )}
      {warning && (
        <Box>
          <AlertMessage
            type={warning?.type || 'warning'}
            title={warningTitle}
            message={warning.message}
          />
        </Box>
      )}
    </Box>
  )
}
