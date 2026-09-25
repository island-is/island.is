import { resolveLocalFilePreview } from './index'

describe('resolveLocalFilePreview', () => {
  it('returns unavailable when originalFileObj is missing', () => {
    expect(resolveLocalFilePreview({})).toEqual({ action: 'unavailable' })
    expect(resolveLocalFilePreview({ originalFileObj: undefined })).toEqual({
      action: 'unavailable',
    })
  })

  it('returns the blob when originalFileObj is present', () => {
    const blob = new Blob(['pdf'], { type: 'application/pdf' })

    expect(resolveLocalFilePreview({ originalFileObj: blob })).toEqual({
      action: 'createObjectURL',
      blob,
    })
  })
})
