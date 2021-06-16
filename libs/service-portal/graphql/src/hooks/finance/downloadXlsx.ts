import { useLazyQuery, useQuery } from '@apollo/client'
import { GET_EXCEL_SHEET_DATA } from '../../lib/queries/getExcelSheetData'

const downloadXlsx = async (output: string, name: string) => {
  const filename = `${name}.xlsx`
  const encodedUri = encodeURI(
    `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${output}`,
  )
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', filename)
  document.body.appendChild(link)

  link.click()
}

export const downloadXlsxDocument = () => {
  const [loadExcelSheet] = useLazyQuery(GET_EXCEL_SHEET_DATA, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      const xlslData = data?.getExcelDocument || null
      if (xlslData) {
        downloadXlsx(xlslData.file, xlslData.filename)
      } else {
        console.warn('No excel data') // Should warn the user with toast?
      }
    },
  })

  const downloadSheet = (xlsx: any) => {
    loadExcelSheet({
      variables: {
        input: {
          headers: xlsx.headers,
          data: xlsx.data,
        },
      },
    })
  }

  return {
    downloadSheet,
  }
}
