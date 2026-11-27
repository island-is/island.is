import { plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'

import { UploadPoliceCaseFileDto } from '../dto/uploadPoliceCaseFile.dto'

const idErrors = (id: unknown) =>
  validateSync(
    plainToInstance(UploadPoliceCaseFileDto, { id, name: 'test.pdf' }),
  ).filter((error) => error.property === 'id')

describe('UploadPoliceCaseFileDto', () => {
  it.each(['1', '1234567', '00042'])('should accept the id %s', (id) => {
    expect(idErrors(id)).toHaveLength(0)
  })

  it.each([
    ['an empty string', ''],
    ['letters', 'abc'],
    ['a uuid', '0b1f7a52-9c53-4d0e-8d5e-0c2a4f6b8d10'],
    ['a number with a sign', '-12'],
    ['a decimal number', '12.5'],
    ['a number followed by a line break', '12\n'],
    ['a number with spaces', ' 12 '],
    ['a number with a slash', '12/34'],
    ['a number followed by other characters', '12?x=1'],
    ['more than 20 digits', '1'.repeat(21)],
    ['a number that is not a string', 12],
    ['nothing', undefined],
  ])('should reject %s as id', (_description, id) => {
    expect(idErrors(id)).toHaveLength(1)
  })
})
