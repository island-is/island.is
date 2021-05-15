import { useQuery } from '@apollo/client'
import { Button } from '@island.is/island-ui-native'
import React, { useState } from 'react'
import { FormattedDate } from 'react-intl'
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
import { authStore } from '../../stores/auth-store'
import { ButtonRegistry } from '../../utils/component-registry'
import { createNavigationTitle } from '../../utils/create-navigation-title'

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

const Bottom = styled.View`
  position: absolute;
  bottom: 32px;
  left: 0;
  right: 0;
  align-items: center;
`

const { title, useNavigationTitle } = createNavigationTitle(
  'documentDetail.screenTitle',
)

export const DocumentDetailScreen: NavigationFunctionComponent<{
  docId: string
}> = ({ componentId, docId }) => {
  useNavigationTitle(componentId)

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

  useNavigationButtonPress((e) => {
    Share.share(
      {
        title: Document.subject,
        url: `data:application/pdf;base64,${Document?.content!}`,
      },
      {
        subject: Document.subject,
      },
    )
  }, componentId, ButtonRegistry.ShareButton);

  useNavigationComponentDidAppear(() => {
    setVisible(true)
  })

  useNavigationComponentDidDisappear(() => {
    setVisible(false)
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
                source={{
                  base64: `data:application/pdf;base64,${Document.content!}`,
                }}
              />
            ),
            ios: (
              <WebView
                source={{
                  uri: Document.url!,
                  headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                  },
                  body: `documentId=${Document.id}&token=${
                    authStore.getState().authorizeResult?.accessToken
                  }`,
                  method: 'POST',
                }}
              />
            ),
          })}
      </View>
    </>
  )
}

DocumentDetailScreen.options = {
  topBar: {
    visible: true,
    title,
    rightButtons: [{
      id: ButtonRegistry.ShareButton,
      icon: require('../../assets/icons/navbar-share.png'),
      accessibilityLabel: 'Share',
    }],
  },
}
