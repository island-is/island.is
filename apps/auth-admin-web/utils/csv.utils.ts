/* eslint-disable  @typescript-eslint/no-explicit-any */
import CSVStringify from 'csv-stringify'

export const downloadCSV = async (
  filename: string,
  header: string[],
  getDataFunction: () => Promise<any[]>,
) => {
  const data = await getDataFunction()

  data.unshift(header)

  CSVStringify(data, (err, output) => {
    const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${output}`)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', filename)
    document.body.appendChild(link)

    link.click()
  })
}
