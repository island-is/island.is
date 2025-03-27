import CSVStringify from 'csv-stringify'
import XLSX from 'xlsx'
import { sanitizeSheetName } from './utils'
import format from 'date-fns/format'
import { formatDateWithTime } from './dateUtils'

export const downloadFile = async (
  name: string,
  header: string[],
  data: Array<Array<unknown>>,
  type: 'csv' | 'xlsx',
) => {
  const getFile = (name: string, output: string | undefined) => {
    const uri =
      type === 'csv'
        ? 'data:text/plain;charset=utf-8,\uFEFF'
        : 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,'
    const encodedUri = encodeURI(`${uri}${output}`)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', name)
    document.body.appendChild(link)

    link.click()
  }

  if (type === 'csv') {
    const csvData = [header, ...data]
    const filename = sanitizeSheetName(
      `${name}_${format(new Date(), 'dd.MM.yyyy_HH:mm')}.csv`,
      true,
    )
    CSVStringify(csvData, (err, output) => {
      getFile(filename, output)
    })
  } else {
    const sheetData = [header, ...data]
    const fileName = `${name}_${format(new Date(), 'dd.MM.yyyy_HH:mm')}.xlsx`
    const sheetName = sanitizeSheetName(name)

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData)
    const workbook: XLSX.WorkBook = {
      Sheets: { [sheetName]: worksheet },
      SheetNames: [sheetName],
    }

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'base64',
    })
    getFile(fileName, excelBuffer)
  }
}
