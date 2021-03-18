import { Workbook, Buffer } from 'exceljs'

export interface Signature {
  signaturee: string
}

interface CreateSignaturesExcelFileInput {
  signatures: Signature[]
}

export const createSignaturesExcelFile = ({
  signatures,
}: CreateSignaturesExcelFileInput): Promise<Buffer> => {
  const workbook = new Workbook()

  // set metadata
  workbook.creator = 'Island.is application system'
  workbook.lastModifiedBy = 'Island.is application system'

  // create results worksheet
  const recommendationsSheet = workbook.addWorksheet('Digital recommendations')

  recommendationsSheet.columns = [
    { header: 'National ID', key: 'nationalId', width: 40 },
  ]

  signatures.forEach((signature) => {
    recommendationsSheet.addRow({
      nationalId: signature.signaturee,
    })
  })

  return workbook.xlsx.writeBuffer()
}
