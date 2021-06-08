import { useQuery } from '@apollo/client'
import { dynamicColor, Header, Loader } from '@island.is/island-ui-native'
import React, { useEffect, useRef, useState } from 'react'
import { FormattedDate, useIntl } from 'react-intl'
import { Animated, Platform, Share, StyleSheet, View } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import {
  useNavigationButtonPress,
  useNavigationComponentDidAppear,
  useNavigationComponentDidDisappear,
} from 'react-native-navigation-hooks/dist'
import WebView from 'react-native-webview'
import PDFReader from 'rn-pdf-reader-js'
import styled from 'styled-components/native'
import { client } from '../../graphql/client'
import {
  GetDocumentResponse,
  GET_DOCUMENT_QUERY,
} from '../../graphql/queries/get-document.query'
import {
  ListDocumentsResponse,
  LIST_DOCUMENTS_QUERY,
} from '../../graphql/queries/list-documents.query'
import { useThemedNavigationOptions } from '../../hooks/use-themed-navigation-options'
import { authStore, useAuthStore } from '../../stores/auth-store'
import { inboxStore } from '../../stores/inbox-store'
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

const {
  useNavigationOptions,
  getNavigationOptions,
} = useThemedNavigationOptions(
  (theme, intl) => ({
    topBar: {
      title: {
        text: intl.formatMessage({ id: 'documentDetail.screenTitle' }),
      },
      noBorder: true,
    },
  }),
  {
    topBar: {
      noBorder: true,
      rightButtons: [
        {
          id: ButtonRegistry.ShareButton,
          icon: require('../../assets/icons/navbar-share.png'),
          accessibilityLabel: 'Share',
        },
      ],
    },
  },
)

export const DocumentDetailScreen: NavigationFunctionComponent<{
  docId: string
}> = ({ componentId, docId }) => {
  useNavigationOptions(componentId)
  const { getOrganizationLogoUrl } = useOrganizationsStore()
  const { authorizeResult } = useAuthStore()
  const intl = useIntl()

  const res = useQuery<ListDocumentsResponse>(LIST_DOCUMENTS_QUERY, {
    client,
  })
  const docRes = useQuery<GetDocumentResponse>(GET_DOCUMENT_QUERY, {
    client,
    variables: {
      input: {
        id: docId,
      },
    },
  })

  const Document = {
    ...(docRes.data?.getDocument || {}),
    ...(res.data?.listDocuments?.find((d) => d.id === docId) || {}),
  }

  const [visible, setVisible] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useNavigationButtonPress(
    (e) => {
      if (Platform.OS === 'android') {
        authStore.setState({ noLockScreenUntilNextAppStateActive: true })
      }
      Share.share(
        {
          title: Document.subject,
          url: `data:application/pdf;base64,${Document?.content!}`,
        },
        {
          subject: Document.subject,
        },
      )
    },
    componentId,
    ButtonRegistry.ShareButton,
  )

  useNavigationComponentDidAppear(() => {
    setVisible(true)
  })

  useNavigationComponentDidDisappear(() => {
    setVisible(false)
    setLoaded(false)
  })

  useEffect(() => {
    if (Document.id) {
      inboxStore.getState().actions.setRead(Document.id)
    }
  }, [res.data])

  const loading = res.loading

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
          title={Document.senderName}
          date={<FormattedDate value={Document.date} />}
          message={Document.subject}
          isLoading={loading}
          hasBorder={false}
          logo={getOrganizationLogoUrl(Document.senderName!, 75)}
        />
      </Host>
      <Border />
      <View
        style={{
          flex: 1,
        }}
      >
        {visible &&
          Platform.select({
            android: (
              <Animated.View
                style={{
                  flex: 1,
                  opacity: fadeAnim,
                }}
              >
                <PDFReader
                  onLoadEnd={() => {
                    setLoaded(true)
                  }}
                  source={{
                    base64: `data:application/pdf;base64,${Document.content!}`,
                  }}
                />
              </Animated.View>
            ),
            ios: (
              <Animated.View
                style={{
                  flex: 1,
                  opacity: fadeAnim,
                }}
              >
                <WebView
                  onLoadEnd={() => {
                    setLoaded(true)
                  }}
                  source={{
                    uri: Document.url!,
                    headers: {
                      'content-type': 'application/x-www-form-urlencoded',
                    },
                    body: `documentId=${Document.id}&__accessToken=${authorizeResult?.accessToken}`,
                    method: 'POST',
                  }}
                />
              </Animated.View>
            ),
          })}
        {!loaded && (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                alignItems: 'center',
                justifyContent: 'center',
                maxHeight: 300,
              },
            ]}
          >
            <Loader
              text={intl.formatMessage({ id: 'documentDetail.loadingText' })}
            />
          </View>
        )}
      </View>
    </>
  )
}

DocumentDetailScreen.options = getNavigationOptions
