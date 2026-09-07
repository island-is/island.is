import type { IslandIsSimpleAssignmentResultDto } from '@island.is/clients/mms/primary-school'
import { mapResult } from './primarySchool.mapper'

const item: IslandIsSimpleAssignmentResultDto = {
  id: 'result1',
  gradeLevel: 5,
}

const studentId = 'student1'
const downloadServiceBaseUrl = 'https://download.island.is'

describe('mapResult', () => {
  it('defaults to the pdf path when implementation is not specified', () => {
    const result = mapResult(item, studentId, downloadServiceBaseUrl)

    expect(result?.downloadServiceUrl).toBe(
      `${downloadServiceBaseUrl}/download/v1/education/primary-school/${studentId}/result/${item.id}/pdf`,
    )
  })

  it('uses the pdf-v2 path when implementation is "new"', () => {
    const result = mapResult(item, studentId, downloadServiceBaseUrl, 'new')

    expect(result?.downloadServiceUrl).toBe(
      `${downloadServiceBaseUrl}/download/v1/education/primary-school/${studentId}/result/${item.id}/pdf-v2`,
    )
  })
})
