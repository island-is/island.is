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
  currentLocale: 'is',
} as unknown as FormTextResolver

const makeScaleChild = (id: string, extra: Record<string, unknown>) => ({
  id,
  type: FieldTypes.SCALE,
  component: 'ScaleFormField',
  title: id,
  isNavigable: true,
  sectionIndex: 0,
  subSectionIndex: 0,
  ...extra,
})

describe('mapScreenToComponents — scale field', () => {
  it('maps bounds, labels and callback-driven max onto the component DTO', () => {
    const screen = {
      type: FormItemTypes.MULTI_FIELD,
      id: 'page1',
      title: 'Scales',
      sectionIndex: 0,
      subSectionIndex: 0,
      isNavigable: true,
      children: [
        makeScaleChild('plain', {
          min: 1,
          max: 5,
          step: 1,
          minLabel: 'Worst',
          maxLabel: 'Best',
          showLabels: true,
        }),
        // `min`/`max` accept numeric strings, and `max` accepts a callback.
        makeScaleChild('dynamic', {
          min: '0',
          max: () => '10',
        }),
      ],
    } as unknown as MultiFieldScreen

    const components = mapScreenToComponents(
      screen,
      stubResolver,
      {} as Application,
    )

    const byId = (id: string) => components.find((c) => c.id === id)

    expect(byId('plain')?.min).toBe(1)
    expect(byId('plain')?.max).toBe(5)
    expect(byId('plain')?.step).toBe(1)
    expect(byId('plain')?.minLabel).toBe('Worst')
    expect(byId('plain')?.maxLabel).toBe('Best')
    expect(byId('plain')?.showLabels).toBe(true)

    expect(byId('dynamic')?.min).toBe(0)
    expect(byId('dynamic')?.max).toBe(10)
    // Left unset so the renderer keeps the island-ui `Scale` default.
    expect(byId('dynamic')?.showLabels).toBeUndefined()
  })
})
