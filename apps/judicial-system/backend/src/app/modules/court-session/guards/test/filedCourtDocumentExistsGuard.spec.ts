import { v4 as uuid } from 'uuid'

import {
  BadRequestException,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common'

import { CourtDocument, CourtSession } from '../../../repository'
import { FiledCourtDocumentExistsGuard } from '../filedCourtDocumentExists.guard'

describe('Filed Court Document Exists Guard', () => {
  const guard = new FiledCourtDocumentExistsGuard()

  const givenWhenThen = (request: unknown) => {
    const then = {} as { result: boolean; error: Error }

    try {
      then.result = guard.canActivate({
        switchToHttp: () => ({ getRequest: () => request }),
      } as unknown as ExecutionContext)
    } catch (error) {
      then.error = error as Error
    }

    return then
  }

  it('should pass the filed court document on to the handler', () => {
    const courtDocument = { id: uuid() } as CourtDocument
    const request = {
      courtSession: { filedDocuments: [courtDocument] } as CourtSession,
      params: { courtDocumentId: courtDocument.id },
    }

    const then = givenWhenThen(request)

    expect(then.result).toBe(true)
    expect(request).toHaveProperty('courtDocument', courtDocument)
  })

  // A document copied from a merged case is filed like any other, so the
  // court session carries it among its filed documents and nowhere else.
  it('should find a document copied from a merged case', () => {
    const courtDocument = {
      id: uuid(),
      mergedFromCaseId: uuid(),
    } as CourtDocument
    const request = {
      courtSession: {
        filedDocuments: [{ id: uuid() } as CourtDocument, courtDocument],
      } as CourtSession,
      params: { courtDocumentId: courtDocument.id },
    }

    const then = givenWhenThen(request)

    expect(then.result).toBe(true)
    expect(request).toHaveProperty('courtDocument', courtDocument)
  })

  it('should not find a document that is not filed in the court session', () => {
    const courtSessionId = uuid()
    const courtDocumentId = uuid()
    const request = {
      courtSession: {
        id: courtSessionId,
        filedDocuments: [{ id: uuid() } as CourtDocument],
      } as CourtSession,
      params: { courtDocumentId },
    }

    const then = givenWhenThen(request)

    expect(then.error).toBeInstanceOf(NotFoundException)
    expect(then.error.message).toBe(
      `Court document ${courtDocumentId} of court session ${courtSessionId} does not exist`,
    )
  })

  it('should require a court session', () => {
    const then = givenWhenThen({ params: { courtDocumentId: uuid() } })

    expect(then.error).toBeInstanceOf(BadRequestException)
    expect(then.error.message).toBe('Missing court session')
  })

  it('should require a court document id', () => {
    const then = givenWhenThen({
      courtSession: {} as CourtSession,
      params: {},
    })

    expect(then.error).toBeInstanceOf(BadRequestException)
    expect(then.error.message).toBe('Missing court document id')
  })
})
