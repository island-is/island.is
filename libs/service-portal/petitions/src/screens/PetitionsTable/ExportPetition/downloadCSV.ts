import CSVStringify from 'csv-stringify'

export const downloadCSV = async (
  name: string,
  header: string[],
  data: Array<Array<string | number>>,
  type: 'csv',
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

  const csvData = [header, ...data]
  const filename = `${name}, ${new Date().toISOString().split('T')[0]}.csv`
  CSVStringify(csvData, (err, output) => {
    getFile(filename, output)
  })
}
