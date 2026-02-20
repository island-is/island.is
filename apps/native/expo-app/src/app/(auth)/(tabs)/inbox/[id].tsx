import { useApolloClient } from '@apollo/client'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { Text, View } from 'react-native'

import { useGetDocumentQuery } from '@/graphql/types/schema'
import { useLocale } from '@/hooks/use-locale'
import * as FileSystem from 'expo-file-system'
import { authStore } from '../../../../stores/auth-store'
import { PdfView } from '@kishannareshpal/expo-pdf'
import WebView from 'react-native-webview'

function useDocument(id: string) {
  const docRes = useGetDocumentQuery({
    variables: {
      input: {
        id,
        includeDocument: true,
      },
      locale: useLocale(),
    },
    fetchPolicy: 'no-cache',
  })
  const [contentLoading, setContentLoading] = useState(false)
  const content = docRes.data?.documentV2?.content

  const type = useMemo(() => {
    const contentType = content?.type?.toLowerCase() ?? ''
    if (contentType.includes('pdf')) {
      return 'pdf'
    }
    if (contentType.includes('html')) {
      return 'html'
    }
    return contentType
  }, [content])

  const cacheDir = useMemo(
    () => new FileSystem.Directory(FileSystem.Paths.cache),
    [],
  )
  const localFile = useMemo(
    () => new FileSystem.File(cacheDir.uri, `doc-${id}.pdf`),
    [cacheDir, id],
  )

  useEffect(() => {
    // @todo migration - check if file already exists, and load from that instead.
    const writeContent = async () => {
      if (!content?.value) return
      if (!content?.type?.includes('PDF')) return
      setContentLoading(true)
      try {
        if (!localFile.exists) {
          localFile.write(content?.value ?? '', { encoding: 'base64' })
        }
      } catch (e) {
        console.error('Error downloading document', e)
      }
      setContentLoading(false)
    }
    writeContent()
  }, [content, type])

  if (localFile.exists) {
    return {
      loading: false,
      type: 'pdf',
      url: localFile.uri,
    }
  }

  if (type === 'html') {
    return {
      loading: false,
      type: 'html',
      url: content?.value,
    }
  }

  return {
    loading: true,
    type,
  }
}

export default function DocumentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const client = useApolloClient()
  const intl = useIntl()
  const doc = useDocument(id)
  console.log(doc)
  return (
    <View style={{ flex: 1 }}>
      {doc.loading ? (
        <Text>Loading...</Text>
      ) : doc.type === 'pdf' ? (
        <PdfView uri={doc.url ?? ''} style={{ flex: 1 }} />
      ) : (
        <WebView source={{ uri: doc.url ?? '' }} style={{ flex: 1 }} />
      )}
    </View>
  )
}
