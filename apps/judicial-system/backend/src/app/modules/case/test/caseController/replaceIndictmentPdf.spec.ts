import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException, ForbiddenException } from '@nestjs/common'

import {
  CaseState,
  CaseType,
  InstitutionType,
  type User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { Case } from '../../../repository'
import * as replacement from '../../indictmentPdfReplacement'
import { PdfService } from '../../pdf.service'

jest.mock('../../indictmentPdfReplacement', () => {
  const actual = jest.requireActual('../../indictmentPdfReplacement')
  return { ...actual, canReplaceIndictmentPdf: jest.fn() }
})

describe('CaseController - Replace indictment pdf', () => {
  const caseId = uuid()
  const theCase = {
    id: caseId,
    type: CaseType.INDICTMENT,
    state: CaseState.SUBMITTED,
  } as Case
  const user = {
    role: UserRole.PROSECUTOR,
    institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
  } as User
  const key = `${caseId}/${uuid()}/Ákæra.pdf`
  const mockCanReplace = replacement.canReplaceIndictmentPdf as jest.Mock

  let pdfService: PdfService
  let replace: (key: string) => Promise<unknown>

  beforeEach(async () => {
    const {
      caseController,
      sequelize,
      pdfService: service,
    } = await createTestingCaseModule()
    pdfService = service
    ;(sequelize.transaction as jest.Mock).mockImplementation(
      (fn: (transaction: Transaction) => unknown) => fn({} as Transaction),
    )
    jest.spyOn(pdfService, 'replaceIndictmentPdf').mockResolvedValue()
    mockCanReplace.mockImplementation(
      jest.requireActual('../../indictmentPdfReplacement')
        .canReplaceIndictmentPdf,
    )

    replace = (uploadKey: string) =>
      caseController.replaceIndictmentPdf(caseId, theCase, user, {
        key: uploadKey,
      })
  })

  afterEach(() => jest.restoreAllMocks())

  it('refuses a case that has not been granted it', async () => {
    await expect(replace(key)).rejects.toBeInstanceOf(ForbiddenException)
    expect(pdfService.replaceIndictmentPdf).not.toHaveBeenCalled()
  })

  describe('when the case has been granted it', () => {
    beforeEach(() => {
      mockCanReplace.mockReturnValue(true)
    })

    it('replaces the indictment', async () => {
      await expect(replace(key)).resolves.toEqual({ success: true })
      expect(mockCanReplace).toHaveBeenCalledWith(theCase, user)
      expect(pdfService.replaceIndictmentPdf).toHaveBeenCalledWith(
        theCase,
        key,
        expect.anything(),
      )
    })

    it("refuses a key outside the case's own uploads", async () => {
      await expect(replace(`${uuid()}/${uuid()}/x.pdf`)).rejects.toBeInstanceOf(
        BadRequestException,
      )
      expect(pdfService.replaceIndictmentPdf).not.toHaveBeenCalled()
    })
  })
})
