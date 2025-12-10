import {
  AlertMessage,
  AlertMessageProps,
  Box,
  Button,
  Inline,
  LinkV2,
  SkeletonLoader,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './FormScreen.css'
import { useLocale } from '@island.is/localization'
import { general } from '../../lib/messages'
import { OJOI_INPUT_HEIGHT, Routes } from '../../lib/constants'

type WarningProps = {
  type?: AlertMessageProps['type']
  title?: string
  message: string
}

type Props = {
  title?: string
  intro?: React.ReactNode
  description?: React.ReactNode
  button?: React.ReactNode
  warning?: WarningProps
  children?: React.ReactNode
  loading?: boolean
  goToScreen?: (screen: string) => void
}

export const FormScreen = ({
  title,
  intro,
  description,
  button,
  children,
  warning,
  loading,
  goToScreen,
}: Props) => {
  const { formatMessage } = useLocale()

  const warningTitle = warning?.title
    ? warning.title
    : formatMessage(general.warningTitle)

  if (!title && !intro && !children) return null

  const path = window.location.origin
  const helpHref = path.includes('localhost')
    ? `http://localhost:4200/stjornartidindi/leidbeiningar`
    : `${path}/stjornartidindi/leidbeiningar`

  return (
    <>
      {process.env.NODE_ENV === 'development' && goToScreen && (
        <Box marginBottom={2}>
          <Inline flexWrap="wrap" space={2}>
            <Button
              variant="text"
              size="small"
              onClick={() => goToScreen(Routes.ADVERT)}
            >
              Grunnupplýsingar
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={() => goToScreen(Routes.ATTACHMENTS)}
            >
              Viðaukar og fylgiskjöl
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={() => goToScreen(Routes.PREVIEW)}
            >
              Forskoðun
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={() => goToScreen(Routes.ORIGINAL)}
            >
              Frumrit
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={() => goToScreen(Routes.PUBLISHING)}
            >
              Óskir um birtingu
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={() => goToScreen(Routes.SUMMARY)}
            >
              Samantekt
            </Button>
          </Inline>
        </Box>
      )}
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
        {description && (
          <Box marginBottom={4} className={styles.contentWrapper}>
            {description}
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
        <Box>
          <Box className={styles.childrenWrapper}>{children}</Box>
          <Box paddingTop={1}>
            <LinkV2 href={helpHref}>
              <Button variant="text" size="small" icon="arrowForward">
                Skoða hjálparsíðu
              </Button>
            </LinkV2>
          </Box>
        </Box>
      )}
    </>
  )
}
