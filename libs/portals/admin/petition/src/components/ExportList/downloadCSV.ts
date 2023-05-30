import CSVStringify from 'csv-stringify'

export const downloadCSV = async (
  name: string,
  header: string[],
  data: Array<Array<string | number>>,
) => {
  const csvData = [header, ...data]
  CSVStringify(csvData, (err, output) => {
    const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${output}`)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', name)
    document.body.appendChild(link)

    link.click()
  })
}
