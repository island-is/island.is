import { ReactNode } from 'react'
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  FetchResult,
  InMemoryCache,
  Observable,
} from '@apollo/client'
import { act, renderHook } from '@testing-library/react'
import { Attachment, useAttachmentList } from './useAttachmentList'

const uploaded: Attachment = { id: 'a1', filename: 'a.pdf', sizeBytes: 10 }

/**
 * A link that holds every list request until the test answers it with the
 * list DMR held when the request was sent. Deduplication is left at Apollo's
 * default (on), as in the application client.
 */
const setup = () => {
  let dmrList: Attachment[] = []
  const held: Array<() => void> = []
  const link = new ApolloLink(
    () =>
      new Observable<FetchResult>((observer) => {
        const snapshot = dmrList
        held.push(() => {
          observer.next({
            data: {
              directorateOfEqualityEqualityAttachments: snapshot.map((a) => ({
                __typename: 'DirectorateOfEqualityEqualityAttachment',
                ...a,
              })),
            },
          })
          observer.complete()
        })
      }),
  )
  const client = new ApolloClient({ link, cache: new InMemoryCache() })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ApolloProvider client={client}>{children}</ApolloProvider>
  )
  const { result } = renderHook(() => useAttachmentList('app-1'), { wrapper })
  return {
    result,
    held,
    register: () => {
      dmrList = [uploaded]
    },
  }
}

describe('useAttachmentList', () => {
  it('shows the file when the list read before registration answers first', async () => {
    const { result, held, register } = setup()

    let started!: Promise<void>
    let finished!: Promise<void>
    act(() => {
      started = result.current.reload() // queue step starts
    })
    register()
    act(() => {
      finished = result.current.reload() // queue step ends
    })
    expect(held).toHaveLength(2) // not joined to the first request

    await act(async () => {
      held[0]()
      await started
    })
    await act(async () => {
      held[1]()
      await finished
    })
    expect(result.current.attachments).toEqual([
      expect.objectContaining({ id: 'a1' }),
    ])
  })

  it('ignores the list read before registration when it answers last', async () => {
    const { result, held, register } = setup()

    let started!: Promise<void>
    let finished!: Promise<void>
    act(() => {
      started = result.current.reload()
    })
    register()
    act(() => {
      finished = result.current.reload()
    })

    await act(async () => {
      held[1]()
      await finished
    })
    await act(async () => {
      held[0]()
      await started
    })
    expect(result.current.attachments).toEqual([
      expect.objectContaining({ id: 'a1' }),
    ])
  })
})
