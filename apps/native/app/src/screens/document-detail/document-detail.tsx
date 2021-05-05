import React from 'react'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { useQuery } from '@apollo/client'
import {
  GetDocumentResponse,
  GET_DOCUMENT_QUERY,
} from '../../graphql/queries/get-document.query'
import { client } from '../../graphql/client'
import PDFReader from 'rn-pdf-reader-js'
import styled from 'styled-components/native'
import { FormattedDate } from 'react-intl'
import { Button } from '@island.is/island-ui-native'
import { Share } from 'react-native'
import { ListDocumentsResponse, LIST_DOCUMENTS_QUERY } from '../../graphql/queries/list-documents.query'
import WebView from 'react-native-webview'
import { authStore } from '../../stores/auth-store'
import { useState } from 'react'
import { useNavigationComponentDidAppear, useNavigationComponentDidDisappear } from 'react-native-navigation-hooks/dist'

const Header = styled.View`
  margin-left: 16px;
  margin-right: 16px;
  margin-bottom: 16px;
  margin-top: 8px;
`;

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
  font-size: 12px;
  line-height: 16px;
  color: ${(props) => props.theme.color.dark400};
  flex: 1;
`

const Date = styled.View`
  flex-direction: row;
  align-items: center;
`

const DateText = styled.Text<{ unread?: boolean }>`
  font-family: ${(props) =>
    props.unread ? 'IBMPlexSans-SemiBold' : 'IBMPlexSans-Light'};
  font-size: 12px;
  line-height: 16px;
  color: ${(props) => props.theme.color.dark400};
`


const Message = styled.Text`
  font-family: 'IBMPlexSans-Light';
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => props.theme.color.dark400};
  padding-bottom: 8px;
`;

const Bottom = styled.View`
  position: absolute;
  bottom: 32px;
  left: 0;
  right: 0;
  align-items: center;
`;

export const DocumentDetailScreen: NavigationFunctionComponent = (
  props: any,
) => {
  const res = useQuery<ListDocumentsResponse>(LIST_DOCUMENTS_QUERY, {
    client,
  })
  const docRes = useQuery<ListDocumentsResponse>(GET_DOCUMENT_QUERY, {
    client,
  })
  const Document = res.data?.listDocuments?.find(d => d.id === props.docId);
  const [visible, setVisible] = useState(false);

  useNavigationComponentDidAppear(() => {
    setVisible(true);
  })

  useNavigationComponentDidDisappear(() =>{
    setVisible(false);
  })


  if (!Document) {
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
      {visible && <WebView
        source={{
          uri: Document.url,
          headers:{
            'content-type': 'application/x-www-form-urlencoded',
          },
          body: `documentId=${Document.id}&token=${authStore.getState().authorizeResult?.accessToken}`,
          method: 'POST'
        }}
      />}
      {/* <PDFReader
        source={{
          base64: `data:application/pdf;base64,${res.data?.Document?.content!}`,
        }}
      /> */}
      <Bottom pointerEvents="box-none">
        <Button title="Vista eða Senda" onPress={() => {
          Share.share({ title: Document.subject, url: `data:application/pdf;base64,${Document?.content!}` }, {
            subject: Document.subject
          })
        }} />
      </Bottom>
    </>
  )
}

DocumentDetailScreen.options = {
  topBar: {
    visible: true,
    title: {
      text: 'Rafrænt skjal',
    },
    rightButtons: [],
  },
}
