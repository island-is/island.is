import { PersonalTaxReturnApi } from '@island.is/clients/rsk/personal-tax-return'
import { User } from '@island.is/financial-aid/shared/lib'
import { FileService } from '../../file/file.service'
import { Base64 } from 'js-base64'
import { PersonalTaxReturnResponse } from '../models/personalTaxReturn.response'
import { createTestingPersonalTaxReturnModule } from './createTestingPersonalTaxReturnModule'
import fetch from 'isomorphic-fetch'
import { uuid } from 'uuidv4'

interface Then {
  result: PersonalTaxReturnResponse
  error: Error
}

jest.mock('isomorphic-fetch')

type GivenWhenThen = (user: User) => Promise<Then>

describe('PersonalTaxReturnController - Municipalities Personal Tax Return', () => {
  let givenWhenThen: GivenWhenThen
  let mockFileService: FileService
  let mockPersonalTaxReturnApi: PersonalTaxReturnApi

  const folderId = uuid()

  beforeEach(async () => {
    const { personalTaxReturnController, fileService, personalTaxReturnApi } =
      await createTestingPersonalTaxReturnModule()

    mockFileService = fileService
    mockPersonalTaxReturnApi = personalTaxReturnApi

    givenWhenThen = async (user: User): Promise<Then> => {
      const then = {} as Then

      await personalTaxReturnController
        .municipalitiesPersonalTaxReturn(folderId, user)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('Personal Tax Return Api fails', () => {
    const user = { nationalId: '0', folder: '', name: '' } as User
    let personalTaxReturnInPdf: jest.Mock
    let createSignedUrl: jest.Mock
    let then: Then

    beforeEach(async () => {
      personalTaxReturnInPdf =
        mockPersonalTaxReturnApi.personalTaxReturnInPdf as jest.Mock
      personalTaxReturnInPdf.mockRejectedValueOnce({})

      createSignedUrl = mockFileService.createSignedUrl as jest.Mock

      then = await givenWhenThen(user)
    })

    it('should call personal tax return api twice', () => {
      expect(personalTaxReturnInPdf).toBeCalledTimes(2)
    })

    it('should call personal tax return api with last year', () => {
      const lastYear = new Date().getFullYear() - 1
      expect(personalTaxReturnInPdf).toHaveBeenCalledWith(
        user.nationalId,
        lastYear,
      )
    })

    it('should call personal tax return api with year as two years ago', () => {
      const twoYearsAgo = new Date().getFullYear() - 2
      expect(personalTaxReturnInPdf).toHaveBeenCalledWith(
        user.nationalId,
        twoYearsAgo,
      )
    })

    it('should not call file service', () => {
      expect(createSignedUrl).not.toHaveBeenCalled()
    })

    it('should return undefined', () => {
      expect(then.result.personalTaxReturn).toBeUndefined()
    })
  })

  describe('Personal Tax Return Api succeeds', () => {
    const user = { nationalId: '0', name: '' } as User
    let personalTaxReturnInPdf: jest.Mock
    let createSignedUrl: jest.Mock
    let mockFetch: jest.Mock
    let then: Then
    const content = Base64.btoa('bla')
    const lastYear = new Date().getFullYear() - 1
    const signedUrl = {
      url: 'test',
      key: 'key',
    }

    beforeEach(async () => {
      personalTaxReturnInPdf =
        mockPersonalTaxReturnApi.personalTaxReturnInPdf as jest.Mock
      personalTaxReturnInPdf.mockResolvedValueOnce({
        success: true,
        errorText: '',
        content: content,
      })

      createSignedUrl = mockFileService.createSignedUrl as jest.Mock
      createSignedUrl.mockReturnValueOnce(signedUrl)

      mockFetch = fetch as jest.Mock
      mockFetch.mockResolvedValueOnce({})

      then = await givenWhenThen(user)
    })

    it('should call personal tax return api once', () => {
      expect(personalTaxReturnInPdf).toBeCalledTimes(1)
    })

    it('should call personal tax return api with last year', () => {
      expect(personalTaxReturnInPdf).toHaveBeenCalledWith(
        user.nationalId,
        lastYear,
      )
    })

    it('should call file service with correct params', () => {
      expect(createSignedUrl).toHaveBeenCalledWith(
        folderId,
        `Framtal_${user.nationalId}_${lastYear}.pdf`,
      )
    })

    it('should call fetch with correct params', () => {
      expect(fetch).toHaveBeenCalledWith(signedUrl.url, {
        method: 'PUT',
        body: Buffer.from(Base64.atob(content), 'binary'),
        headers: {
          'x-amz-acl': 'bucket-owner-full-control',
          'Content-Type': 'application/pdf',
          'Content-Length': Base64.atob(content).length.toString(),
        },
      })
    })

    it('should return correct values', () => {
      expect(then.result).toEqual({
        personalTaxReturn: {
          key: signedUrl.key,
          name: `Framtal_${user.nationalId}_${lastYear}.pdf`,
          size: Base64.atob(content).length,
        },
      })
    })
  })

  describe('Fetch fails', () => {
    const user = { nationalId: '0', folder: '', name: '' } as User
    let personalTaxReturnInPdf: jest.Mock
    let createSignedUrl: jest.Mock
    let mockFetch: jest.Mock
    let then: Then
    const content = Base64.btoa('bla')
    const lastYear = new Date().getFullYear() - 1
    const signedUrl = {
      url: 'test',
      key: 'key',
    }

    beforeEach(async () => {
      personalTaxReturnInPdf =
        mockPersonalTaxReturnApi.personalTaxReturnInPdf as jest.Mock
      personalTaxReturnInPdf.mockResolvedValueOnce({
        success: true,
        errorText: '',
        content: content,
      })

      createSignedUrl = mockFileService.createSignedUrl as jest.Mock
      createSignedUrl.mockReturnValueOnce(signedUrl)

      mockFetch = fetch as jest.Mock
      mockFetch.mockImplementationOnce(() => {
        throw new Error('error')
      })

      then = await givenWhenThen(user)
    })

    it('should call personal tax return api once', () => {
      expect(personalTaxReturnInPdf).toBeCalledTimes(1)
    })

    it('should call personal tax return api with last year', () => {
      expect(personalTaxReturnInPdf).toHaveBeenCalledWith(
        user.nationalId,
        lastYear,
      )
    })

    it('should call file service with correct params', () => {
      expect(createSignedUrl).toHaveBeenCalledWith(
        folderId,
        `Framtal_${user.nationalId}_${lastYear}.pdf`,
      )
    })

    it('should call fetch with correct params', () => {
      expect(fetch).toHaveBeenCalledWith(signedUrl.url, {
        method: 'PUT',
        body: Buffer.from(Base64.atob(content), 'binary'),
        headers: {
          'x-amz-acl': 'bucket-owner-full-control',
          'Content-Type': 'application/pdf',
          'Content-Length': Base64.atob(content).length.toString(),
        },
      })
    })

    it('should return undefined', () => {
      expect(then.result.personalTaxReturn).toBeUndefined()
    })
  })
})
