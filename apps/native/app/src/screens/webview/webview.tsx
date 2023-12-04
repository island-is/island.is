import React from 'react'
import WebView, { WebViewProps } from 'react-native-webview'

interface WebviewScreenProps {
  source: WebViewProps['source']
}

export function WebViewScreen({ source }: WebviewScreenProps) {
  return <WebView source={source} style={{ flex: 1 }} />
}
