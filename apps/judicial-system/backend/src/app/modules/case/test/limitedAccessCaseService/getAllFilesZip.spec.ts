import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import {
  CaseFileCategory,
  CaseState,
  CaseType,
  DefendantEventType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { FileService } from '../../../file'
import {
  Case,
  CaseFile,
  Defendant,
  DefendantEventLog,
  Subpoena,
} from '../../../repository'
import { LimitedAccessCaseService } from '../../limitedAccessCase.service'
import { PdfService } from '../../pdf.service'

const defenderNationalId = '0101010101'
const pdfBuffer = Buffer.from('pdf')

const makeDefendant = (overrides: Partial<Defendant> = {}): Defendant =>
  ({
    id: uuid(),
    name: 'Defendant',
    isDefenderChoiceConfirmed: true,
    caseFilesSharedWithDefender: true,
    defenderNationalId,
    eventLogs: [],
    subpoenas: [],
    policeCaseNumbers: ['007-2026-1'],
    ...overrides,
  } as Defendant)

const makeEventLog = (
  eventType: DefendantEventType,
  created: Date,
): DefendantEventLog => ({ eventType, created } as unknown as DefendantEventLog)

const makeIndictmentCase = (overrides: Partial<Case> = {}): Case =>
  ({
    id: uuid(),
    type: CaseType.INDICTMENT,
    state: CaseState.SUBMITTED,
    defendants: [makeDefendant()],
    civilClaimants: [],
    caseFiles: [],
    policeCaseNumbers: ['007-2026-1'],
    withCourtSessions: true,
    courtSessions: [{ isConfirmed: true }],
    ...overrides,
  } as Case)

describe('LimitedAccessCaseService - getAllFilesZip', () => {
  let limitedAccessCaseService: LimitedAccessCaseService
  let mockPdfService: PdfService
  let mockFileService: FileService
  let transaction: Transaction
  let zipFilesSpy: jest.SpyInstance

  const user = {
    nationalId: defenderNationalId,
    role: UserRole.DEFENDER,
  } as User

  beforeEach(async () => {
    const { limitedAccessCaseService: service, fileService } =
      await createTestingCaseModule()

    limitedAccessCaseService = service
    mockFileService = fileService
    mockPdfService = (
      limitedAccessCaseService as unknown as { pdfService: PdfService }
    ).pdfService
    transaction = {} as Transaction

    zipFilesSpy = jest
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .spyOn(limitedAccessCaseService as any, 'zipFiles')
      .mockResolvedValue(Buffer.from('zip'))

    jest.spyOn(mockPdfService, 'getIndictmentPdf').mockResolvedValue(pdfBuffer)
    jest
      .spyOn(mockPdfService, 'getCaseFilesRecordPdf')
      .mockResolvedValue(pdfBuffer)
    jest.spyOn(mockPdfService, 'getSubpoenaPdf').mockResolvedValue(pdfBuffer)
    jest
      .spyOn(mockPdfService, 'getCourtRecordPdfForIndictmentCase')
      .mockResolvedValue(pdfBuffer)
    jest
      .spyOn(mockFileService, 'getCaseFileFromS3')
      .mockResolvedValue(pdfBuffer)
  })

  afterEach(() => {
    zipFilesSpy.mockRestore()
    jest.restoreAllMocks()
  })

  describe('subpoenas', () => {
    it('should only generate subpoena pdfs for defendants the defender is confirmed for', async () => {
      const subpoenaForDefendant = { id: uuid() } as Subpoena
      const subpoenaForOtherDefendant = { id: uuid() } as Subpoena
      const representedDefendant = makeDefendant({
        id: 'defendant-1',
        name: 'Defendant One',
        subpoenas: [subpoenaForDefendant],
      })
      const otherDefendant = makeDefendant({
        id: 'defendant-2',
        name: 'Defendant Two',
        defenderNationalId: '0202020202',
        subpoenas: [subpoenaForOtherDefendant],
      })
      const theCase = makeIndictmentCase({
        defendants: [representedDefendant, otherDefendant],
      })

      await limitedAccessCaseService.getAllFilesZip(theCase, user, transaction)

      expect(mockPdfService.getSubpoenaPdf).toHaveBeenCalledTimes(1)
      expect(mockPdfService.getSubpoenaPdf).toHaveBeenCalledWith(
        theCase,
        representedDefendant,
        transaction,
        subpoenaForDefendant,
      )
    })
  })

  describe('generated court record', () => {
    it('should not generate court record pdf when withCourtSessions is false', async () => {
      const theCase = makeIndictmentCase({
        withCourtSessions: false,
        courtSessions: [{ isConfirmed: true }],
      })

      await limitedAccessCaseService.getAllFilesZip(theCase, user, transaction)

      expect(
        mockPdfService.getCourtRecordPdfForIndictmentCase,
      ).not.toHaveBeenCalled()
    })

    it('should not generate court record pdf when all represented defendants are dismissed', async () => {
      const dismissedAt = new Date('2024-01-10')
      const theCase = makeIndictmentCase({
        defendants: [
          makeDefendant({
            eventLogs: [
              makeEventLog(
                DefendantEventType.INDICTMENT_DISMISSED,
                dismissedAt,
              ),
            ],
          }),
        ],
      })

      await limitedAccessCaseService.getAllFilesZip(theCase, user, transaction)

      expect(
        mockPdfService.getCourtRecordPdfForIndictmentCase,
      ).not.toHaveBeenCalled()
    })

    it('should generate court record pdf when court sessions are confirmed and no uploaded court record exists', async () => {
      const theCase = makeIndictmentCase({
        withCourtSessions: true,
        courtSessions: [{ isConfirmed: true }],
        caseFiles: [],
      })

      await limitedAccessCaseService.getAllFilesZip(theCase, user, transaction)

      expect(
        mockPdfService.getCourtRecordPdfForIndictmentCase,
      ).toHaveBeenCalledWith(theCase, user, transaction)
    })
  })

  describe('ruling orders', () => {
    const makeRulingOrder = (overrides: Partial<CaseFile> = {}): CaseFile =>
      ({
        id: uuid(),
        name: 'S-1/2026 Úrskurður 12.11.2026',
        category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
        key: `${uuid()}/${uuid()}/ruling.pdf`,
        isKeyAccessible: true,
        ...overrides,
      } as CaseFile)

    it('should skip a ruling order that was pronounced orally and not yet written up', async () => {
      const pronouncedOrally = makeRulingOrder({
        isPronouncedOrally: true,
        key: '',
      })
      const theCase = makeIndictmentCase({
        caseFiles: [pronouncedOrally],
        courtSessions: [
          { isConfirmed: true, rulingFileId: pronouncedOrally.id },
        ] as Case['courtSessions'],
      })

      await limitedAccessCaseService.getAllFilesZip(theCase, user, transaction)

      expect(mockFileService.getCaseFileFromS3).not.toHaveBeenCalled()
    })

    it('should include a ruling order that was pronounced orally once it has been written up', async () => {
      const writtenUp = makeRulingOrder({ isPronouncedOrally: true })
      const theCase = makeIndictmentCase({
        caseFiles: [writtenUp],
        courtSessions: [
          { isConfirmed: true, rulingFileId: writtenUp.id },
        ] as Case['courtSessions'],
      })

      await limitedAccessCaseService.getAllFilesZip(theCase, user, transaction)

      expect(mockFileService.getCaseFileFromS3).toHaveBeenCalledWith(
        theCase,
        writtenUp,
      )
    })
  })
})
