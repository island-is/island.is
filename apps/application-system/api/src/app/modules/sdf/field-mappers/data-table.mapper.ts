import { ComponentDto } from '../dto/screen.dto'
import { FormTextResolver } from '../i18n-resolver.service'
import { FieldMapper } from './types'
import { asResolvableFormText, isRecord, resolveFieldProp } from './utils'

type RawDataTableInput = {
  key: string
  label?: unknown
  type: 'text' | 'number'
  min?: number
  max?: number
  format?: string
  suffix?: unknown
}

type RawDataTableEditableRow = {
  id: string
  label: unknown
  cells?: unknown[]
  hasCheckbox?: boolean
  checkboxKey?: string
  inputs?: RawDataTableInput[]
  payload?: unknown
  defaultValues?: unknown
}

type RawDataTableRow = {
  id: string
  cells: unknown[]
  expandable?: {
    rows: RawDataTableEditableRow[]
  }
}

const mapDataTableRows = (
  rows: unknown,
  resolver: FormTextResolver,
): ComponentDto['rows'] => {
  if (!Array.isArray(rows)) {
    return []
  }

  return rows.map((row) => {
    const dataRow = row as Partial<RawDataTableRow>
    return {
      id: String(dataRow.id ?? ''),
      cells: Array.isArray(dataRow.cells)
        ? dataRow.cells.map((cell) =>
            resolver.resolve(asResolvableFormText(cell)),
          )
        : [],
      expandable: dataRow.expandable
        ? {
            rows: (dataRow.expandable.rows ?? []).map((editableRow) => ({
              id: String(editableRow.id ?? ''),
              label:
                resolver.resolve(asResolvableFormText(editableRow.label)) || '',
              cells: (editableRow.cells ?? []).map((cell) =>
                resolver.resolve(asResolvableFormText(cell)),
              ),
              hasCheckbox: editableRow.hasCheckbox === true,
              checkboxKey: editableRow.checkboxKey,
              inputs: (editableRow.inputs ?? []).map((input) => ({
                key: input.key,
                label: resolver.resolve(asResolvableFormText(input.label)),
                type: input.type,
                min: input.min,
                max: input.max,
                format: input.format,
                suffix: resolver.resolve(asResolvableFormText(input.suffix)),
              })),
              payload: isRecord(editableRow.payload)
                ? editableRow.payload
                : undefined,
              defaultValues: isRecord(editableRow.defaultValues)
                ? editableRow.defaultValues
                : undefined,
            })),
          }
        : undefined,
    }
  })
}

export const mapDataTableField: FieldMapper = (
  component,
  raw,
  { application, resolver },
) => {
  const header = resolveFieldProp(raw.header, application)
  const rows = resolveFieldProp(raw.rows, application)
  component.header = Array.isArray(header)
    ? header.map((h: unknown) => resolver.resolve(asResolvableFormText(h)))
    : []
  component.rows = mapDataTableRows(rows, resolver)
}
