import { useApolloClient, useFragment_experimental } from '@apollo/client'
import { blue400, dynamicColor, Header, Loader } from '@ui'
import { Problem } from '@ui/lib/problem/problem'
import React, { useEffect, useRef, useState } from 'react'
import { FormattedDate, useIntl } from 'react-intl'
import { Animated, Platform, StyleSheet, View } from 'react-native'
import {
  NavigationFunctionComponent,
  OptionsTopBarButton,
} from 'react-native-navigation'
import {
  useNavigationButtonPress,
  useNavigationComponentDidAppear,
} from 'react-native-navigation-hooks/dist'
import Pdf, { Source } from 'react-native-pdf'
import Share from 'react-native-share'
import WebView from 'react-native-webview'
import styled, { useTheme } from 'styled-components/native'
import {
  DocumentV2,
  ListDocumentFragmentDoc,
  useGetDocumentQuery,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { toggleAction } from '../../lib/post-mail-action'
import { authStore } from '../../stores/auth-store'
import { useOrganizationsStore } from '../../stores/organizations-store'
import { ButtonRegistry } from '../../utils/component-registry'

const Host = styled.SafeAreaView`
  margin-left: 24px;
  margin-right: 24px;
`

const Border = styled.View`
  height: 1px;
  background-color: ${dynamicColor((props) => ({
    dark: props.theme.shades.dark.shade200,
    light: props.theme.color.blue100,
  }))};
`

const PdfWrapper = styled.View`
  flex: 1;
  background-color: ${dynamicColor('background')};
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
  body: string
  onLoaded: (path: string) => void
  onError: (err: Error) => void
}

const PdfViewer = React.memo(
  ({ url, body, onLoaded, onError }: PdfViewerProps) => {
    const extraProps = {
      activityIndicatorProps: {
        color: '#0061ff',
        progressTintColor: '#ccdfff',
      },
    }

    return (
      <Pdf
        source={
          {
            uri: url,
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            body,
            method: 'POST',
          } as Source
        }
        onLoadComplete={(_, filePath) => {
          onLoaded?.(filePath)
        }}
        onError={(err) => {
          onError?.(err as Error)
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
    if (prevProps.url === nextProps.url && prevProps.body === nextProps.body) {
      return true
    }
    return false
  },
)

export const DocumentDetailScreen: NavigationFunctionComponent<{
  docId: string
}> = ({ componentId, docId }) => {
  useNavigationOptions(componentId)

  const client = useApolloClient()
  const intl = useIntl()
  const htmlStyles = useHtmlStyles()
  const { getOrganizationLogoUrl } = useOrganizationsStore()
  const [accessToken, setAccessToken] = useState<string>()
  const [error, setError] = useState(false)

  // Check if we have the document in the cache
  const doc = useFragment_experimental<DocumentV2>({
    fragment: ListDocumentFragmentDoc,
    from: {
      __typename: 'DocumentV2',
      id: docId,
    },
    returnPartialData: true,
  })

  // Fetch the document to get the content information
  const docRes = useGetDocumentQuery({
    variables: {
      input: {
        id: docId,
      },
    },
    fetchPolicy: 'no-cache',
  })

  const Document = {
    ...(doc?.data || {}),
    ...(docRes.data?.documentV2 || {}),
  }

  const [visible, setVisible] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [pdfUrl, setPdfUrl] = useState('')

  const loading = docRes.loading || !accessToken
  const fileTypeLoaded = !!Document?.content?.type
  const hasError = error || docRes.error

  const hasPdf = Document?.content?.type.toLocaleLowerCase() === 'pdf'
  const isHtml =
    Document?.content?.type.toLocaleLowerCase() === 'html' &&
    Document.content?.value !== ''

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
      if (Platform.OS === 'android') {
        authStore.setState({ noLockScreenUntilNextAppStateActive: true })
      }
      Share.open({
        title: Document.subject!,
        subject: Document.subject!,
        message: `${Document.sender!.name!} \n ${Document.subject!}`,
        type: hasPdf ? 'application/pdf' : undefined,
        url: hasPdf ? `file://${pdfUrl}` : Document.downloadUrl!,
      })
    }
  }, componentId)

  useNavigationComponentDidAppear(() => {
    setVisible(true)
  })

  useEffect(() => {
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
  }, [Document.id])

  useEffect(() => {
    const { authorizeResult, refresh } = authStore.getState()
    const isExpired =
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      new Date(authorizeResult?.accessTokenExpirationDate ?? 0).getTime() <
      Date.now()
    if (isExpired) {
      refresh().then(() => {
        setAccessToken(authStore.getState().authorizeResult?.accessToken)
      })
    } else {
      setAccessToken(authorizeResult?.accessToken)
    }
  }, [])

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
        />
      </Host>
      <Border />
      <View
        style={{
          flex: 1,
        }}
      >
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
                {visible && accessToken && (
                  <PdfViewer
                    url={`data:application/pdf;base64,${Document.content?.value}`}
                    body={`documentId=${Document.id}&__accessToken=${accessToken}`}
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

        {(!loaded || !accessToken || hasError) && (
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
      </View>
    </>
  )
}

DocumentDetailScreen.options = getNavigationOptions
