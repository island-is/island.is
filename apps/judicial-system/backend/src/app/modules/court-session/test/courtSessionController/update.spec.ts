import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException, NotFoundException } from '@nestjs/common'

import {
  addMessagesToQueue,
  MessageType,
} from '@island.is/judicial-system/message'
import {
  CaseFileCategory,
  CourtSessionRulingType,
} from '@island.is/judicial-system/types'

import { createTestingCourtSessionModule } from '../createTestingCourtSessionModule'

import {
  Case,
  CaseFile,
  CourtSession,
  CourtSessionRepositoryService,
} from '../../../repository'
import { UpdateCourtSessionDto } from '../../dto/updateCourtSession.dto'

jest.mock('@island.is/judicial-system/message', () => ({
  ...jest.requireActual('@island.is/judicial-system/message'),
  addMessagesToQueue: jest.fn(),
}))

interface Then {
  result: CourtSession | null
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  courtSessionId: string,
  courtSessionToUpdate: UpdateCourtSessionDto,
) => Promise<Then>

describe('CourtSessionController - Update', () => {
  const caseId = uuid()
  const courtSessionId = uuid()
  const location = 'Updated Location'
  const attendees = 'Updated Attendees'
  const courtSessionToUpdate = { location, attendees }

  let mockCourtSessionRepositoryService: CourtSessionRepositoryService
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  let existingCourtSession: {
    id: string
    isConfirmed: boolean | undefined
    rulingType?: CourtSessionRulingType
    rulingFileId?: string | null
  }
  let caseFiles: Partial<CaseFile>[]

  beforeEach(async () => {
    const { sequelize, courtSessionRepositoryService, courtSessionController } =
      await createTestingCourtSessionModule()

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    mockCourtSessionRepositoryService = courtSessionRepositoryService
    const mockUpdate = mockCourtSessionRepositoryService.update as jest.Mock
    mockUpdate.mockRejectedValue(new Error('Failed to updaet court session'))

    existingCourtSession = { id: courtSessionId, isConfirmed: undefined }
    caseFiles = []

    givenWhenThen = async (
      caseId: string,
      courtSessionId: string,
      courtSessionToUpdate: UpdateCourtSessionDto,
    ) => {
      const then = {} as Then
      const theCase = { id: caseId, caseFiles } as unknown as Case
      const user = {} as never

      try {
        then.result = await courtSessionController.update(
          caseId,
          courtSessionId,
          courtSessionToUpdate,
          user,
          theCase,
          existingCourtSession as unknown as CourtSession,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('court session updated', () => {
    const updatedCourtSession = {
      id: courtSessionId,
      caseId,
      location,
      attendees,
    }
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockCourtSessionRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce(updatedCourtSession)

      then = await givenWhenThen(caseId, courtSessionId, courtSessionToUpdate)
    })

    it('should update the court session', () => {
      expect(mockCourtSessionRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        courtSessionId,
        courtSessionToUpdate,
        { transaction },
      )
      expect(then.result).toBe(updatedCourtSession)
    })
  })

  describe('court session update fails', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, courtSessionId, courtSessionToUpdate)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Failed to updaet court session')
    })
  })

  describe('court session is confirmed for the first time', () => {
    const confirmationUpdate = {
      ...courtSessionToUpdate,
      isConfirmed: true,
    }

    beforeEach(async () => {
      existingCourtSession.isConfirmed = undefined

      const mockUpdate = mockCourtSessionRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce({
        id: courtSessionId,
        isConfirmed: true,
        caseId,
      })

      await givenWhenThen(caseId, courtSessionId, confirmationUpdate)
    })

    it('should add a working document delivery message to the queue', () => {
      expect(addMessagesToQueue).toHaveBeenCalledWith({
        type: MessageType.DELIVERY_TO_COURT_COURT_RECORD_WORKING_DOCUMENT,
        user: {},
        caseId,
      })
    })
  })

  describe('court session is updated', () => {
    const confirmationUpdate = {
      ...courtSessionToUpdate,
      isConfirmed: true,
    }

    beforeEach(async () => {
      existingCourtSession.isConfirmed = false

      const mockUpdate = mockCourtSessionRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce({
        id: courtSessionId,
        isConfirmed: true,
        caseId,
      })

      await givenWhenThen(caseId, courtSessionId, confirmationUpdate)
    })

    it('should add a working document delivery message to the queue', () => {
      expect(addMessagesToQueue).toHaveBeenCalledWith({
        type: MessageType.DELIVERY_TO_COURT_COURT_RECORD_WORKING_DOCUMENT,
        user: {},
        caseId,
      })
    })
  })

  describe('court session was already confirmed', () => {
    const confirmationUpdate = {
      ...courtSessionToUpdate,
      isConfirmed: true,
    }

    beforeEach(async () => {
      existingCourtSession.isConfirmed = true

      const mockUpdate = mockCourtSessionRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce({ id: courtSessionId, caseId })

      await givenWhenThen(caseId, courtSessionId, confirmationUpdate)
    })

    it('should not add a message to the queue', () => {
      expect(addMessagesToQueue).not.toHaveBeenCalled()
    })
  })

  describe('court session update does not include confirmation', () => {
    beforeEach(async () => {
      existingCourtSession.isConfirmed = undefined

      const mockUpdate = mockCourtSessionRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce({ id: courtSessionId, caseId })

      await givenWhenThen(caseId, courtSessionId, courtSessionToUpdate)
    })

    it('should not add a message to the queue', () => {
      expect(addMessagesToQueue).not.toHaveBeenCalled()
    })
  })

  describe('ruling type changes away from ORDER', () => {
    const fileId = uuid()
    const switchAwayUpdate = {
      rulingType: CourtSessionRulingType.JUDGEMENT,
    }

    beforeEach(async () => {
      existingCourtSession.rulingType = CourtSessionRulingType.ORDER
      existingCourtSession.rulingFileId = fileId

      const mockUpdate = mockCourtSessionRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce({
        id: courtSessionId,
        caseId,
        rulingType: CourtSessionRulingType.JUDGEMENT,
      })

      await givenWhenThen(caseId, courtSessionId, switchAwayUpdate)
    })

    it('should auto-clear the ruling file', () => {
      expect(mockCourtSessionRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        courtSessionId,
        { rulingType: CourtSessionRulingType.JUDGEMENT, rulingFileId: null },
        { transaction },
      )
    })
  })

  describe('ruling file set while ruling type is not ORDER', () => {
    const fileId = uuid()
    let then: Then

    beforeEach(async () => {
      existingCourtSession.rulingType = CourtSessionRulingType.NONE

      then = await givenWhenThen(caseId, courtSessionId, {
        rulingFileId: fileId,
      })
    })

    it('should reject with BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(mockCourtSessionRepositoryService.update).not.toHaveBeenCalled()
    })
  })

  describe('ruling file not in the case', () => {
    const fileId = uuid()
    let then: Then

    beforeEach(async () => {
      existingCourtSession.rulingType = CourtSessionRulingType.ORDER
      caseFiles = []

      then = await givenWhenThen(caseId, courtSessionId, {
        rulingFileId: fileId,
      })
    })

    it('should reject with NotFoundException', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(mockCourtSessionRepositoryService.update).not.toHaveBeenCalled()
    })
  })

  describe('ruling file has the wrong category', () => {
    const fileId = uuid()
    let then: Then

    beforeEach(async () => {
      existingCourtSession.rulingType = CourtSessionRulingType.ORDER
      caseFiles = [{ id: fileId, category: CaseFileCategory.RULING }]

      then = await givenWhenThen(caseId, courtSessionId, {
        rulingFileId: fileId,
      })
    })

    it('should reject with BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(mockCourtSessionRepositoryService.update).not.toHaveBeenCalled()
    })
  })

  describe('valid ruling file selection', () => {
    const fileId = uuid()

    beforeEach(async () => {
      existingCourtSession.rulingType = CourtSessionRulingType.ORDER
      caseFiles = [
        {
          id: fileId,
          category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
        },
      ]

      const mockUpdate = mockCourtSessionRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce({
        id: courtSessionId,
        caseId,
        rulingFileId: fileId,
      })

      await givenWhenThen(caseId, courtSessionId, { rulingFileId: fileId })
    })

    it('should persist the ruling file link', () => {
      expect(mockCourtSessionRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        courtSessionId,
        { rulingFileId: fileId },
        { transaction },
      )
    })
  })

  describe('confirming ORDER session without a ruling file', () => {
    let then: Then

    beforeEach(async () => {
      existingCourtSession.rulingType = CourtSessionRulingType.ORDER
      existingCourtSession.isConfirmed = false
      existingCourtSession.rulingFileId = undefined

      then = await givenWhenThen(caseId, courtSessionId, { isConfirmed: true })
    })

    it('should reject with BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(mockCourtSessionRepositoryService.update).not.toHaveBeenCalled()
    })
  })
})
