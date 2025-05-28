import { useApolloClient, useFragment_experimental } from '@apollo/client'
import React, { useEffect, useRef, useState } from 'react'
import { FormattedDate, useIntl } from 'react-intl'
import {
  Alert as RNAlert,
  Animated,
  Platform,
  StyleSheet,
  View,
} from 'react-native'
import { DdLogs } from '@datadog/mobile-react-native'
import {
  Navigation,
  NavigationFunctionComponent,
  OptionsTopBarButton,
} from 'react-native-navigation'
import {
  useNavigationButtonPress,
  useNavigationComponentDidAppear,
} from 'react-native-navigation-hooks/dist'
import Pdf, { Source } from 'react-native-pdf'
import WebView from 'react-native-webview'
import styled, { useTheme } from 'styled-components/native'

import { Alert, blue400, dynamicColor, Header, Loader, Problem } from '../../ui'
import {
  DocumentV2,
  DocumentV2Action,
  ListDocumentFragmentDoc,
  useGetDocumentQuery,
  useDocumentConfirmActionsLazyQuery,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { useLocale } from '../../hooks/use-locale'
import { toggleAction } from '../../lib/post-mail-action'
import { authStore } from '../../stores/auth-store'
import { useOrganizationsStore } from '../../stores/organizations-store'
import { ButtonRegistry } from '../../utils/component-registry'
import { getButtonsForActions } from './utils/get-buttons-for-actions'
import { useBrowser } from '../../lib/use-browser'
import { shareFile } from './utils/share-file'

const Host = styled.SafeAreaView`
  margin-left: ${({ theme }) => theme.spacing[2]}px;
  margin-right: ${({ theme }) => theme.spacing[2]}px;
`

const Border = styled.View`
  height: 1px;
  background-color: ${dynamicColor((props) => ({
    dark: props.theme.shades.dark.shade200,
    light: props.theme.color.blue100,
  }))};
`

const ActionsWrapper = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
  margin-horizontal: ${({ theme }) => theme.spacing[2]}px;
  gap: ${({ theme }) => theme.spacing[2]}px;
`

const PdfWrapper = styled.View`
  flex: 1;
  background-color: ${dynamicColor('background')};
`

const DocumentWrapper = styled.View<{ hasMarginTop?: boolean }>`
  flex: 1;
  margin-horizontal: ${({ theme }) => theme.spacing[2]}px;
  padding-top: ${({ theme }) => theme.spacing[2]}px;
`
const regexForBr = /<br\s*\/>/gi

// Styles for html documents
const useHtmlStyles = () => {
  const theme = useTheme()
  return `<style>
    body {
      font-family: "IBM Plex Sans", San Francisco, Segoe UI, sans-serif;
      margin: ${theme.spacing[3]}px;
    }
    h1 {
      color: ${theme.color.text};
      font-size: 32px;
      line-height: 38px;
    }
    h2 {
      color: ${theme.color.text};
      font-size: 26px;
      line-height: 32px;
    }
    h3 {
      color: ${theme.color.text};
      font-size: 20px;
      line-height: 26px;
    }
    p {
      color: ${theme.color.text};
      font-size: 16px;
      line-height: 24px;
    }
    a {
      color: ${theme.color.blue400};
      text-decoration: none;
    }
    svg {
      max-width: 100%;
      display: block;
    }
    img {
      max-width: 100%;
      display: block;
    }
    </style>
    <meta name="viewport" content="width=device-width">`
}

function getRightButtonsForDocumentDetail({
  archived,
  bookmarked,
}: {
  archived?: boolean
  bookmarked?: boolean
} = {}): OptionsTopBarButton[] {
  const iconBackground = {
    color: 'transparent',
    cornerRadius: 8,
    width: 32,
    height: 32,
  }

  return [
    {
      id: ButtonRegistry.ShareButton,
      icon: require('../../assets/icons/navbar-share.png'),
      color: blue400,
      accessibilityLabel: 'Share',
      iconBackground: iconBackground,
    },
    {
      id: ButtonRegistry.DocumentArchiveButton,
      icon: archived
        ? require('../../assets/icons/tray-filled.png')
        : require('../../assets/icons/tray.png'),
      color: blue400,
      accessibilityLabel: 'Archive',
      iconBackground: iconBackground,
    },
    {
      id: ButtonRegistry.DocumentStarButton,
      icon: bookmarked
        ? require('../../assets/icons/star-filled.png')
        : require('../../assets/icons/star.png'),
      color: blue400,
      accessibilityLabel: 'Star',
      iconBackground: iconBackground,
    },
  ]
}

const { useNavigationOptions, getNavigationOptions } =
  createNavigationOptionHooks(
    (theme, intl) => ({
      topBar: {
        title: {
          text: intl.formatMessage({ id: 'documentDetail.screenTitle' }),
        },
        noBorder: true,
      },
    }),
    {
      bottomTabs: {
        visible: false,
      },
      topBar: {
        noBorder: true,
        rightButtons: getRightButtonsForDocumentDetail(),
      },
    },
  )

interface PdfViewerProps {
  url: string
  subject: string
  senderName: string
  onLoaded: (path: string) => void
  onError: (err: Error) => void
}

const PdfViewer = React.memo(
  ({ url, subject, senderName, onLoaded, onError }: PdfViewerProps) => {
    const [actualUrl, setActualUrl] = useState(url)
    const extraProps = {
      activityIndicatorProps: {
        color: '#0061ff',
        progressTintColor: '#ccdfff',
      },
    }

    return (
      <Pdf
        source={{ uri: actualUrl }}
        onLoadComplete={(_, filePath) => {
          onLoaded?.(filePath)
        }}
        onError={(err) => {
          // Send error to Datadog with document subject and sender name
          DdLogs.warn(`PDF error for document "${subject}"`, {
            error: (err as Error)?.message,
            documentTitle: subject,
            documentSenderName: senderName,
          })

          // Check if actualUrl contains any whitespace character and update if needed
          // The Base64 logic on iOS does not support whitespace.
          if (/\s/.test(actualUrl)) {
            const cleanedUrl = actualUrl.replace(/\s/g, '')
            setActualUrl(cleanedUrl)
          } else {
            onError?.(err as Error)
          }
        }}
        trustAllCerts={Platform.select({ android: false, ios: undefined })}
        style={{
          flex: 1,
          backgroundColor: 'transparent',
        }}
        {...extraProps}
      />
    )
  },
  (prevProps, nextProps) => {
    if (prevProps.url === nextProps.url) {
      return true
    }
    return false
  },
)

export const DocumentDetailScreen: NavigationFunctionComponent<{
  docId: string
  isUrgent?: boolean
}> = ({ componentId, docId, isUrgent }) => {
  useNavigationOptions(componentId)

  const client = useApolloClient()
  const intl = useIntl()
  const htmlStyles = useHtmlStyles()
  const { openBrowser } = useBrowser()
  const { getOrganizationLogoUrl } = useOrganizationsStore()
  const [error, setError] = useState(false)
  const [showConfirmedAlert, setShowConfirmedAlert] = useState(false)
  const [visible, setVisible] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [pdfUrl, setPdfUrl] = useState('')
  const [refetching, setRefetching] = useState(false)

  const [logConfirmedAction] = useDocumentConfirmActionsLazyQuery({
    fetchPolicy: 'no-cache',
  })

  const confirmAction = async (confirmed: boolean) => {
    // Adding a suffix '_app' to the id since the backend is currently not distinguishing between the app and the web
    await logConfirmedAction({
      variables: { input: { id: `${docId}_app`, confirmed: confirmed } },
    })
  }

  const refetchDocumentContent = async () => {
    setRefetching(true)
    try {
      const result = await docRes.refetch({
        input: { id: docId, includeDocument: true },
      })
      if (result.data?.documentV2?.alert) {
        setShowConfirmedAlert(true)
      }
    } finally {
      markDocumentAsRead()
      setRefetching(false)
    }
  }

  const showConfirmationAlert = (confirmation: DocumentV2Action) => {
    RNAlert.alert(confirmation.title ?? '', confirmation.data ?? '', [
      {
        text: intl.formatMessage({ id: 'inbox.markAllAsReadPromptCancel' }),
        style: 'cancel',
        onPress: async () => {
          await confirmAction(false)
          Navigation.pop(componentId)
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
  }

  // Check if we have the document in the cache
  const doc = useFragment_experimental<DocumentV2>({
    fragment: ListDocumentFragmentDoc,
    from: {
      __typename: 'DocumentV2',
      id: docId,
    },
    returnPartialData: true,
  })

  // We want to make sure we don't include the document content if isUrgent is undefined/null since then we don't have
  // the info from the server and don't want to make any assumptions about it just yet
  const shouldIncludeDocument = isUrgent === false

  // Fetch the document to get the content information
  const docRes = useGetDocumentQuery({
    variables: {
      input: {
        id: docId,
        // If the document is urgent we need to check if the user needs to confirm reception of it before fetching the document data
        includeDocument: shouldIncludeDocument,
      },
      locale: useLocale(),
    },
    fetchPolicy: 'no-cache',
    onCompleted: async (data) => {
      const confirmation = data.documentV2?.confirmation
      if (confirmation && !refetching) {
        showConfirmationAlert(confirmation)
      } else if (!confirmation && !refetching && !shouldIncludeDocument) {
        // If the user has already confirmed accepting the document we fetch the content
        refetchDocumentContent()
      }
    },
  })

  const Document = {
    ...(doc?.data || {}),
    ...(docRes.data?.documentV2 || {}),
  }

  const hasActions = !!Document.actions?.length
  const hasConfirmation = !!Document.confirmation
  const hasAlert =
    !!Document.alert && (Document.alert?.title || Document.alert?.data)
  const showAdditionalInfo =
    showConfirmedAlert ||
    (hasAlert && !hasConfirmation) ||
    (hasActions && !showConfirmedAlert && !hasConfirmation)

  const loading = docRes.loading
  const fileTypeLoaded = !!Document?.content?.type
  const hasError = error || docRes.error

  const hasPdf = Document?.content?.type.toLocaleLowerCase() === 'pdf'
  const isHtml =
    Document?.content?.type.toLocaleLowerCase() === 'html' &&
    Document.content?.value !== ''

  const onShare = () =>
    shareFile({
      document: Document as DocumentV2,
      type: hasPdf ? 'pdf' : isHtml ? 'html' : 'url',
      pdfUrl,
      content: !hasPdf ? Document.content?.value : undefined,
    })

  useConnectivityIndicator({
    componentId,
    rightButtons: getRightButtonsForDocumentDetail({
      archived: doc.data?.archived ?? false,
      bookmarked: doc.data?.bookmarked ?? false,
    }),
    extraData: [doc.data],
  })

  useNavigationButtonPress(({ buttonId }) => {
    if (buttonId === ButtonRegistry.DocumentArchiveButton) {
      toggleAction(Document.archived ? 'unarchive' : 'archive', Document.id!)
    }
    if (buttonId === ButtonRegistry.DocumentStarButton) {
      toggleAction(
        Document.bookmarked ? 'unbookmark' : 'bookmark',
        Document.id!,
      )
    }
    if (buttonId === ButtonRegistry.ShareButton && loaded) {
      onShare()
    }
  }, componentId)

  useNavigationComponentDidAppear(() => {
    setVisible(true)
  })

  const markDocumentAsRead = () => {
    if (Document.opened) {
      return
    }
    // Let's mark the document as read in the cache and decrease unreadCount if it is not 0
    client.cache.modify({
      id: client.cache.identify({
        __typename: 'DocumentV2',
        id: Document.id,
      }),
      fields: {
        opened: () => true,
      },
    })

    client.cache.modify({
      fields: {
        documentsV2: (existing) => {
          return {
            ...existing,
            unreadCount:
              existing.unreadCount > 0 ? existing.unreadCount - 1 : 0,
          }
        },
      },
    })
  }

  useEffect(() => {
    if (Document.opened || !shouldIncludeDocument) {
      return
    }
    markDocumentAsRead()
  }, [Document.id])

  const fadeAnim = useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    if (loaded) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start()
    }
  }, [loaded])

  return (
    <>
      <Host>
        <Header
          title={Document.sender?.name ?? ''}
          date={
            Document.publicationDate ? (
              <FormattedDate value={Document.publicationDate} />
            ) : undefined
          }
          message={Document.subject}
          isLoading={loading && !Document.subject}
          hasBorder={false}
          logo={getOrganizationLogoUrl(Document.sender?.name ?? '', 75)}
          label={isUrgent ? intl.formatMessage({ id: 'inbox.urgent' }) : ''}
        />
      </Host>
      {showAdditionalInfo && (
        <ActionsWrapper>
          {showConfirmedAlert && (
            <Alert
              type="success"
              hasBorder
              message={
                Document.alert?.title ?? Document.alert?.data ?? undefined
              }
            />
          )}
          {hasActions &&
            getButtonsForActions(
              openBrowser,
              onShare,
              componentId,
              Document.actions,
            )}
        </ActionsWrapper>
      )}
      <Border />
      <DocumentWrapper hasMarginTop={true}>
        <Animated.View
          style={{
            flex: 1,
            opacity: fadeAnim,
          }}
        >
          {fileTypeLoaded &&
            !error &&
            (isHtml ? (
              <WebView
                source={{
                  html: Document.content?.value
                    ? // Removing all <br /> tags to fix a bug in react-native that renders <br /> with too much vertical space
                      // https://github.com/facebook/react-native/issues/32062
                      `${htmlStyles}${Document.content?.value.replace(
                        regexForBr,
                        '',
                      )}`
                    : '',
                }}
                scalesPageToFit
                onLoadEnd={() => {
                  setLoaded(true)
                }}
              />
            ) : hasPdf ? (
              <PdfWrapper>
                {visible && (
                  <PdfViewer
                    url={`data:application/pdf;base64,${Document.content?.value}`}
                    subject={Document.subject}
                    senderName={Document.sender?.name}
                    onLoaded={(filePath: any) => {
                      setPdfUrl(filePath)
                      setLoaded(true)
                    }}
                    onError={() => {
                      setLoaded(true)
                      setError(true)
                    }}
                  />
                )}
              </PdfWrapper>
            ) : (
              <WebView
                source={{ uri: Document.content?.value ?? '' }}
                onLoadEnd={() => {
                  setLoaded(true)
                }}
                onError={() => {
                  setLoaded(true)
                  setError(true)
                }}
              />
            ))}
        </Animated.View>

        {(!loaded || hasError) && (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                justifyContent: 'center',

                maxHeight: 500,
              },
            ]}
          >
            {hasError ? (
              <Problem type="error" withContainer />
            ) : (
              <Loader
                text={intl.formatMessage({ id: 'documentDetail.loadingText' })}
              />
            )}
          </View>
        )}
      </DocumentWrapper>
    </>
  )
}

DocumentDetailScreen.options = getNavigationOptions
