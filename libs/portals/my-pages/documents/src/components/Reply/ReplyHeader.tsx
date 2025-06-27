import { Box, Button, Icon, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m, Tooltip, useIsMobile } from '@island.is/portals/my-pages/core'
import { InformationPaths } from '@island.is/portals/my-pages/information'
import copyToClipboard from 'copy-to-clipboard'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDocumentContext } from '../../screens/Overview/DocumentContext'
import { messages } from '../../utils/messages'
import ReplyHeaderMobile from './Mobile/MobileHeader'
import * as styles from './Reply.css'
import AvatarImage from '../DocumentLine/AvatarImage'

interface ReplyHeaderProps {
  initials?: string
  title: string
  subTitle: string
  caseNumber?: string
  secondSubTitle?: string
  hasEmail?: boolean
  displayCloseButton?: boolean
  displayEmail?: boolean
  onClose?: () => void
  avatar?: string
}

const ReplyHeader: React.FC<ReplyHeaderProps> = ({
  initials,
  title,
  subTitle,
  caseNumber,
  secondSubTitle,
  hasEmail,
  displayCloseButton,
  displayEmail,
  onClose,
  avatar,
}) => {
  const navigate = useNavigate()
  const { formatMessage } = useLocale()
  const { isMobile } = useIsMobile()
  const { replyState } = useDocumentContext()
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  if (isMobile && replyState?.replyOpen)
    return (
      <ReplyHeaderMobile
        title={title}
        to={subTitle}
        from={secondSubTitle}
        displayEmail={displayEmail}
        hasEmail={hasEmail}
      />
    )

  const copy = (code?: string | null) => {
    if (code) {
      copyToClipboard(code)
      setCopiedCode(code)
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="spaceBetween"
      paddingTop={3}
      width="full"
    >
      <Box display="flex" flexDirection="row" marginBottom={3} width="full">
        {initials ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            background="blueberry100"
            borderRadius="full"
            style={{ minWidth: isMobile ? 48 : 56, height: isMobile ? 48 : 56 }}
          >
            <Text variant="h5" as="p">
              {initials}
            </Text>
          </Box>
        ) : (
          avatar && <AvatarImage large img={avatar} background="blue100" />
        )}

        <Box
          display={'flex'}
          flexDirection={'column'}
          marginLeft={2}
          justifyContent="center"
          width={isMobile ? 'full' : undefined}
        >
          <Text
            variant={isMobile ? 'default' : 'eyebrow'}
            truncate
            fontWeight="medium"
          >
            {title}
          </Text>
          <Box display="flex" width="full" flexDirection="column">
            <Box
              display="flex"
              justifyContent="flexStart"
              flexDirection={
                caseNumber ? 'row' : ['column', 'column', 'column', 'row']
              }
            >
              <Text variant="medium">{subTitle}</Text>
              {caseNumber && (
                <Box className={styles.caseNumberDivider}>
                  <Text variant="medium">
                    {formatMessage(
                      isMobile ? messages.caseNumberShort : messages.caseNumber,
                    )}{' '}
                    {caseNumber}
                  </Text>
                  <Tooltip
                    text={
                      copiedCode === caseNumber
                        ? formatMessage(m.copied)
                        : formatMessage(m.copy)
                    }
                  >
                    <Box
                      cursor="pointer"
                      marginLeft={1}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      onClick={() => {
                        copy(caseNumber)
                      }}
                    >
                      <Icon
                        icon="copy"
                        type="outline"
                        color="blue400"
                        size="small"
                      />
                    </Box>
                  </Tooltip>
                </Box>
              )}
            </Box>
            {displayEmail &&
              (hasEmail ? (
                <Text variant="medium">{secondSubTitle}</Text>
              ) : (
                <Button
                  variant="text"
                  icon="pencil"
                  iconType="outline"
                  size="small"
                  onClick={() => {
                    navigate(InformationPaths.Settings)
                  }}
                >
                  {formatMessage(messages.pleaseRegisterEmail)}
                </Button>
              ))}
          </Box>
        </Box>
      </Box>
      {/* Close button */}
      {displayCloseButton && (
        <Box>
          <Button circle icon="close" colorScheme="light" onClick={onClose} />
        </Box>
      )}
    </Box>
  )
}

export default ReplyHeader
