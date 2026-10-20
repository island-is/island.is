import { v4 as uuid } from 'uuid'

import {
  CaseOrigin,
  CaseType,
  DataGroups,
  EventType,
  InstitutionType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingStatisticsModule } from '../createTestingStatisticsModule'

import { AwsS3Service } from '../../../aws-s3'
import {
  Case,
  CaseRepositoryService,
  EventLog,
  InstitutionRepositoryService,
} from '../../../repository'
import { CaseDataExportDto } from '../../statistics/caseDataExport.dto'

interface Then {
  result: { url: string }
  error: Error
}

type GivenWhenThen = (query: CaseDataExportDto) => Promise<Then>

// The file name's yyyy-MM-dd is formatted in local time; noon UTC keeps it
// the same in any zone from UTC-11 to UTC+11
const fromDate = new Date('2026-03-01T12:00:00.000Z')
const toDate = new Date('2026-03-31T12:00:00.000Z')
const beforePeriod = new Date('2026-02-15T12:00:00.000Z')
const inPeriod = new Date('2026-03-15T12:00:00.000Z')
const afterPeriod = new Date('2026-04-15T12:00:00.000Z')

// A case whose only derivable events are its creation and, optionally, the
// event log given - enough to tell which events the period keeps.
const makeCase = (
  type: CaseType,
  created: Date,
  eventLogs: Partial<EventLog>[] = [],
): Case =>
  ({
    id: uuid(),
    type,
    created,
    origin: CaseOrigin.RVG,
    eventLogs,
    defendants: [],
  } as unknown as Case)

// The CSV's data rows, with the header dropped; the first column is the case id
// and the second the event descriptor.
const rowsOf = (csv: string) =>
  csv
    .trim()
    .split('\n')
    .slice(1)
    .map((row) => row.split(',').slice(0, 2))

