import { CaseFileCategory } from '../../graphql/schema'
import { filterCaseFilesByCategory } from './IndictmentCaseFilesList'

describe('filterCaseFilesByCategory', () => {
  test('should return an empty array if no case files are provided', () => {
    const result = filterCaseFilesByCategory([], undefined)
    expect(result).toEqual([])
  })

  test('should return an empty array if no categories are provided', () => {
    const result = filterCaseFilesByCategory([], [])
    expect(result).toEqual([])
  })

  test('should return an empty array if no case files match the provided categories', () => {
    const result = filterCaseFilesByCategory([CaseFileCategory.INDICTMENT], [])
    expect(result).toEqual([])
  })

  test('should return an array of case files that match the provided categories', () => {
    const caseFiles = [
      {
        id: '1',
        category: CaseFileCategory.INDICTMENT,
      },
      {
        id: '2',
        category: CaseFileCategory.CRIMINAL_RECORD,
      },
    ]
    const result = filterCaseFilesByCategory(
      [CaseFileCategory.INDICTMENT],
      caseFiles,
    )
    expect(result).toEqual([caseFiles[0]])
  })
})
