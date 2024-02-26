import { cleanFileName } from './complaints-to-althingi-ombudsman.utils'

describe('cleanFileName', () => {
  it('should return string with only file name and file type ending', () => {
    const fileNameBefore = '2d080ee3-2364-4b32-ac4d_file.pdf'
    const fileNameAfter = 'file.pdf'
    expect(cleanFileName(fileNameBefore)).toBe(fileNameAfter)
  })
})

describe('cleanFileName', () => {
  it('should return original string when no delimiter is present', () => {
    const fileNameBefore = '2d080ee3-2364-4b32-ac4d-file.pdf'
    const fileNameAfter = '2d080ee3-2364-4b32-ac4d-file.pdf'
    expect(cleanFileName(fileNameBefore)).toBe(fileNameAfter)
  })
})
