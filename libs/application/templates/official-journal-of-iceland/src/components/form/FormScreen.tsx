import {
  AlertMessage,
  AlertMessageProps,
  Box,
  SkeletonLoader,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './FormScreen.css'
import { useLocale } from '@island.is/localization'
import { general } from '../../lib/messages'
import { OJOI_INPUT_HEIGHT } from '../../lib/constants'

type WarningProps = {
  type?: AlertMessageProps['type']
  title?: string
  message: string
}

type Props = {
  title?: string
  intro?: React.ReactNode
  button?: React.ReactNode
  warning?: WarningProps
  children?: React.ReactNode
  loading?: boolean
}

export const FormScreen = ({
  title,
  intro,
  button,
  children,
  warning,
  loading,
}: Props) => {
  const { formatMessage } = useLocale()

  const warningTitle = warning?.title
    ? warning.title
    : formatMessage(general.warningTitle)

  if (!title && !intro && !children) return null

  return (
    <>
      <Box className={styles.formIntro}>
        {(title || button) && (
          <Box marginBottom={2} className={styles.titleWrapper}>
            {title && <Text variant="h2">{title}</Text>}
            {button && button}
          </Box>
        )}
        {intro && (
          <Box marginBottom={4} className={styles.contentWrapper}>
            {intro && <Text>{intro}</Text>}
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
      {loading ? (
        <SkeletonLoader
          height={OJOI_INPUT_HEIGHT}
          repeat={3}
          borderRadius="standard"
          space={2}
        />
      ) : (
        <Box className={styles.childrenWrapper}>{children}</Box>
      )}
    </>
  )
}
