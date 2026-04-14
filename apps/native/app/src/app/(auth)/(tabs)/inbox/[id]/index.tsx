import { PdfView } from '@kishannareshpal/expo-pdf'
import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  Alert as RNAlert,
  Image,
  SafeAreaView,
  TouchableNativeFeedback,
  Touchable,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native'
import WebView from 'react-native-webview'
import styled from 'styled-components/native'

import { ButtonDrawer } from '@/components/button-drawer'
import { useFeatureFlag } from '@/components/providers/feature-flag-provider'
import { DocumentV2 } from '@/graphql/types/schema'
import { useBrowser } from '@/hooks/use-browser'
import { useDocument } from '@/hooks/use-document'
import { toggleAction } from '@/lib/post-mail-action'
import { useOrganizationsStore } from '@/stores/organizations-store'
import {
  Alert,
  Button,
  Header,
  Loader,
  Problem,
  blue400,
  dynamicColor,
} from '@/ui'
import { getButtonsForActions } from '../../../../../utils/get-buttons-for-actions'
import { shareFile } from '../../../../../utils/share-file'

// --- Styled ---

const Host = styled.SafeAreaView`
  margin-horizontal: ${({ theme }) => theme.spacing[2]}px;
`

const Border = styled.View`
  border-bottom-width: ${({ theme }) => theme.border.width.standard}px;
  border-bottom-color: ${({ theme }) => theme.color.blue200};
`

const ActionsWrapper = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
  margin-horizontal: ${({ theme }) => theme.spacing[2]}px;
  gap: ${({ theme }) => theme.spacing[2]}px;
`

const ContentArea = styled.View`
  flex: 1;
  background-color: ${dynamicColor('background')};
