import { act, render } from '@testing-library/react'
import {
  getAttachmentQueue,
  runAttachmentUploads,
  useAttachmentQueue,
} from './attachmentQueue'

const file = (name: string) => new File(['x'], name)

const deferred = () => {
  let resolve!: (value: string | undefined) => void
  const promise = new Promise<string | undefined>((r) => {
    resolve = r
  })
  return { promise, resolve }
}

const Field = ({
  applicationId,
  seen,
}: {
  applicationId: string
  seen: Array<string | undefined>
}) => {
  const { uploading } = useAttachmentQueue(applicationId)
  seen.push(uploading)
  return null
}

describe('attachment queue', () => {
  // The regression: back navigation unmounted the field mid-queue, and the
  // files after the one in flight were never uploaded.
  it('uploads every file with no field mounted', async () => {
    const first = deferred()
    const uploaded: string[] = []
    const uploadOne = (f: File) => {
      uploaded.push(f.name)
      return f.name === 'a.pdf' ? first.promise : Promise.resolve(undefined)
    }

    const { unmount } = render(<Field applicationId="app-1" seen={[]} />)
    const run = runAttachmentUploads(
      'app-1',
      [file('a.pdf'), file('b.pdf')],
      uploadOne,
    )
    unmount()

    first.resolve(undefined)
    await run
    expect(uploaded).toEqual(['a.pdf', 'b.pdf'])
    expect(getAttachmentQueue('app-1').uploading).toBeUndefined()
  })

  it('a field mounted mid-queue sees it busy and follows it to the end', async () => {
    const first = deferred()
    const second = deferred()
    const pending = [first, second]
    const run = runAttachmentUploads(
      'app-2',
      [file('a.pdf'), file('b.pdf')],
      () => (pending.shift() as ReturnType<typeof deferred>).promise,
    )

    const seen: Array<string | undefined> = []
    render(<Field applicationId="app-2" seen={seen} />)
    expect(seen[seen.length - 1]).toBe('a.pdf')

    await act(async () => first.resolve(undefined))
    expect(seen[seen.length - 1]).toBe('b.pdf')

    await act(async () => {
      second.resolve('b.pdf failed')
      await run
    })
    expect(seen[seen.length - 1]).toBeUndefined()
    expect(getAttachmentQueue('app-2').errors).toEqual(['b.pdf failed'])
  })

  it('keeps one application apart from another', () => {
    void runAttachmentUploads(
      'app-3',
      [file('a.pdf')],
      () => deferred().promise,
    )
    expect(getAttachmentQueue('app-3').uploading).toBe('a.pdf')
    expect(getAttachmentQueue('app-4').uploading).toBeUndefined()
  })
})
