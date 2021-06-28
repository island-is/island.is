import { gql } from '@apollo/client'

export const GET_EXCEL_SHEET_DATA = gql`
  query GetExcelSheetData($input: ExcelSheetInput!) {
    getExcelDocument(input: $input)
  }
`