`

export default function DocumentScreen() {
  const { id, isUrgent: isUrgentParam } = useLocalSearchParams<{
    id: string
    isUrgent?: string
  }>()
  const intl = useIntl()
  const { openBrowser } = useBrowser()
  const { getOrganizationLogoUrl } = useOrganizationsStore()
  const isFeature2WayMailboxEnabled = useFeatureFlag(
    'is2WayMailboxEnabled',
    false,
  )

  // Parse isUrgent from route params (string → boolean | undefined)
  const isUrgent =
    isUrgentParam === 'true'
      ? true
      : isUrgentParam === 'false'
      ? false
      : undefined

  const {
    document,
    contentType,
    pdfUri,
    loading,
    error,
    ready,
    htmlSource,
    confirmation,
    hasConfirmation,
    showConfirmedAlert,
    confirmAction,
    refetchDocumentContent,
  } = useDocument(id, isUrgent)

  // Force PdfView to remount when screen regains focus (Android recycles the native surface)
  const [pdfKey, setPdfKey] = useState(0)
  useFocusEffect(
    useCallback(() => {
      setPdfKey((k) => k + 1)
    }, []),
  )

  // Show confirmation alert when an urgent document requires user acknowledgement
  useEffect(() => {
    if (!confirmation) return

    RNAlert.alert(confirmation.title ?? '', confirmation.data ?? '', [
      {
        text: intl.formatMessage({ id: 'inbox.markAllAsReadPromptCancel' }),
        style: 'cancel',
        onPress: async () => {
          await confirmAction(false)
          router.back()
        },
      },
      {
        text: intl.formatMessage({ id: 'inbox.openDocument' }),
        onPress: async () => {
          await confirmAction(true)
          await refetchDocumentContent()
        },
      },
    ])
  }, [confirmation, confirmAction, refetchDocumentContent, intl])

  const onShare = () =>
    shareFile({
      document: document as DocumentV2,
      type:
        contentType === 'pdf' ? 'pdf' : contentType === 'html' ? 'html' : 'url',
      pdfUrl: pdfUri ?? undefined,
      content: contentType !== 'pdf' ? document.content?.value : undefined,
    })

  const onToggleArchive = () => {
    if (document.id)
      toggleAction(document.archived ? 'unarchive' : 'archive', document.id)
  }

  const onToggleBookmark = () => {
    if (document.id)
      toggleAction(document.bookmarked ? 'unbookmark' : 'bookmark', document.id)
  }

  const hasAlert =
    showConfirmedAlert ||
    ((!!document.alert?.title || !!document.alert?.data) && !hasConfirmation)
  const hasActions = !!document.actions?.length && !hasConfirmation
  const showAdditionalInfo = hasAlert || hasActions

  const isReplyable = document.replyable ?? false
  const hasComments = (document?.ticket?.comments?.length ?? 0) > 0

  const onReplyOrCommunicationsPress = () => {
    if (hasComments) {
      router.push({
        pathname: '/(auth)/(tabs)/inbox/[id]/communications',
        params: {
          id,
          ticketId: document.ticket?.id ?? '',
          subject: document.subject ?? '',
        },
      })
    } else {
      router.push({
        pathname: '/(auth)/(tabs)/inbox/[id]/reply',
        params: {
          id,
          senderName: document.sender?.name ?? '',
          subject: document.subject ?? '',
        },
      })
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <>
              <Pressable onPress={onShare} disabled={!ready}>
                <Image
                  source={require('@/assets/icons/navbar-share.png')}
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: blue400,
                    marginHorizontal: 8,
                  }}
                />
              </Pressable>
              <Pressable onPress={onToggleArchive}>
                <Image
                  source={
                    document.archived
                      ? require('@/assets/icons/tray-filled.png')
                      : require('@/assets/icons/tray.png')
                  }
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: blue400,
                    marginHorizontal: 8,
                  }}
                />
              </Pressable>
              <Pressable onPress={onToggleBookmark}>
                <Image
                  source={
                    document.bookmarked
                      ? require('@/assets/icons/star-filled.png')
                      : require('@/assets/icons/star.png')
                  }
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: blue400,
                    marginHorizontal: 8,
                  }}
                />
              </Pressable>
            </>
          ),
        }}
      />
      <Host>
        <Header
          title={document.sender?.name ?? ''}
          date={document.publicationDate ?? undefined}
          message={document.subject}
          isLoading={loading && !document.subject}
          logo={getOrganizationLogoUrl(document.sender?.name ?? '', 75)}
          label={isUrgent ? intl.formatMessage({ id: 'inbox.urgent' }) : ''}
        />
      </Host>
      {showAdditionalInfo && (
        <ActionsWrapper>
          {hasAlert && (
            <Alert
              type="success"
              hasBorder
              message={
                document.alert?.title ?? document.alert?.data ?? undefined
              }
            />
          )}
          {hasActions &&
            getButtonsForActions(
              openBrowser,
              onShare,
              'document-detail',
              document.actions,
            )}
        </ActionsWrapper>
      )}
      <Border />
      <ContentArea>
        {error ? (
          <Problem type="error" withContainer />
        ) : !ready ? (
          <Loader
            text={intl.formatMessage({ id: 'documentDetail.loadingText' })}
          />
        ) : contentType === 'pdf' && pdfUri ? (
          <PdfView key={pdfKey} uri={pdfUri} style={{ flex: 1 }} />
        ) : contentType === 'html' && htmlSource ? (
          <WebView source={htmlSource} scalesPageToFit />
        ) : contentType === 'url' && document.content?.value ? (
          <WebView source={{ uri: document.content.value }} />
        ) : null}
      </ContentArea>
      {isFeature2WayMailboxEnabled && isReplyable && !loading && (
        <ButtonDrawer>
          <SafeAreaView>
            <Button
              title={intl.formatMessage({
                id: hasComments
                  ? 'documentDetail.buttonCommunications'
                  : 'documentDetail.buttonReply',
              })}
              isTransparent
              isOutlined
              iconPosition="start"
              icon={
                hasComments
                  ? require('@/assets/icons/chatbubbles.png')
                  : require('@/assets/icons/reply.png')
              }
              onPress={onReplyOrCommunicationsPress}
              style={{ marginBottom: 8 }}
            />
          </SafeAreaView>
        </ButtonDrawer>
      )}
    </>
  )
}
