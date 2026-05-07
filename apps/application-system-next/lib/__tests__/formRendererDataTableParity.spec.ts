import * as fs from 'fs'
import * as path from 'path'

describe('FormRenderer — DataTable parity structure', () => {
  const dataTableFieldPath = path.join(
    __dirname,
    '../../components/form-renderer/fields/SdfDataTableField.tsx',
  )
  const block = fs.readFileSync(dataTableFieldPath, 'utf8')

  it('renders data tables as real table rows, not accordion items', () => {
    expect(block).toContain('<table style={tableStyle}>')
    expect(block).toContain('<tbody>')
    expect(block).not.toContain('<AccordionItem')
  })

  it('writes selected data-table rows as a units array', () => {
    expect(block).toContain('const selectedUnits = getDataTableUnits(tableValue)')
    expect(block).toContain('const setSelectedUnits')
    expect(block).toContain('units: nextUnits')
  })

  it('uses row payloads and default values when checking a unit', () => {
    expect(block).toContain('editableRow.payload')
    expect(block).toContain('editableRow.defaultValues')
    expect(block).toContain('checked: true')
  })

  it('disables editable inputs until their unit checkbox is checked', () => {
    expect(block).toContain('disabled={!checked}')
    expect(block).toContain('toggleEditableRow')
  })

  it('hides the table until the server returns at least one row', () => {
    expect(block).toContain('dataRows.length === 0 ? null')
  })
})
