import { useApolloClient, useFragment_experimental } from '@apollo/client'
import * as FileSystem from 'expo-file-system'
import { useEffect, useMemo, useState } from 'react'
import { useTheme } from 'styled-components/native'

import {
  DocumentV2,
  ListDocumentFragmentDoc,
  useGetDocumentQuery,
} from '@/graphql/types/schema'
import { useLocale } from '@/hooks/use-locale'

const BR_REGEX = /<br\s*\/>/gi

export type ContentType = 'pdf' | 'html' | 'url' | null

export function useDocument(id: string) {
  const client = useApolloClient()
  const locale = useLocale()
  const [pdfUri, setPdfUri] = useState<string | null>(null)
  const [pdfError, setPdfError] = useState(false)

  // Cached fragment from inbox list (instant, partial data for header)
  const cached = useFragment_experimental<DocumentV2>({
    fragment: ListDocumentFragmentDoc,
    from: { __typename: 'DocumentV2', id },
    returnPartialData: true,
  })

  // Full document query
  const query = useGetDocumentQuery({
    variables: { input: { id, includeDocument: true }, locale },
    fetchPolicy: 'no-cache',
  })

  // Merge cache + query, preferring cache for user-toggled fields
  const document = useMemo<Partial<DocumentV2>>(() => {
    const fromCache: any = cached?.data ?? {}
    const fromQuery: any = query.data?.documentV2 ?? {}
    return {
      ...fromCache,
      ...fromQuery,
      bookmarked: fromCache.bookmarked ?? fromQuery.bookmarked,
      archived: fromCache.archived ?? fromQuery.archived,
      opened: fromCache.opened ?? fromQuery.opened,
    }
  }, [cached?.data, query.data])

  // Content type
  const contentType = useMemo<ContentType>(() => {
    const raw = document.content?.type?.toLowerCase() ?? ''
    if (raw.includes('pdf')) return 'pdf'
    if (raw.includes('html')) return 'html'
    if (raw) return 'url'
    return null
  }, [document.content?.type])

  const htmlSource = useHtmlSource(
    contentType === 'html' ? document.content?.value : null,
  )

  // Write PDF to disk
  useEffect(() => {
    if (contentType !== 'pdf' || !document.content?.value) return
    try {
      const cacheDir = new FileSystem.Directory(FileSystem.Paths.cache)
      const file = new FileSystem.File(cacheDir, `doc-${id}.pdf`)
      if (!file.exists) {
        file.write(document.content.value, { encoding: 'base64' })
      }
      setPdfUri(file.uri)
    } catch (e) {
      console.error('Failed to cache PDF', e)
      setPdfError(true)
    }
  }, [contentType, document.content?.value, id])

  // Mark as read (once, on first load)
  useEffect(() => {
    if (!document.id || document.opened) return
    client.cache.modify({
      id: client.cache.identify({ __typename: 'DocumentV2', id: document.id }),
      fields: { opened: () => true },
    })
    client.cache.modify({
      fields: {
        documentsV2: (existing) => ({
          ...existing,
          unreadCount: Math.max(0, (existing.unreadCount ?? 1) - 1),
        }),
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document.id])

  const loading = query.loading
  const error = !!query.error || pdfError

  // Content is ready to render
  const ready =
    contentType === 'pdf'
      ? !!pdfUri
      : contentType != null && !!document.content?.value

  return { document, contentType, pdfUri, loading, error, ready, htmlSource }
}

export function useHtmlSource(value: string | undefined | null) {
  const theme = useTheme()
  return useMemo(() => {
    if (!value) return null
    const styles = `<style>
      body { font-family: "IBM Plex Sans", San Francisco, Segoe UI, sans-serif; margin: ${theme.spacing[3]}px; }
      h1, h2, h3 { color: ${theme.color.blue400}; }
      h1 { font-size: 32px; line-height: 38px; }
      h2 { font-size: 26px; line-height: 32px; }
      h3 { font-size: 20px; line-height: 26px; }
      p { color: ${theme.color.blue400}; font-size: 16px; line-height: 24px; }
      a { color: ${theme.color.blue400}; text-decoration: none; }
      svg, img { max-width: 100%; display: block; }
    </style>
    <meta name="viewport" content="width=device-width">`
    return { html: `${styles}${value.replace(BR_REGEX, '')}` }
  }, [value, theme])
}
