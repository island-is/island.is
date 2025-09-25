import { AdminPortalScope } from '@island.is/auth/scopes'
import {
  UploadFileDeprecated,
  fileToObjectDeprecated,
} from '@island.is/island-ui/core'
import { uuid } from 'uuidv4'
import XLSX from 'xlsx'
import { SignatureCollectionList } from '@island.is/api/schema'
import { m } from '../lib/messages'
import { TagVariant } from '@island.is/island-ui/core'

export const pageSize = 10

export const allowedScopesAdminAndMunicipality: string[] = [
  AdminPortalScope.signatureCollectionManage,
  AdminPortalScope.signatureCollectionProcess,
  AdminPortalScope.signatureCollectionMunicipality,
]

export const allowedScopesAdmin: string[] = [
  AdminPortalScope.signatureCollectionManage,
  AdminPortalScope.signatureCollectionProcess,
]

export const countryAreas = [
  { value: 'Sunnlendingafjórðungur', label: 'Sunnlendingafjórðungur' },
  { value: 'Vestfirðingafjórðungur', label: 'Vestfirðingafjórðungur' },
  { value: 'Norðlendingafjórðungur', label: 'Norðlendingafjórðungur' },
  { value: 'Austfirðingafjórðungur', label: 'Austfirðingafjórðungur' },
]

export const signeeTypes = [
  { value: 'paper', label: 'Af blaði' },
  { value: 'digital', label: 'Rafræn' },
]

export type FiltersOverview = {
  area: Array<string>
  candidate: Array<string>
  input: string
}

export type FiltersSigneeType = {
  signeeType: Array<string>
  pageNumber: Array<string>
}

export enum ListStatus {
  Active = 'Active',
  InReview = 'InReview',
  Reviewed = 'Reviewed',
  Extendable = 'Extendable',
  Inactive = 'Inactive',
}

export enum CollectionStatus {
  InitialActive = 'InitialActive',
  Active = 'Active',
  InInitialReview = 'InInitialReview',
  InReview = 'InReview',
  Processing = 'Processing',
  Processed = 'Processed',
  Inactive = 'Inactive',
}

export const downloadFile = () => {
  const fileName = 'beraSaman.xlsx'
  const sheetName = 'Bera saman'
  const sheetData = [['Kennitala']]

  const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData)

  // Apply Text format for all cells in column A
  Object.keys(worksheet).forEach((cell) => {
    if (cell[0] === 'A' && cell !== '!ref') {
      worksheet[cell].t = 's'
      worksheet[cell].z = '@'
    }
  })

  worksheet['!cols'] = [{ wch: 20 }]

  const workbook: XLSX.WorkBook = {
    Sheets: { [sheetName]: worksheet },
    SheetNames: [sheetName],
  }

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'base64',
  })

  // Trigger download
  const link = document.createElement('a')
  link.href =
    'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' +
    excelBuffer
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Bulk upload and compare
export const createFileList = (
  files: File[],
  fileList: UploadFileDeprecated[],
) => {
  const uploadFiles = files.map((file) => fileToObjectDeprecated(file))
  const uploadFilesWithKey = uploadFiles.map((f) => ({
    ...f,
    key: uuid(),
  }))
  return [...fileList, ...uploadFilesWithKey]
}

export const getFileData = async (newFile: File[]) => {
  const buffer = await newFile[0].arrayBuffer()
  const file = XLSX.read(buffer, { type: 'buffer' })

  const data: Record<string, unknown>[] = []
  const sheets = file.SheetNames

  for (let i = 0; i < sheets.length; i++) {
    const temp = XLSX.utils.sheet_to_json(file.Sheets[file.SheetNames[i]])
    temp.forEach((res) => {
      data.push(res as Record<string, unknown>)
    })
  }

  return data
}

export const getTagConfig = (list: SignatureCollectionList) => {
  // Lista læst
  if (!list.active && !list.reviewed) {
    return {
      label: m.listLocked.defaultMessage,
      variant: 'blueberry' as TagVariant,
      outlined: false,
    }
  }

  // Úrvinnslu lokið
  if (!list.active && list.reviewed) {
    return {
      label: m.confirmListReviewed.defaultMessage,
      variant: 'mint' as TagVariant,
      outlined: true,
    }
  }

  // Söfnun í gangi
  return {
    label: m.listOpen.defaultMessage,
    variant: 'blue' as TagVariant,
    outlined: false,
  }
}
