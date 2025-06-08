import { useState } from 'react'
import { useIntl } from 'react-intl'
import { ScrollView } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'
import { DocumentV2 } from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useDateTimeFormatter } from '../../hooks/use-date-time-formatter'
import { useNavigation } from '../../hooks/use-navigation'
import { Button, Typography } from '../../ui'
import { ComponentRegistry } from '../../utils/component-registry'
import { DocumentListItem } from './components/document-list-item'
import {
  FloatingBottomContent,
  FloatingBottomFooter,
} from './components/floating-bottom-footer'

const CaseNumberWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  column-gap: ${({ theme }) => theme.spacing.smallGutter}px;
`

const ListWrapper = styled(ScrollView)`
  padding-top: ${({ theme }) => theme.spacing[2]}px;
`

const { useNavigationOptions, getNavigationOptions } =
  createNavigationOptionHooks(
    () => ({
      topBar: {
        noBorder: true,
      },
    }),
    {
      bottomTabs: {
        visible: false,
      },
    },
  )

type DocumentCommunicationsScreenProps = {
  document: DocumentV2
}

export const DocumentCommunicationsScreen: NavigationFunctionComponent<
  DocumentCommunicationsScreenProps
> = ({ componentId, document }) => {
  useNavigationOptions(componentId)

  const theme = useTheme()
  const intl = useIntl()
  const formatDate = useDateTimeFormatter()
  const { showModal } = useNavigation()

  const insets = useSafeAreaInsets()
  const [buttonHeight, setButtonHeight] = useState(48) // Default height

  const { ticket, sender, replyable } = document
  const comments = ticket?.comments ?? []

  const onReplyPress = () => {
    if (!sender?.name) {
      return
    }

    showModal(ComponentRegistry.DocumentReplyScreen, {
      passProps: {
        senderName: sender.name,
        documentId: document.id,
        subject: document.subject,
      },
    })
  }

  return (
    <>
      <CaseNumberWrapper>
        <Typography variant="eyebrow" color={theme.color.purple400}>
          {intl.formatMessage({ id: 'documentCommunications.caseNumber' })}
        </Typography>
        <Typography variant="body3">#{ticket?.id}</Typography>
      </CaseNumberWrapper>
      <ListWrapper
        {...(replyable && {
          contentContainerStyle: {
            paddingBottom: insets.bottom + buttonHeight,
          },
        })}
      >
        {comments.reverse().map((comment, index) => (
          <DocumentListItem
            key={comment.id}
            sender={sender?.name ?? ''}
            title={comment.author ?? ''}
            body={comment.body ?? undefined}
            date={
              comment.createdDate ? formatDate(comment.createdDate) : undefined
            }
            hasTopBorder={index !== 0}
          />
        ))}
      </ListWrapper>
      {replyable && (
        <FloatingBottomFooter>
          <FloatingBottomContent>
            <Button
              onLayout={(event) => {
                setButtonHeight(event.nativeEvent.layout.height)
              }}
              title={intl.formatMessage({
                id: 'documentDetail.buttonReply',
              })}
              isTransparent
              isOutlined
              iconPosition="left"
              icon={require('../../assets/icons/reply.png')}
              onPress={onReplyPress}
            />
          </FloatingBottomContent>
        </FloatingBottomFooter>
      )}
    </>
  )
}

DocumentCommunicationsScreen.options = getNavigationOptions
