import type { MultiFieldScreen } from '@island.is/application/screen-compiler'
import {
  Application,
  FieldTypes,
  FormItemTypes,
} from '@island.is/application/types'

import { FormTextResolver } from '../i18n-resolver.service'
import { mapScreenToComponents } from '../screen-mapper'

const stubResolver = {
  resolve: (v: unknown) =>
    typeof v === 'string' ? v : v != null ? String(v) : '',
} as unknown as FormTextResolver

const options = [
  { label: 'A', value: 'a' },
  { label: 'B', value: 'b' },
]

const makeCheckboxChild = (id: string, extra: Record<string, unknown>) => ({
  id,
  type: FieldTypes.CHECKBOX,
  component: 'CheckboxFormField',
  title: id,
  options,
  isNavigable: true,
  sectionIndex: 0,
  subSectionIndex: 0,
  ...extra,
})

describe('mapScreenToComponents — checkbox field parity props', () => {
  it('maps width=half, strong, large, spacing, backgroundColor and description onto the component DTO', () => {
    const screen = {
      type: FormItemTypes.MULTI_FIELD,
      id: 'page1',
      title: 'Checkboxes',
      sectionIndex: 0,
      subSectionIndex: 0,
      isNavigable: true,
      children: [
        makeCheckboxChild('full', {
          description: 'Pick any',
        }),
        makeCheckboxChild('half', {
          width: 'half',
        }),
        makeCheckboxChild('halfStrong', {
          width: 'half',
          strong: true,
          large: true,
          spacing: 1,
          backgroundColor: 'white',
        }),
      ],
    } as unknown as MultiFieldScreen

    const components = mapScreenToComponents(
      screen,
      stubResolver,
      {} as Application,
    )

    const byId = (id: string) => components.find((c) => c.id === id)

    expect(byId('full')?.width).toBe('FULL')
    expect(byId('full')?.description).toBe('Pick any')
    expect(byId('full')?.strong).toBeUndefined()
    expect(byId('full')?.placeholder).toBeUndefined()

    expect(byId('half')?.width).toBe('HALF')
    expect(byId('half')?.strong).toBeUndefined()

    expect(byId('halfStrong')?.width).toBe('HALF')
    expect(byId('halfStrong')?.strong).toBe(true)
    expect(byId('halfStrong')?.large).toBe(true)
    expect(byId('halfStrong')?.spacing).toBe(1)
    expect(byId('halfStrong')?.checkboxBackgroundColor).toBe('white')
  })
})
