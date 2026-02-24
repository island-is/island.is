import { PdfView } from '@kishannareshpal/expo-pdf'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useIntl } from 'react-intl'
import { Image, TouchableOpacity, View } from 'react-native'
import WebView from 'react-native-webview'
import styled from 'styled-components/native'

import {
  DocumentV2,
} from '@/graphql/types/schema'
import { toggleAction } from '@/lib/post-mail-action'
import { useBrowser } from '@/lib/use-browser'
import { getButtonsForActions } from '@/screens/document-detail/utils/get-buttons-for-actions'
import { shareFile } from '@/screens/document-detail/utils/share-file'
import { useOrganizationsStore } from '@/stores/organizations-store'
import { Alert, Header, Loader, Problem, blue400, dynamicColor } from '@/ui'
import { useDocument } from '@/hooks/use-document'

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
  const { id } = useLocalSearchParams<{ id: string }>()
  const intl = useIntl()
  const { openBrowser } = useBrowser()
  const { getOrganizationLogoUrl } = useOrganizationsStore()

  const { document, contentType, pdfUri, loading, error, ready, htmlSource } =
    useDocument(id)

  const onShare = () =>
    shareFile({
      document: document as DocumentV2,
      type: contentType === 'pdf' ? 'pdf' : contentType === 'html' ? 'html' : 'url',
      pdfUrl: pdfUri ?? undefined,
      content: contentType !== 'pdf' ? document.content?.value : undefined,
    })

  const onToggleArchive = () => {
    if (document.id)
      toggleAction(document.archived ? 'unarchive' : 'archive', document.id)
  }

  const onToggleBookmark = () => {
    if (document.id)
      toggleAction(
        document.bookmarked ? 'unbookmark' : 'bookmark',
        document.id,
      )
  }

  const hasAlert = !!document.alert?.title || !!document.alert?.data
  const hasActions = !!document.actions?.length

  return (
    <>
      <Stack.Screen
        options={{
          title: intl.formatMessage({ id: 'documentDetail.screenTitle' }),
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity onPress={onShare} disabled={!ready}>
                <Image
                  source={require('@/assets/icons/navbar-share.png')}
                  style={{ width: 24, height: 24, tintColor: blue400 }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={onToggleArchive}>
                <Image
                  source={
                    document.archived
                      ? require('@/assets/icons/tray-filled.png')
                      : require('@/assets/icons/tray.png')
                  }
                  style={{ width: 24, height: 24, tintColor: blue400 }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={onToggleBookmark}>
                <Image
                  source={
                    document.bookmarked
                      ? require('@/assets/icons/star-filled.png')
                      : require('@/assets/icons/star.png')
                  }
                  style={{ width: 24, height: 24, tintColor: blue400 }}
                />
              </TouchableOpacity>
            </View>
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
        />
      </Host>
      {(hasAlert || hasActions) && (
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
          <PdfView uri={pdfUri} style={{ flex: 1 }} />
        ) : contentType === 'html' && htmlSource ? (
          <WebView source={htmlSource} scalesPageToFit />
        ) : contentType === 'url' && document.content?.value ? (
          <WebView source={{ uri: document.content.value }} />
        ) : null}
      </ContentArea>
    </>
  )
}
