import CSVStringify from 'csv-stringify'
import XLSX from 'xlsx'

export const downloadFile = async (
  name: string,
  header: string[],
  data: Array<Array<string | number>>,
  type: 'csv' | 'xlsx',
) => {
  const getFile = (name: string, output: string | undefined) => {
    const uri =
      type === 'csv'
        ? 'data:text/csv;charset=utf-8'
        : 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64'
    const encodedUri = encodeURI(`${uri},${output}`)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', name)
    document.body.appendChild(link)

    link.click()
  }

  if (type === 'csv') {
    const csvData = [header, ...data]
    const filename = `${name}, ${new Date().toISOString().split('T')[0]}.csv`
    console.log('csvData', csvData)
    CSVStringify(csvData, (err, output) => {
      getFile(filename, output)
    })
  } else {
    const dats = [header, ...data]
    const dateString = new Date().toISOString().split('T')[0]
    const fileName = `${name} - ${dateString}`
    const sheetName = name.substring(0, 31)

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dats)
    const workbook: XLSX.WorkBook = {
      Sheets: { [sheetName]: worksheet },
      SheetNames: [sheetName],
    }

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'base64',
    })
    getFile(fileName, excelBuffer)
  }
}
