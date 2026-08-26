import { parseUploadFile } from './UploadCarDayRateUsageUtils'
import { getEligibleDayRateRecords } from './dayRateRecordUtils'
import { DayRateRecord } from './types'

const dayRateRecords: DayRateRecord[] = [
  { permno: 'AA111', prevPeriodTotalDays: 30 },
  { permno: 'BB222', prevPeriodTotalDays: 30 },
  // Listed for the applicant to see, but Skatturinn already has its return
  { permno: 'CC333', prevPeriodTotalDays: 30, alreadyReportedDays: 5 },
]

const dayRateRecordsByPermno = new Map(
  dayRateRecords.map((record) => [record.permno, record]),
)

// What the multi upload screen checks the parsed rows against
const eligibleRecordCount = getEligibleDayRateRecords(dayRateRecords).length

const csvFile = (rows: string[]) =>
  Buffer.from(['permno;total;usage', ...rows].join('\n'), 'utf-8')

describe('parseUploadFile', () => {
  it('accepts the generated template, which omits reported cars', async () => {
    const parsed = await parseUploadFile(
      csvFile(['AA111;30;10', 'BB222;30;12']),
      'csv',
      dayRateRecordsByPermno,
    )

    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return
    expect(parsed.records.length).toBe(eligibleRecordCount)
  })

  it('skips already reported cars instead of failing', async () => {
    const parsed = await parseUploadFile(
      csvFile(['AA111;30;10', 'BB222;30;12', 'CC333;30;7']),
      'csv',
      dayRateRecordsByPermno,
    )

    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return
    expect(parsed.records.map((record) => record.vehicleId)).toEqual([
      'AA111',
      'BB222',
    ])
    expect(parsed.records.length).toBe(eligibleRecordCount)
  })

  it('still rejects a plate that is not on the day rate list', async () => {
    const parsed = await parseUploadFile(
      csvFile(['AA111;30;10', 'ZZ999;30;3']),
      'csv',
      dayRateRecordsByPermno,
    )

    expect(parsed.ok).toBe(false)
    if (parsed.ok) return
    expect(parsed.errors.map((error) => error.carNr)).toEqual(['ZZ999'])
  })

  it('still rejects usage greater than the days on day rate', async () => {
    const parsed = await parseUploadFile(
      csvFile(['AA111;30;31', 'BB222;30;12']),
      'csv',
      dayRateRecordsByPermno,
    )

    expect(parsed.ok).toBe(false)
    if (parsed.ok) return
    expect(parsed.errors.map((error) => error.carNr)).toEqual(['AA111'])
  })

  it('points at the row number when the plate cell is blank', async () => {
    const parsed = await parseUploadFile(
      csvFile(['AA111;30;10', 'BB222;30;12', ';30;5']),
      'csv',
      dayRateRecordsByPermno,
    )

    expect(parsed.ok).toBe(false)
    if (parsed.ok) return
    expect(parsed.errors).toEqual([
      expect.objectContaining({ carNr: '', row: 4 }),
    ])
  })

  it('matches plates regardless of case and padding', async () => {
    const parsed = await parseUploadFile(
      csvFile(['aa111;30;10', ' bB222 ;30;12']),
      'csv',
      dayRateRecordsByPermno,
    )

    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return
    // The canonical plate is submitted, not whatever the cell happened to say
    expect(parsed.records.map((record) => record.vehicleId)).toEqual([
      'AA111',
      'BB222',
    ])
  })

  it.each([
    ['text', 'AA111;30;abc'],
    ['a negative count', 'AA111;30;-3'],
    ['a fractional count', 'AA111;30;1.5'],
  ])('rejects %s instead of submitting it', async (_label, row) => {
    const parsed = await parseUploadFile(
      csvFile([row, 'BB222;30;12']),
      'csv',
      dayRateRecordsByPermno,
    )

    expect(parsed.ok).toBe(false)
    if (parsed.ok) return
    expect(parsed.errors.map((error) => error.carNr)).toEqual(['AA111'])
  })

  it('reports an unreadable file instead of throwing', async () => {
    const parsed = await parseUploadFile(
      // Ragged row: csv-parse treats both ';' and ',' as delimiters
      csvFile(['AA111;30;10', 'BB222;30;1,5']),
      'csv',
      dayRateRecordsByPermno,
    )

    expect(parsed.ok).toBe(false)
    if (parsed.ok) return
    expect(parsed.reason).toBe('unreadable')
  })

  it('leaves a missing eligible car short of the required count', async () => {
    const parsed = await parseUploadFile(
      csvFile(['AA111;30;10']),
      'csv',
      dayRateRecordsByPermno,
    )

    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return
    expect(parsed.records.length).not.toBe(eligibleRecordCount)
  })
})