describe('StatisticsController - Export case event data', () => {
  const user = { id: uuid(), nationalId: '0101302399' } as User
  const url = `https://s3.example/${uuid()}`

  let mockLogger: { error: jest.Mock }
  let mockAwsS3Service: jest.Mocked<AwsS3Service>
  let mockCaseRepositoryService: jest.Mocked<CaseRepositoryService>
  let mockInstitutionRepositoryService: jest.Mocked<InstitutionRepositoryService>
  let givenWhenThen: GivenWhenThen

  const uploadedCsv = () =>
    mockAwsS3Service.uploadCsvToS3.mock.calls[0][1] as string

  beforeEach(async () => {
    const {
      logger,
      awsS3Service,
      caseRepositoryService,
      institutionRepositoryService,
      statisticsController,
    } = await createTestingStatisticsModule()

    mockLogger = logger
    mockAwsS3Service = awsS3Service
    mockCaseRepositoryService = caseRepositoryService
    mockInstitutionRepositoryService = institutionRepositoryService

    mockCaseRepositoryService.findRequestCasesForEventExport.mockResolvedValue(
      [],
    )
    mockCaseRepositoryService.findIndictmentCasesForEventExport.mockResolvedValue(
      [],
    )
    mockInstitutionRepositoryService.findAllActive.mockResolvedValue([])
    mockAwsS3Service.uploadCsvToS3.mockResolvedValue('')
    mockAwsS3Service.getSignedUrl.mockResolvedValue(url)

    givenWhenThen = async (query: CaseDataExportDto) => {
      const then = {} as Then

      try {
        then.result = await statisticsController.exportCaseEventData(
          user,
          query,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('request cases exported', () => {
    const insideCase = makeCase(CaseType.CUSTODY, inPeriod)
    const outsideCase = makeCase(CaseType.CUSTODY, afterPeriod)
    // Created before the period, but sent to court inside it
    const earlierCase = makeCase(CaseType.CUSTODY, beforePeriod, [
      { eventType: EventType.CASE_SENT_TO_COURT, created: inPeriod },
    ])
    const key = `krofur_from_2026-03-01_to_2026-03-31_${user.nationalId}.csv`
    let then: Then

    beforeEach(async () => {
      mockCaseRepositoryService.findRequestCasesForEventExport.mockResolvedValueOnce(
        [earlierCase, insideCase, outsideCase],
      )

      then = await givenWhenThen({
        type: DataGroups.REQUESTS,
        period: { fromDate, toDate },
      })
    })

    it('should read the request cases, and nothing else', () => {
      expect(
        mockCaseRepositoryService.findRequestCasesForEventExport,
      ).toHaveBeenCalledWith()
      expect(
        mockCaseRepositoryService.findIndictmentCasesForEventExport,
      ).not.toHaveBeenCalled()
      expect(
        mockInstitutionRepositoryService.findAllActive,
      ).not.toHaveBeenCalled()
    })

    it('should keep the events inside the period, not the cases', () => {
      expect(rowsOf(uploadedCsv())).toEqual([
        [earlierCase.id, 'Krafa send til héraðsdóms'],
        [insideCase.id, 'Krafa stofnuð'],
      ])
    })

    it('should upload the csv under a key naming the period and the user', () => {
      expect(mockAwsS3Service.uploadCsvToS3).toHaveBeenCalledWith(
        key,
        expect.stringMatching(/^Mál,Atburður,Dagsetning,Stofnun,/),
      )
    })

    it('should return a signed url valid for an hour', () => {
      expect(mockAwsS3Service.getSignedUrl).toHaveBeenCalledWith(
        'statistics',
        key,
        60 * 60,
      )
      expect(then.result).toEqual({ url })
    })
  })

  describe('indictments exported', () => {
    const insideCase = makeCase(CaseType.INDICTMENT, inPeriod)
    const outsideCase = makeCase(CaseType.INDICTMENT, beforePeriod)
    const key = `akaerur_from_2026-03-01_to_2026-03-31_${user.nationalId}.csv`
    let then: Then

    beforeEach(async () => {
      mockCaseRepositoryService.findIndictmentCasesForEventExport.mockResolvedValueOnce(
        [outsideCase, insideCase],
      )

      then = await givenWhenThen({
        type: DataGroups.INDICTMENTS,
        period: { fromDate, toDate },
      })
    })

    it('should read the indictments and the institutions that handle their events', () => {
      expect(
        mockCaseRepositoryService.findIndictmentCasesForEventExport,
      ).toHaveBeenCalledWith()
      expect(
        mockInstitutionRepositoryService.findAllActive,
      ).toHaveBeenCalledWith([
        InstitutionType.PRISON_ADMIN,
        InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
      ])
      expect(
        mockCaseRepositoryService.findRequestCasesForEventExport,
      ).not.toHaveBeenCalled()
    })

    it('should keep the events inside the period', () => {
      expect(rowsOf(uploadedCsv())).toEqual([[insideCase.id, 'Mál stofnað']])
    })

    it('should upload the csv and return its signed url', () => {
      expect(mockAwsS3Service.uploadCsvToS3).toHaveBeenCalledWith(
        key,
        expect.stringMatching(/^Mál,Atburður,Dagsetning,Stofnun,/),
      )
      expect(mockAwsS3Service.getSignedUrl).toHaveBeenCalledWith(
        'statistics',
        key,
        60 * 60,
      )
      expect(then.result).toEqual({ url })
    })
  })

  describe('period bounds', () => {
    const onFromDate = makeCase(CaseType.CUSTODY, fromDate)
    const onToDate = makeCase(CaseType.CUSTODY, toDate)

    beforeEach(async () => {
      mockCaseRepositoryService.findRequestCasesForEventExport.mockResolvedValueOnce(
        [onFromDate, onToDate],
      )

      await givenWhenThen({
        type: DataGroups.REQUESTS,
        period: { fromDate, toDate },
      })
    })

    it('should include events on either bound', () => {
      expect(rowsOf(uploadedCsv()).map(([id]) => id)).toEqual([
        onFromDate.id,
        onToDate.id,
      ])
    })
  })

  describe('period without a from date', () => {
    const firstRow = makeCase(CaseType.CUSTODY, inPeriod)
    const earlierCreated = makeCase(CaseType.CUSTODY, beforePeriod)

    beforeEach(async () => {
      // The export read orders by creation, so the first row is normally the
      // earliest case. Returning them out of order shows that the lower bound
      // is taken from the first row rather than left open.
      mockCaseRepositoryService.findRequestCasesForEventExport.mockResolvedValueOnce(
        [firstRow, earlierCreated],
      )

      await givenWhenThen({ type: DataGroups.REQUESTS, period: { toDate } })
    })

    it('should start the period at the first case returned', () => {
      expect(rowsOf(uploadedCsv()).map(([id]) => id)).toEqual([firstRow.id])
    })
  })

  describe('period without a to date', () => {
    // Created after the period's usual end, but in the past - with a court
    // session scheduled for tomorrow, which is after now
    const laterCase = {
      ...makeCase(CaseType.CUSTODY, afterPeriod),
      courtStartDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    } as Case

    beforeEach(async () => {
      mockCaseRepositoryService.findRequestCasesForEventExport.mockResolvedValueOnce(
        [laterCase],
      )

      await givenWhenThen({ type: DataGroups.REQUESTS, period: { fromDate } })
    })

    it('should end the period now', () => {
      expect(rowsOf(uploadedCsv())).toEqual([[laterCase.id, 'Krafa stofnuð']])
    })
  })

  // Pins current behaviour: with no period the cases are still read, but no
  // event is derived, and a header-only csv is uploaded and signed.
  describe.each([
    [
      DataGroups.REQUESTS,
      () => mockCaseRepositoryService.findRequestCasesForEventExport,
      CaseType.CUSTODY,
    ],
    [
      DataGroups.INDICTMENTS,
      () => mockCaseRepositoryService.findIndictmentCasesForEventExport,
      CaseType.INDICTMENT,
    ],
  ])('no period given for %s', (type, exportRead, caseType) => {
    let then: Then

    beforeEach(async () => {
      exportRead().mockResolvedValueOnce([makeCase(caseType, inPeriod)])

      then = await givenWhenThen({ type })
    })

    it('should upload a csv with a header and no rows', () => {
      expect(exportRead()).toHaveBeenCalled()
      expect(uploadedCsv()).toMatch(/^Mál,Atburður,/)
      expect(rowsOf(uploadedCsv())).toEqual([])
      expect(then.result).toEqual({ url })
    })
  })

  describe('unknown data group', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen({
        type: 'UNKNOWN' as DataGroups,
        period: { fromDate, toDate },
      })
    })

    it('should return an empty url without reading or uploading', () => {
      expect(
        mockCaseRepositoryService.findRequestCasesForEventExport,
      ).not.toHaveBeenCalled()
      expect(
        mockCaseRepositoryService.findIndictmentCasesForEventExport,
      ).not.toHaveBeenCalled()
      expect(mockAwsS3Service.uploadCsvToS3).not.toHaveBeenCalled()
      expect(then.result).toEqual({ url: '' })
    })
  })

  describe('upload fails', () => {
    const error = new Error('Some error')
    let then: Then

    beforeEach(async () => {
      mockAwsS3Service.uploadCsvToS3.mockRejectedValueOnce(error)

      then = await givenWhenThen({
        type: DataGroups.REQUESTS,
        period: { fromDate, toDate },
      })
    })

    it('should log, throw and not sign a url', () => {
      expect(mockLogger.error).toHaveBeenCalledWith(
        `Failed to upload csv krofur_from_2026-03-01_to_2026-03-31_${user.nationalId}.csv to AWS S3`,
        { error },
      )
      expect(then.error).toBe(error)
      expect(mockAwsS3Service.getSignedUrl).not.toHaveBeenCalled()
    })
  })
})
