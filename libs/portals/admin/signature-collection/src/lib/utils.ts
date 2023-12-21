import XLSX from 'xlsx'

export const pageSize = 10

export const countryAreas = [
  { value: 'Sunnlendingafjórðungur', label: 'Sunnlendingafjórðungur' },
  { value: 'Vestfirðingafjórðungur', label: 'Vestfirðingafjórðungur' },
  { value: 'Norðlendingafjórðungur', label: 'Norðlendingafjórðungur' },
  { value: 'Austfirðingafjórðungur', label: 'Austfirðingafjórðungur' },
]

export type Filters = {
  area: Array<string>
  candidate: Array<string>
  input: string
}

export const resultsForComparison = {
  nationalId: '010130-2989',
  name: 'Guðmundur Guðmundsson',
  list: 'Gervimaður Útlönd - Sunnlendingafjórðungur',
}

export const downloadFile = () => {
  const name = 'meðmæli.xlsx'
  const sheetData = [['Kennitala'], []]

  const getFile = (name: string, output: string | undefined) => {
    const uri =
      'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,'
    const encodedUri = encodeURI(`${uri}${output}`)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', name)
    document.body.appendChild(link)

    link.click()
  }

  const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData)
  const workbook: XLSX.WorkBook = {
    Sheets: { [name]: worksheet },
    SheetNames: [name],
  }

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'base64',
  })
  getFile(name, excelBuffer)
}
