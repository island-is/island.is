import React from 'react'
import { SafeAreaView, View, Text } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { useQuery } from '@apollo/client'
import {
  GetDocumentResponse,
  GET_DOCUMENT_QUERY,
} from '../../graphql/queries/get-document.query'
import { client } from '../../graphql/client'
import PDFReader from 'rn-pdf-reader-js'


export const DocumentDetailScreen: NavigationFunctionComponent = (
  props: any,
) => {
  const res = useQuery<GetDocumentResponse>(GET_DOCUMENT_QUERY, {
    variables: {
      id: props.docId,
    },
    client,
  });

  const Document = res.data?.Document;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {Document && (
        <>
        <View style={{ padding: 32 }}>
          <Text style={{ fontSize: 19 }}>{Document.subject}</Text>
          <Text>Frá: {Document.senderName}</Text>
          <Text>Dags.: {Document.date}</Text>
        </View>
        <PDFReader
          source={{
            base64: `data:application/pdf;base64,${res.data?.Document?.content!}`,
          }}
        />
        </>
      )}
    </SafeAreaView>
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
