import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import WebView from 'react-native-webview'

export default function WebViewScreen() {
  const { url } = useLocalSearchParams<{ url: string }>()

  return <WebView source={{ uri: url }} style={{ flex: 1 }} />
}
