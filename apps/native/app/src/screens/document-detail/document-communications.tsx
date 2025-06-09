import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { ScrollView } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'
import { useUser } from '../../contexts/user-provider'
import { useGetDocumentQuery } from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { useDateTimeFormatter } from '../../hooks/use-date-time-formatter'
import { useLocale } from '../../hooks/use-locale'
import { useNavigation } from '../../hooks/use-navigation'
import {
  Alert,
  Button,
  Container,
  ListItemSkeleton,
  Typography,
} from '../../ui'
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

const AlertWrapper = styled(Container)`
  margin-top: ${({ theme }) => theme.spacing[2]}px;
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
  documentId: string
  firstReply?: boolean
  refetchDocument?: boolean
}

export const DocumentCommunicationsScreen: NavigationFunctionComponent<
  DocumentCommunicationsScreenProps
> = ({ componentId, documentId, firstReply = false, refetchDocument }) => {
  useNavigationOptions(componentId)
  const locale = useLocale()
  const theme = useTheme()
  const intl = useIntl()
  const formatDate = useDateTimeFormatter()
  const { showModal } = useNavigation()
  const { user } = useUser()

  const insets = useSafeAreaInsets()
  const [buttonHeight, setButtonHeight] = useState(48) // Default height
  const [refetching, setRefetching] = useState(false)

  const docRes = useGetDocumentQuery({
    variables: {
      input: {
        id: documentId,
      },
      locale,
    },
    onCompleted: () => {
      setRefetching(false)
    },
  })

  useConnectivityIndicator({
    componentId,
    queryResult: docRes,
    refetching,
  })

  useEffect(() => {
    if (refetchDocument) {
      setRefetching(true)
      docRes.refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchDocument])

  const document = docRes.data?.documentV2
  const comments = document?.ticket?.comments ?? []
  const replyable = document?.replyable ?? false

  const onReplyPress = () => {
    if (!document?.sender?.name) {
      return
    }

    showModal(ComponentRegistry.DocumentReplyScreen, {
      passProps: {
        senderName: document.sender.name,
        documentId,
        subject: document?.subject,
      },
    })
  }

  const renderAlert = (message: string) => {
    return (
      <AlertWrapper>
        <Alert type="info" message={message} hasBorder />
      </AlertWrapper>
    )
  }

  return (
    <>
      <CaseNumberWrapper>
        <Typography variant="eyebrow" color={theme.color.purple400}>
          {intl.formatMessage({ id: 'documentCommunications.caseNumber' })}
        </Typography>
        <Typography variant="body3">#{document?.ticket?.id}</Typography>
      </CaseNumberWrapper>
      <ListWrapper
        {...(document?.replyable && {
          contentContainerStyle: {
            paddingBottom: insets.bottom + buttonHeight + theme.spacing[2],
          },
        })}
      >
        {docRes.loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <ListItemSkeleton key={i} showDate={false} />
            ))
          : comments.map((comment, index) => (
              <DocumentListItem
                key={comment.id}
                isOpen={index === 0}
                sender={document?.sender?.name ?? ''}
                title={comment.author ?? ''}
                body={comment.body ?? undefined}
                date={
                  comment.createdDate
                    ? formatDate(comment.createdDate)
                    : undefined
                }
                hasTopBorder={index !== 0}
              />
            ))}
        {!replyable &&
          renderAlert(
            intl.formatMessage({
              id: 'documentCommunications.cannotReply',
            }),
          )}
        {firstReply &&
          renderAlert(
            intl.formatMessage(
              {
                id: 'documentCommunications.initialReply',
              },
              {
                email: user?.email ?? '',
              },
            ),
          )}
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
