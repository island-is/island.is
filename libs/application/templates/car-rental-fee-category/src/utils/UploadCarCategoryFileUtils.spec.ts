import XLSX from 'xlsx'
import { createErrorExcel } from './UploadCarCategoryFileUtils'
import { parseUploadFile } from './carCategoryUtils'
import { RateCategory } from './constants'
import { CarMap } from './types'

const currentCarData: CarMap = {
  AA111: { mileage: 100, category: RateCategory.KMRATE },
  BB222: { mileage: 200, category: RateCategory.KMRATE },
}

// Moving onto the day rate, so the 15 day rule never comes into play here
const rateToChangeTo = RateCategory.DAYRATE

const csvFile = (rows: string[]) =>
  Buffer.from(['permno;prev;curr', ...rows].join('\n'), 'utf-8')

// Rows are given as cell arrays so a genuinely blank spreadsheet row can be
// expressed as [] rather than as a line of separators
const xlsxFile = (rows: Array<Array<string | number>>): ArrayBuffer => {
  const worksheet = XLSX.utils.aoa_to_sheet([
    ['permno', 'prev', 'curr'],
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
  it('keeps row numbers aligned with the file when a csv row is blank', async () => {
    const parsed = await parseUploadFile(
      csvFile(['AA111;100;200', ';;', 'ZZ999;100;200']),
      'csv',
      rateToChangeTo,
      currentCarData,
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
      xlsxFile([['AA111', 100, 200], [], ['ZZ999', 100, 200]]),
      'xlsx',
      rateToChangeTo,
      currentCarData,
    )

    expect(parsed.ok).toBe(false)
    if (parsed.ok) return
    expect(parsed.errors).toEqual([
      expect.objectContaining({ carNr: 'ZZ999', row: 4 }),
    ])
  })

  it('ignores blank rows rather than turning them into records', async () => {
    const parsed = await parseUploadFile(
      csvFile(['AA111;100;200', ';;', 'BB222;100;150']),
      'csv',
      rateToChangeTo,
      currentCarData,
    )

    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return
    expect(parsed.records.map((record) => record.vehicleId)).toEqual([
      'AA111',
      'BB222',
    ])
  })
})

describe('createErrorExcel', () => {
  it('marks only the row an error came from, not every row sharing its plate', async () => {
    // The same plate on a failing and a passing row: only the failing one
    // should come back marked
    const file = csvFile(['AA111;100;90', 'AA111;100;200', 'BB222;100;150'])

    const parsed = await parseUploadFile(
      file,
      'csv',
      rateToChangeTo,
      currentCarData,
    )
    expect(parsed.ok).toBe(false)
    if (parsed.ok) return
    expect(parsed.errors).toEqual([
      expect.objectContaining({ carNr: 'AA111', row: 2 }),
    ])

    const errorExcel = await createErrorExcel(
      file,
      'csv',
      new Map(parsed.errors.map((error) => [error.row, 'Villa'])),
    )

    const [header, ...rows] = readSheet(errorExcel)
    expect(header).toEqual(['permno', 'prev', 'curr', 'Villa'])
    // Error rows are sorted to the top, so the failing row leads and the other
    // AA111 row keeps its empty error cell
    expect(rows.map((row) => [row[0], row[2], row[3]])).toEqual([
      ['AA111', '90', 'Villa'],
      ['AA111', '200', ''],
      ['BB222', '150', ''],
    ])
  })

  it('leaves blank rows unmarked when a plate cell is empty', async () => {
    const file = csvFile([';100;200', ';;', 'BB222;100;150'])

    const parsed = await parseUploadFile(
      file,
      'csv',
      rateToChangeTo,
      currentCarData,
    )
    expect(parsed.ok).toBe(false)
    if (parsed.ok) return
    expect(parsed.errors).toEqual([
      expect.objectContaining({ carNr: '', row: 2 }),
    ])

    const errorExcel = await createErrorExcel(
      file,
      'csv',
      new Map(parsed.errors.map((error) => [error.row, 'Villa'])),
    )

    const rows = readSheet(errorExcel).slice(1)
    // Only the row the error was reported on carries a message
    expect(rows.map((row) => row[3] ?? '')).toEqual(['Villa', '', ''])
  })
})
