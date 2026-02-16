import { Stack } from 'expo-router'
import { useRouter } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'
import { PdfView } from '@kishannareshpal/expo-pdf';
import { Directory, File, Paths } from 'expo-file-system'
import { cloneElement, useEffect, useMemo, useState } from 'react'

function useRemoteFile(url: string) {
  const [localPath, setLocalPath] = useState<string | null>(null)

  useEffect(() => {
    const downloadFile = async () => {
      try {
        const file = await File.downloadFileAsync(
          url,
          new Directory(Paths.document),
          { idempotent: true },
        )
        setLocalPath(file.uri)
      } catch (error) {
        console.error('Error downloading file:', error)
      }
    }
    downloadFile()
  }, [url])

  return localPath
}

export default function DocumentScreen(props: { id: string }) {
  const router = useRouter()
  const localFile = useRemoteFile(
    'http://bashupload.app/172ot0.pdf',
  )

  return (
    <>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button
          icon="chevron.left"
          onPress={() => router.back()}
        />
      </Stack.Toolbar>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button icon="chevron.up" disabled />
        <Stack.Toolbar.Button icon="chevron.down" />
      </Stack.Toolbar>
      <Stack.Toolbar>
        <Stack.Toolbar.Button icon="star" onPress={() => {}} />
        <Stack.Toolbar.Button icon="tray" onPress={() => {}} />
        <Stack.Toolbar.Button icon="square.and.arrow.up" onPress={() => {}} />
        <Stack.Toolbar.Spacer />
        <Stack.Toolbar.Button
          icon="square.and.pencil"
          onPress={() => alert('Right button pressed!')}
        />
      </Stack.Toolbar>
      {localFile ? <PdfView uri={localFile} style={{flex:1}} /> : <Text>Loading...</Text>}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
})
