import { useCallback, useEffect, useRef, useState } from 'react'
import { gql, useApolloClient } from '@apollo/client'

export const EQUALITY_ATTACHMENTS = gql`
  query DirectorateOfEqualityEqualityAttachments(
    $input: DirectorateOfEqualityEqualityAttachmentsInput!
  ) {
    directorateOfEqualityEqualityAttachments(input: $input) {
      id
      filename
      sizeBytes
    }
  }
`

export type Attachment = { id: string; filename: string; sizeBytes: number }

/**
 * The fylgiskjöl list as DMR holds it, reloaded on demand.
 *
 * Reloads overlap (one when a queue step starts, one when it ends), so each
 * request goes to the network on its own instead of joining one already in
 * flight (Apollo deduplicates by default, network-only included), and only
 * the most recently sent request's answer is shown. Otherwise a list read
 * before a file was registered could be the last word.
 */
export const useAttachmentList = (applicationId: string) => {
  const client = useApolloClient()
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [loadError, setLoadError] = useState(false)
  const mountedRef = useRef(true)
  const latestRequest = useRef(0)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const reload = useCallback(async () => {
    const request = ++latestRequest.current
    const isCurrent = () =>
      mountedRef.current && request === latestRequest.current
    try {
      const { data } = await client.query<{
        directorateOfEqualityEqualityAttachments: Attachment[] | null
      }>({
        query: EQUALITY_ATTACHMENTS,
        variables: { input: { applicationId } },
        fetchPolicy: 'network-only',
        context: { queryDeduplication: false },
      })
      // Nullable root query (domain convention); a failure arrives as an
      // error, so null only ever means nothing to show.
      if (isCurrent()) {
        setAttachments(data.directorateOfEqualityEqualityAttachments ?? [])
        setLoadError(false)
      }
    } catch {
      if (isCurrent()) setLoadError(true)
    }
  }, [client, applicationId])

  return { attachments, loadError, setLoadError, reload }
}
