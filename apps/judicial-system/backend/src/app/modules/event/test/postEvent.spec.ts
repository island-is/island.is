import fetch from 'isomorphic-fetch'
import { v4 as uuid } from 'uuid'

import type { Logger } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'

import {
  AppealCaseTransition,
  CaseType,
} from '@island.is/judicial-system/types'

import { Case } from '../../repository'
import { eventModuleConfig } from '../event.config'
import { EventService } from '../event.service'

jest.mock('isomorphic-fetch')

describe('EventService - postEvent', () => {
  const caseId = uuid()
  // A case with both a ruling appeal and a verdict appeal, each with its own
  // number in the court of appeals.
  const theCase = {
    id: caseId,
    type: CaseType.INDICTMENT,
    policeCaseNumbers: ['007-2026-1'],
    indictmentSubtypes: {},
    appealCase: { appealCaseNumber: '10/2026' },
    verdictAppealCase: { appealCaseNumber: '20/2026' },
  } as unknown as Case

  let eventService: EventService

  beforeEach(() => {
    jest.clearAllMocks()

    const mockFetch = fetch as jest.Mock
    mockFetch.mockResolvedValue({ ok: true })

    eventService = new EventService(
      { url: 'https://events.dummy.dd' } as ConfigType<
        typeof eventModuleConfig
      >,
      {
        debug: jest.fn(),
        info: jest.fn(),
        error: jest.fn(),
      } as unknown as Logger,
    )
  })

  const postedText = (): string => {
    const mockFetch = fetch as jest.Mock
    const body = JSON.parse(mockFetch.mock.calls[0][1].body)

    return body.blocks[0].text.text
  }

  describe('a completed verdict appeal', () => {
    beforeEach(async () => {
      await eventService.postEvent('COMPLETE_VERDICT_APPEAL', theCase)
    })

    it('should be announced as an áfrýjun', () => {
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(postedText()).toMatch(/^\*:white_check_mark: Áfrýjun lokið\*/)
      expect(postedText()).not.toContain('Kæru lokið')
    })

    it('should print the number of the verdict appeal, not of the ruling appeal', () => {
      expect(postedText()).toContain('>Landsréttur *20/2026*')
      expect(postedText()).not.toContain('10/2026')
    })
  })

  it('should print no number for a verdict appeal without one', async () => {
    await eventService.postEvent('COMPLETE_VERDICT_APPEAL', {
      ...theCase,
      verdictAppealCase: { appealCaseNumber: undefined },
    } as unknown as Case)

    expect(postedText()).not.toContain('Landsréttur')
    expect(postedText()).not.toContain('10/2026')
  })

  describe('a completed ruling appeal', () => {
    beforeEach(async () => {
      await eventService.postEvent(
        AppealCaseTransition.COMPLETE_APPEAL,
        theCase,
      )
    })

    it('should be announced as a kæra', () => {
      expect(postedText()).toMatch(/^\*:white_check_mark: Kæru lokið\*/)
    })

    it('should print the number of the ruling appeal', () => {
      expect(postedText()).toContain('>Landsréttur *10/2026*')
      expect(postedText()).not.toContain('20/2026')
    })
  })
})
