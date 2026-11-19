import { uploadToS3 } from './s3Upload'

let request: XMLHttpRequest

beforeEach(() => {
  request = new XMLHttpRequest()
  jest.spyOn(global, 'XMLHttpRequest').mockImplementation(() => request)
  jest.spyOn(request, 'send').mockImplementation(() => undefined)
})

afterEach(() => jest.restoreAllMocks())

const startUpload = () =>
  uploadToS3(
    { url: 'https://upload.example.com', fields: { key: 'file' } },
    { name: 'file.pdf', originalFileObj: new File(['test'], 'file.pdf') },
    jest.fn(),
  )

it.each(['error', 'abort', 'timeout'])(
  'rejects a request-level %s even without an upload-side error',
  async (event) => {
    const result = startUpload()
    const rejection = expect(result).rejects.toThrow(
      'Failed to upload file to S3',
    )
    expect(Number.isFinite(request.timeout) && request.timeout > 0).toBe(true)
    request.dispatchEvent(new ProgressEvent(event, { lengthComputable: false }))
    await rejection
  },
)

it.each([204, 500])(
  'settles a completed request with status %s',
  async (status) => {
    jest.spyOn(request, 'status', 'get').mockReturnValue(status)
    const result = startUpload()
    request.dispatchEvent(new ProgressEvent('load'))
    if (status === 204) {
      await expect(result).resolves.toEqual(
        expect.objectContaining({ name: 'file.pdf' }),
      )
    } else {
      await expect(result).rejects.toThrow('Failed to upload file to S3')
    }
  },
)
