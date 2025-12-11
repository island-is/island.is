import {
  Application,
  FormText,
  FormTextArray,
  TableData,
} from '@island.is/application/types'

export const isEmpty = (value: unknown) => {
  if (!value) {
    return true
  }

  if (Array.isArray(value)) {
    return value.length === 0
  }

  return false
}

export const changeScreens = (
  screen: string,
  goToScreen?: (screen: string) => void,
) => {
  if (goToScreen) {
    goToScreen(screen)
  }
}

export const tableDataToShow = (
  tableData: TableData | undefined,
  loadedTableData?: TableData | undefined,
) => {
  if (tableData && tableData.header.length > 0) {
    return tableData
  }

  if (loadedTableData && loadedTableData.header.length > 0) {
    return loadedTableData
  }

  return null
}

export const evaluateValueText = (
  valueText: FormText | FormTextArray | undefined,
  application: Application,
) => {
  if (!valueText) {
    return undefined
  }

  if (typeof valueText === 'function') {
    return valueText(application)
  }

  return valueText
}
