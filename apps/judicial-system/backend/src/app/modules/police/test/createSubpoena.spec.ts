import fetch from 'node-fetch'
import { v4 as uuid } from 'uuid'

import { PayloadTooLargeException } from '@nestjs/common'

import { User } from '@island.is/judicial-system/types'

import { createTestingPoliceModule } from './createTestingPoliceModule'

import { Case, Defendant } from '../../repository'

jest.mock('node-fetch')

interface Then {
  result?: { policeSubpoenaId: string }
  error?: Error
}

describe('PoliceService - Create Subpoena', () => {
  const user = { id: uuid(), name: 'Test User' } as User
  const caseId = uuid()
  const policeCaseNumber = '007-2026-012345'
  const prosecutor = {
    name: 'Prosecutor One',
    email: 'prosecutor@omnitrix.is',
    nationalId: '0000000000',
  }
  const theCase = {
    id: caseId,
    courtCaseNumber: 'R-1/2026',
    policeCaseNumbers: [policeCaseNumber],
    prosecutor,
    dateLogs: [],
    court: { address: 'Dómhúsið' },
  } as unknown as Case
  const defendant = {
    id: uuid(),
    nationalId: '1111111111',
  } as unknown as Defendant

  describe('file is too large for the police system', () => {
    let mockEmailService: { sendEmail: jest.Mock }
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as unknown as jest.Mock
      mockFetch.mockReset()
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 413,
        text: jest.fn().mockResolvedValueOnce('Payload Too Large'),
      })

      const { policeService, emailService, caseRepositoryService } =
        await createTestingPoliceModule()
      mockEmailService = emailService as unknown as { sendEmail: jest.Mock }

      const mockFindByIdWithProsecutor =
        caseRepositoryService.findByIdWithProsecutor as jest.Mock
      mockFindByIdWithProsecutor.mockResolvedValueOnce({
        prosecutor,
        policeCaseNumbers: [policeCaseNumber],
      })

      then = await policeService
        .createSubpoena({
          theCase,
          defendant,
          subpoenaId: uuid(),
          subpoena: 'subpoena-pdf',
          indictment: 'indictment-pdf',
          user,
          civilClaims: [],
        })
        .then((result) => ({ result } as Then))
        .catch((error) => ({ error } as Then))
    })

    it('should notify the prosecutor', () => {
      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ name: prosecutor.name, address: prosecutor.email }],
          subject: `Ekki tókst að hlaða upp skjali í LÖKE í máli ${policeCaseNumber}`,
          text: 'Ekki tókst að hlaða upp skjali í LÖKE vegna stærðartakmarkana. Vinsamlegast hlaðið skjali upp handvirkt í LÖKE.',
        }),
      )
    })

    it('should throw a payload too large exception', () => {
      expect(then.result).toBeUndefined()
      expect(then.error).toBeInstanceOf(PayloadTooLargeException)
    })
  })
})
