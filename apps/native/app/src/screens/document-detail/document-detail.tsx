import { useApolloClient, useFragment_experimental } from '@apollo/client'
import React, { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  Animated,
  Alert as RNAlert,
  StyleSheet,
  View,
  SafeAreaView,
} from 'react-native'
import {
  Navigation,
  NavigationFunctionComponent,
  OptionsTopBarButton,
} from 'react-native-navigation'
import {
  useNavigationButtonPress,
  useNavigationComponentDidAppear,
} from 'react-native-navigation-hooks'
import WebView from 'react-native-webview'
import styled, { useTheme } from 'styled-components/native'

import { PdfViewer } from '../../components/pdf-viewer/pdf-viewer'
import { useFeatureFlag } from '../../contexts/feature-flag-provider'
import {
  DocumentV2,
  DocumentV2Action,
  ListDocumentFragmentDoc,
  useDocumentConfirmActionsLazyQuery,
  useGetDocumentQuery,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { useLocale } from '../../hooks/use-locale'
import { useNavigationModal } from '../../hooks/use-navigation-modal'
import { toggleAction } from '../../lib/post-mail-action'
import { useBrowser } from '../../lib/use-browser'
import { useOrganizationsStore } from '../../stores/organizations-store'
import {
  Alert,
  Button,
  Header,
  Loader,
  Problem,
  blue400,
  dynamicColor,
} from '../../ui'
import {
  ButtonRegistry,
  ComponentRegistry,
} from '../../utils/component-registry'
import { ListParams } from '../inbox/inbox'
import { ButtonDrawer } from './components/button-drawer'
import { getButtonsForActions } from './utils/get-buttons-for-actions'
import { shareFile } from './utils/share-file'
import { DocumentReplyInfo, DocumentReplyScreenProps } from './document-reply'
import { DocumentCommunicationsScreenProps } from './document-communications'

const Host = styled.SafeAreaView`
  margin-left: ${({ theme }) => theme.spacing[2]}px;
  margin-right: ${({ theme }) => theme.spacing[2]}px;
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

const PdfWrapper = styled.View`
  flex: 1;
  background-color: ${dynamicColor('background')};
`

const DocumentWrapper = styled.View`
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
    (_theme, intl) => ({
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

export const DocumentDetailScreen: NavigationFunctionComponent<{
  docId: string
  isUrgent?: boolean
  listParams: ListParams
}> = ({ componentId, docId, isUrgent, listParams }) => {
  useNavigationOptions(componentId)

  const { showModal } = useNavigationModal()
  const client = useApolloClient()
  const intl = useIntl()
  const htmlStyles = useHtmlStyles()
  const { openBrowser } = useBrowser()
  const { getOrganizationLogoUrl } = useOrganizationsStore()
  const isFeature2WayMailboxEnabled = useFeatureFlag(
    'is2WayMailboxEnabled',
    false,
  )

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

  const Document: Partial<DocumentV2> = {
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
    if (buttonId === ButtonRegistry.DocumentArchiveButton && Document.id) {
      toggleAction(Document.archived ? 'unarchive' : 'archive', Document.id)
    }
    if (buttonId === ButtonRegistry.DocumentStarButton && Document.id) {
      toggleAction(Document.bookmarked ? 'unbookmark' : 'bookmark', Document.id)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Document.id])

  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (loaded) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start()
    }
  }, [loaded, fadeAnim])

  /**
   * Navigate to the document reply modal.
   * It will pass the first reply info down so that the document communications screen can show the first reply info.
   */
  const onFirstReplyPress = () => {
    const senderName = Document.sender?.name

    if (!senderName) {
      return
    }

    const passProps: DocumentReplyScreenProps = {
      senderName,
      documentId: docId,
      subject: Document.subject ?? '',
      isFirstReply: true,
      onReplySuccess(info) {
        docRes.refetch()
        onCommunicationsPress(info)
      },
    }

    showModal(ComponentRegistry.DocumentReplyScreen, {
      passProps,
    })
  }

  /**
   * Navigate to the document communications modal.
   */
  const onCommunicationsPress = (reply?: DocumentReplyInfo) => {
    const passProps: DocumentCommunicationsScreenProps = {
      documentId: docId,
      ticketId: Document.ticket?.id ?? undefined,
      firstReplyInfo: reply,
    }

    Navigation.push(componentId, {
      component: {
        name: ComponentRegistry.DocumentCommunicationsScreen,
        passProps,
        options: {
          topBar: {
            title: {
              text: Document.subject,
            },
          },
        },
      },
    })
  }

  const isReplyable = Document.replyable ?? false
  const hasComments = Document?.ticket?.comments?.length ?? null

  return (
    <>
      <Host>
        <Header
          title={Document.sender?.name ?? ''}
          date={Document.publicationDate ?? undefined}
          category={listParams?.category?.name}
          message={Document.subject}
          isLoading={loading && !Document.subject}
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
      <DocumentWrapper>
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
                    subject={Document.subject ?? ''}
                    senderName={Document.sender?.name ?? ''}
                    onLoaded={(filePath) => {
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
                  ? require('../../assets/icons/chatbubbles.png')
                  : require('../../assets/icons/reply.png')
              }
              onPress={() => {
                if (hasComments) {
                  onCommunicationsPress()
                } else {
                  onFirstReplyPress()
                }
              }}
            />
          </SafeAreaView>
        </ButtonDrawer>
      )}
    </>
  )
}

DocumentDetailScreen.options = getNavigationOptions
