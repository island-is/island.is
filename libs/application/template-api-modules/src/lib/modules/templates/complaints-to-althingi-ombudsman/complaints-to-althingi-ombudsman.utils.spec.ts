import { DocumentInfo } from '@island.is/clients/althingi-ombudsman'
import {
  cleanFileName,
  cleanFileNames,
} from './complaints-to-althingi-ombudsman.utils'

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

describe('cleanFileNames', () => {
  it('should return DocmentInfo array with clean file names', () => {
    const filesBefore = [
      {
        fileName: '6f1a9b87-7c89-4e5d-a0bf_file1.pdf',
        type: 'test',
        subject: 'test file',
        content: '',
      },
      {
        fileName: '9a3c2f4d-1b6e-4987-8d2a_file2.pdf',
        type: 'test',
        subject: 'test file',
        content: '',
      },
      {
        fileName: '5c7d8a12-3f56-4721-b9e0_file3.pdf',
        type: 'test',
        subject: 'test file',
        content: '',
      },
      {
        fileName: '3e9b5a67-8d14-43c9-b726_file4.pdf',
        type: 'test',
        subject: 'test file',
        content: '',
      },
    ] as DocumentInfo[]

    const filesAfter = [
      {
        fileName: 'file1.pdf',
        type: 'test',
        subject: 'test file',
        content: '',
      },
      {
        fileName: 'file2.pdf',
        type: 'test',
        subject: 'test file',
        content: '',
      },
      {
        fileName: 'file3.pdf',
        type: 'test',
        subject: 'test file',
        content: '',
      },
      {
        fileName: 'file4.pdf',
        type: 'test',
        subject: 'test file',
        content: '',
      },
    ] as DocumentInfo[]

    expect(cleanFileNames(filesBefore)).toStrictEqual(filesAfter)
  })
})
