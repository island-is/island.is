import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { Animated, ListRenderItemInfo, RefreshControl } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
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
import { Alert, Button, ListItemSkeleton, TopLine, Typography } from '../../ui'
import { ComponentRegistry } from '../../utils/component-registry'
import { createSkeletonArr } from '../../utils/create-skeleton-arr'
import { isDefined } from '../../utils/is-defined'
import {
  DocumentListItem,
  TOGGLE_ANIMATION_DURATION,
} from './components/document-list-item'
import {
  FloatingBottomContent,
  FloatingBottomFooter,
} from './components/floating-bottom-footer'

type FlatListItem = DocumentComment | { __typename: 'Skeleton'; id: string }

const FIRST_REPLY_HEIGHT = 100

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
  const flatListRef = useRef<Animated.FlatList>(null)
  const scrollY = useRef(new Animated.Value(0)).current

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

  const document = docRes.data?.documentV2
  const comments = document?.ticket?.comments ?? []
  const replyable = document?.replyable ?? false
  const isSkeleton = docRes.loading

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
    if (refetchDocument) {
      setRefetching(true)
      docRes.refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchDocument])

  const keyExtractor = useCallback(
    (item: FlatListItem, index: number) => item.id ?? `comment-${index}`,
    [],
  )

  const onLayoutCallback = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({
        offset: 75 * (comments.length - 1) + 500,
        animated: true,
      })
    }, TOGGLE_ANIMATION_DURATION + 50)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
          {...(index === comments.length - 1 && {
            onLayoutCallback,
          })}
        />
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [comments.length],
  )

  const data = useMemo(
    () => (isSkeleton ? createSkeletonArr(8) : comments),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSkeleton],
  ) as FlatListItem[]

  return (
    <>
      <CaseNumberWrapper>
        <Typography variant="eyebrow" color={theme.color.purple400}>
          {intl.formatMessage({ id: 'documentCommunications.caseNumber' })}
        </Typography>
        <Typography variant="body3">#{document?.ticket?.id}</Typography>
      </CaseNumberWrapper>
      <TopLine scrollY={scrollY} offsetTop={31} />
      <ListWrapper>
        <Animated.FlatList
          ref={flatListRef}
          keyExtractor={keyExtractor}
          contentContainerStyle={{
            paddingBottom:
              !firstReply && replyable
                ? FIRST_REPLY_HEIGHT + insets.bottom + theme.spacing[4]
                : replyable
                ? insets.bottom + buttonHeight
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
          refreshControl={
            <RefreshControl
              refreshing={refetching}
              onRefresh={docRes.refetch}
            />
          }
        />
      </ListWrapper>

      {isDefined(replyable) && (
        <FloatingBottomFooter>
          <FloatingBottomContent>
            {firstReply && replyable && (
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
            )}
            {replyable && (
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
            )}
            {!replyable && !firstReply && (
              <Alert
                type="info"
                message={intl.formatMessage({
                  id: 'documentCommunications.cannotReply',
                })}
                hasBorder
              />
            )}
          </FloatingBottomContent>
        </FloatingBottomFooter>
      )}
    </>
  )
}

DocumentCommunicationsScreen.options = getNavigationOptions
