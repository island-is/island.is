import * as fs from 'fs'
import * as path from 'path'

describe('FormRenderer — Select multi value support', () => {
  const selectFieldPath = path.join(
    __dirname,
    '../../components/form-renderer/fields/SdfSelectField.tsx',
  )
  const source = fs.readFileSync(selectFieldPath, 'utf8')

  it('passes the SDF isMulti flag to island-ui Select', () => {
    expect(source).toContain('isMulti={component.isMulti}')
  })

  it('maps multi-select answers to and from arrays of option values', () => {
    expect(source).toContain('Array.isArray(currentValue)')
    expect(source).toMatch(/selectedOptions\.map\(\(opt\) => opt\.value\)/)
  })
})
