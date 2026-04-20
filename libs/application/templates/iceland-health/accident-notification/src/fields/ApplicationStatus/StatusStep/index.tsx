import { Box, Button, Tag, TagVariant, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import * as styles from './ReviewSection.css'
import { MessageDescriptor } from 'react-intl'

export type ActionProps = {
  title: string
  description: string
  fileNames?: string
  actionButtonTitle: string
  hasActionButtonIcon?: boolean
  showAlways?: boolean
  cta?: () => void
}

type Props = {
  title: string
  description: string
  hasActionMessage: boolean
  action?: ActionProps
  visible?: boolean
  tagText: MessageDescriptor | string
  tagVariant: TagVariant
}

export const StatusStep = ({
  title,
  description,
  tagVariant = 'blue',
  tagText = 'Í bið',
  hasActionMessage,
  action,
  visible = true,
}: Props) => {
  const { formatMessage } = useLocale()
  const handleOnCTAButtonClick = () => {
    action?.cta && action.cta()
  }
  if (!visible) return null

  return (
    <Box
      position="relative"
      border="standard"
      borderRadius="large"
      marginBottom={2}
    >
      {/* Contents */}
      <Box padding={4}>
        <Box marginTop={[1, 0, 0]} paddingRight={[0, 1, 1]}>
          <Box display="flex" justifyContent="spaceBetween">
            <Text variant="h3">{title}</Text>
            <Tag variant={tagVariant} disabled>
              {formatMessage(tagText)}
            </Tag>
          </Box>
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="flexEnd"
            flexWrap={['wrap', 'nowrap']}
          >
            <Text marginTop={1} variant="default">
              {description}
            </Text>
            {!hasActionMessage && action && action.showAlways && (
              <Box className={styles.flexNone}>
                <Button
                  colorScheme="default"
                  icon={action.hasActionButtonIcon ? 'attach' : undefined}
                  iconType="filled"
                  size="small"
                  type="button"
                  variant="text"
                  onClick={handleOnCTAButtonClick}
                >
                  {action.actionButtonTitle}
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Action messages */}
      {hasActionMessage && action && (
        <Box
          alignItems="flexStart"
          display="flex"
          flexDirection={['columnReverse', 'row']}
          justifyContent="spaceBetween"
          background="roseTinted100"
          padding={4}
          className={styles.bottomBorderRadius}
        >
          <Box marginTop={[1, 0, 0]} paddingRight={[0, 1, 1]}>
            <Text variant="h5">{action.title}</Text>
            <Text marginTop={1} variant="default">
              {action.description}{' '}
              {action.fileNames && (
                <span className={styles.boldFileNames}>{action.fileNames}</span>
              )}
            </Text>
            <Box marginTop={1}>
              <Button
                colorScheme="default"
                icon={action.hasActionButtonIcon ? 'attach' : undefined}
                iconType="filled"
                size="small"
                type="button"
                variant="text"
                onClick={handleOnCTAButtonClick}
              >
                {action.actionButtonTitle}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}
