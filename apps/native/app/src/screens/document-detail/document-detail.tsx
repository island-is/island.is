import { useQuery } from '@apollo/client'
import React, { useState } from 'react'
import { FormattedDate } from 'react-intl'
import { StyleSheet } from 'react-native'
import { ActivityIndicator } from 'react-native'
import { Platform, Share, View } from 'react-native'
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
import { useAuthStore } from '../../stores/auth-store'
import { ButtonRegistry } from '../../utils/component-registry'
import { useThemedNavigationOptions } from '../../utils/use-themed-navigation-options'

const Header = styled.SafeAreaView`
  margin-left: 16px;
  margin-right: 16px;
  margin-bottom: 16px;
  margin-top: 8px;
`

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 8px;
`

const Title = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  padding-right: 8px;
`

const TitleText = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 13px;
  line-height: 17px;
  color: ${(props) => props.theme.shade.foreground};
  flex: 1;
`

const Date = styled.View`
  flex-direction: row;
  align-items: center;
`

const DateText = styled.Text<{ unread?: boolean }>`
  font-family: ${(props) =>
    props.unread ? 'IBMPlexSans-SemiBold' : 'IBMPlexSans-Light'};
  font-size: 13px;
  line-height: 17px;
  color: ${(props) => props.theme.shade.foreground};
`

const Message = styled.Text`
  font-family: 'IBMPlexSans-Light';
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => props.theme.shade.foreground};
  padding-bottom: 8px;
`

const {
  useNavigationOptions,
  getNavigationOptions,
} = useThemedNavigationOptions(
  (theme, intl) => ({
    topBar: {
      background: {
        color: theme.shade.background,
      },
      barStyle: theme.isDark ? 'black' : 'default',
      title: {
        color: theme.shade.foreground,
        text: intl.formatMessage({ id: 'documentDetail.screenTitle' }),
      },
      noBorder: true,
    },
    layout: {
      backgroundColor: theme.shade.background,
      componentBackgroundColor: theme.shade.background,
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
  const { authorizeResult } = useAuthStore()

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
  const [loaded, setLoaded] = useState(false);

  useNavigationButtonPress(
    (e) => {
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

  if (!Document.id) {
    return null
  }

  return (
    <>
      <Header>
        <Row>
          <Title>
            <TitleText numberOfLines={1} ellipsizeMode="tail">
              {Document.senderName}
            </TitleText>
          </Title>
          <Date>
            <DateText>
              <FormattedDate value={Document.date} />
            </DateText>
          </Date>
        </Row>
        <Message>{Document.subject}</Message>
      </Header>
      <View
        style={{
          flex: 1,
        }}
      >
        {visible &&
          Platform.select({
            android: (
              <PDFReader
                onLoadEnd={() => {
                  setLoaded(true);
                }}
                style={{
                  opacity: loaded ? 1 : 0
                }}
                source={{
                  base64: `data:application/pdf;base64,${Document.content!}`,
                }}
              />
            ),
            ios: (
              <WebView
                onLoadEnd={() => {
                  setLoaded(true);
                }}
                style={{
                  opacity: loaded ? 1 : 0
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
            ),
          })}
          {!loaded && <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
            <ActivityIndicator size="large" />
          </View>}
      </View>
    </>
  )
}

DocumentDetailScreen.options = getNavigationOptions;
