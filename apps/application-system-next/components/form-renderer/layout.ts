import type { SdfComponentData } from '../../lib/graphql'

export const FULL_ROW_TYPES = new Set([
  'SdfRadioField',
  'SdfCheckboxField',
  'SdfDisplayField',
  'SdfAlertMessageField',
  'SdfExpandableDescriptionField',
  'SdfAccordionField',
  'SdfStaticTableField',
  'SdfDataTableField',
  'SdfSearchField',
  'SdfFileUploadField',
  'SdfSliderField',
  'SdfDividerField',
  'SdfTitleField',
  'SdfDescriptionField',
  'SdfExternalDataProviderField',
  'SdfInformationCardField',
  'SdfPaymentChargeOverviewField',
])

export const isHalfWidthCandidate = (comp: SdfComponentData): boolean =>
  comp.width === 'HALF' && !FULL_ROW_TYPES.has(comp.__typename)

export const groupComponentsIntoRows = (
  components: SdfComponentData[],
): SdfComponentData[][] => {
  const rows: SdfComponentData[][] = []
  let i = 0

  while (i < components.length) {
    const comp = components[i]
    if (isHalfWidthCandidate(comp)) {
      const row: SdfComponentData[] = [comp]
      if (
        i + 1 < components.length &&
        isHalfWidthCandidate(components[i + 1])
      ) {
        row.push(components[i + 1])
        i += 2
      } else {
        i += 1
      }
      rows.push(row)
    } else {
      rows.push([comp])
      i += 1
    }
  }

  return rows
}
