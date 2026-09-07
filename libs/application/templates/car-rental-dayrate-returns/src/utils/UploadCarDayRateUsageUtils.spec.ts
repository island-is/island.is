import XLSX from 'xlsx'
import { createErrorExcel, parseUploadFile } from './UploadCarDayRateUsageUtils'
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

// Rows are given as cell arrays so a genuinely blank spreadsheet row can be
// expressed as [] rather than as a line of separators
const xlsxFile = (rows: Array<Array<string | number>>): ArrayBuffer => {
  const worksheet = XLSX.utils.aoa_to_sheet([
    ['permno', 'total', 'usage'],
    ...rows,
  ])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  return XLSX.write(workbook, { type: 'array', bookType: 'xlsx' })
}

const readSheet = (base64: string): string[][] => {
  const workbook = XLSX.read(base64, { type: 'base64' })
  return XLSX.utils.sheet_to_json<string[]>(
    workbook.Sheets[workbook.SheetNames[0]],
    { header: 1, blankrows: true, defval: '' },
  )
}

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

  it('rejects the same plate on two rows instead of counting it twice', async () => {
    const parsed = await parseUploadFile(
      // Two rows for AA111 and none for BB222: the record count would still
      // match the eligible count, so the duplicate has to be an error
      csvFile(['AA111;30;10', 'aa111;30;12']),
      'csv',
      dayRateRecordsByPermno,
    )

    expect(parsed.ok).toBe(false)
    if (parsed.ok) return
    expect(parsed.errors).toEqual([
      expect.objectContaining({ carNr: 'aa111', row: 3 }),
    ])
  })

  it('skips blank rows without reporting them as unknown cars', async () => {
    const parsed = await parseUploadFile(
      csvFile(['AA111;30;10', ';;', 'BB222;30;12']),
      'csv',
      dayRateRecordsByPermno,
    )

    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return
    expect(parsed.records.map((record) => record.vehicleId)).toEqual([
      'AA111',
      'BB222',
    ])
  })

  it('keeps row numbers aligned with the file when a csv row is blank', async () => {
    const parsed = await parseUploadFile(
      csvFile(['AA111;30;10', ';;', 'ZZ999;30;5']),
      'csv',
      dayRateRecordsByPermno,
    )

    expect(parsed.ok).toBe(false)
    if (parsed.ok) return
    // ZZ999 sits on the fourth line of the file, not the third
    expect(parsed.errors).toEqual([
      expect.objectContaining({ carNr: 'ZZ999', row: 4 }),
    ])
  })

  it('keeps row numbers aligned with the file when an xlsx row is blank', async () => {
    const parsed = await parseUploadFile(
      xlsxFile([['AA111', 30, 10], [], ['ZZ999', 30, 5]]),
      'xlsx',
      dayRateRecordsByPermno,
    )

    expect(parsed.ok).toBe(false)
    if (parsed.ok) return
    expect(parsed.errors).toEqual([
      expect.objectContaining({ carNr: 'ZZ999', row: 4 }),
    ])
  })
})

describe('createErrorExcel', () => {
  it('marks only the row an error came from, not every row sharing its plate', async () => {
    const file = csvFile(['AA111;30;10', 'AA111;30;12', 'BB222;30;5'])

    const parsed = await parseUploadFile(file, 'csv', dayRateRecordsByPermno)
    expect(parsed.ok).toBe(false)
    if (parsed.ok) return

    const errorExcel = await createErrorExcel(
      file,
      'csv',
      new Map(parsed.errors.map((error) => [error.row, 'Villa'])),
    )

    const [header, ...rows] = readSheet(errorExcel)
    expect(header).toEqual(['permno', 'total', 'usage', 'Villa'])
    // Error rows are sorted to the top, so the duplicate leads and the first
    // AA111 row keeps its empty error cell
    expect(rows.map((row) => [row[0], row[2], row[3]])).toEqual([
      ['AA111', '12', 'Villa'],
      ['AA111', '10', ''],
      ['BB222', '5', ''],
    ])
  })
})
