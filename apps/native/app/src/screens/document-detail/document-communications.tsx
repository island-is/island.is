import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { Animated, ListRenderItemInfo, RefreshControl } from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
} from 'react-native-navigation'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'
import { useUser } from '../../contexts/user-provider'
import {
  DocumentComment,
  useGetDocumentQuery,
} from '../../graphql/types/schema'
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
  TopLine,
  Typography,
} from '../../ui'
import { ComponentRegistry } from '../../utils/component-registry'
import { createSkeletonArr } from '../../utils/create-skeleton-arr'
import {
  DocumentListItem,
  TOGGLE_ANIMATION_DURATION,
} from './components/document-list-item'
import {
  FloatingBottomContent,
  FloatingBottomFooter,
} from './components/floating-bottom-footer'

type FlatListItem = DocumentComment | { __typename: 'Skeleton'; id: string }

const LAST_REPLY_HEIGHT = 100

const CaseNumberWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  column-gap: ${({ theme }) => theme.spacing.smallGutter}px;
`

const ListWrapper = styled.View`
  flex: 1;
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
  documentId: string
  firstReply?: boolean
}

export const DocumentCommunicationsScreen: NavigationFunctionComponent<
  DocumentCommunicationsScreenProps
> = ({ componentId, documentId, firstReply = false }) => {
  useNavigationOptions(componentId)
  const locale = useLocale()
  const theme = useTheme()
  const intl = useIntl()
  const formatDate = useDateTimeFormatter()
  const { showModal } = useNavigation()
  const { user } = useUser()
  const insets = useSafeAreaInsets()
  const [shouldScroll, setShouldScroll] = useState(false)
  const [buttonHeight, setButtonHeight] = useState(48) // Default height
  const [refetching, setRefetching] = useState(false)
  const flatListRef = useRef<Animated.FlatList>(null)
  const scrollY = useRef(new Animated.Value(0)).current

  const docRes = useGetDocumentQuery({
    variables: {
      input: {
        id: documentId,
      },
      locale,
    },
  })

  useConnectivityIndicator({
    componentId,
    queryResult: docRes,
    refetching,
  })

  const document = docRes.data?.documentV2
  const comments = document?.ticket?.comments ?? []
  const replyable =
    !docRes.loading && document && document?.replyable
      ? document?.replyable
      : true
  const isSkeleton = docRes.loading && !docRes.data

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

  useEffect(() => {
    const modalDismissedListener =
      Navigation.events().registerModalDismissedListener(
        async ({ componentName }) => {
          if (componentName === ComponentRegistry.DocumentReplyScreen) {
            setRefetching(true)
            docRes.refetch().finally(() => setRefetching(false))
          }
        },
      )

    return () => {
      modalDismissedListener.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isSkeleton && comments.length > 0) {
      setShouldScroll(true)
    }
    // Only run when isSkeleton or comments.length changes
  }, [isSkeleton, comments.length])

  const keyExtractor = useCallback(
    (item: FlatListItem, index: number) => item.id ?? `comment-${index}`,
    [],
  )

  const handleContentSizeChange = () => {
    if (shouldScroll) {
      setShouldScroll(false)
      setTimeout(() => {
        requestAnimationFrame(() => {
          flatListRef.current?.scrollToOffset({
            offset: 75 * (comments.length - 1),
            animated: true,
          })
        })
      }, TOGGLE_ANIMATION_DURATION + 100)
    }
  }

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<FlatListItem>) => {
      if (item.__typename === 'Skeleton') {
        return <ListItemSkeleton key={item.id} showDate={false} />
      }

      return (
        <DocumentListItem
          key={item.id}
          isOpen={index === comments.length - 1}
          closeable={comments.length > 1}
          sender={document?.sender?.name ?? ''}
          title={item.author ?? ''}
          body={item.body ?? undefined}
          date={item.createdDate ? formatDate(item.createdDate) : undefined}
          hasTopBorder={index !== 0}
        />
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [comments.length],
  )

  const data = useMemo(
    () => (isSkeleton ? createSkeletonArr(8) : comments),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSkeleton, docRes.data],
  ) as FlatListItem[]

  return (
    <>
      <CaseNumberWrapper>
        <Typography variant="eyebrow" color={theme.color.purple400}>
          {intl.formatMessage({ id: 'documentCommunications.caseNumber' })}
        </Typography>
        <Typography variant="body3">#{document?.ticket?.id}</Typography>
      </CaseNumberWrapper>
      {(!firstReply || !replyable) && (
        <TopLine scrollY={scrollY} offsetTop={31} />
      )}
      <ListWrapper>
        {!replyable && (
          <Container>
            <Alert
              type="info"
              message={intl.formatMessage({
                id: 'documentCommunications.cannotReply',
              })}
              hasBorder
            />
          </Container>
        )}
        {firstReply && replyable && (
          <Container>
            <Alert
              type="info"
              message={intl.formatMessage(
                {
                  id: 'documentCommunications.initialReply',
                },
                {
                  email: user?.email ?? '',
                },
              )}
              hasBorder
            />
          </Container>
        )}
        <Animated.FlatList
          ref={flatListRef}
          keyExtractor={keyExtractor}
          initialNumToRender={50}
          contentContainerStyle={{
            paddingBottom: replyable
              ? insets.bottom + buttonHeight + LAST_REPLY_HEIGHT
              : 0,
          }}
          data={data}
          renderItem={renderItem}
          style={{ flex: 1 }}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            {
              useNativeDriver: true,
            },
          )}
          onContentSizeChange={handleContentSizeChange}
          refreshControl={
            <RefreshControl
              refreshing={refetching}
              onRefresh={docRes.refetch}
            />
          }
        />
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
