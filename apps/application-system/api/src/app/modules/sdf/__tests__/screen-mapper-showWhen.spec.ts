import { FormBuilder } from '@island.is/application/core'
import { convertFormToScreens } from '@island.is/application/screen-compiler'
import type { MultiFieldScreen } from '@island.is/application/screen-compiler'
import {
  Application,
  FormItemTypes,
} from '@island.is/application/types'

import { FormTextResolver } from '../i18n-resolver.service'
import { mapScreenToComponents } from '../screen-mapper'

describe('mapScreenToComponents — showWhen / non-navigable children', () => {
  it('includes a non-navigable select when Tier-1 showWhen targets another field', () => {
    const form = new FormBuilder('f', 'Form')
      .addSection('sec', 'Section', (section) => {
        section.addPage('page1', 'Page', (page) => {
          page
            .addTextField('gate', 'Gate')
            .addSelectField('irrigationType', 'Irrigation', {
              options: [
                { label: 'Drip', value: 'drip' },
                { label: 'Sprinkler', value: 'sprinkler' },
              ],
              placeholder: 'Pick one',
              showWhen: { field: 'gate', equals: 'open' },
            })
        })
      })
      .build()

    const screens = convertFormToScreens(form, {}, {}, null)
    const multi = screens.find(
      (s): s is MultiFieldScreen =>
        'type' in s &&
        (s as { type: string }).type === FormItemTypes.MULTI_FIELD &&
        (s as MultiFieldScreen).id === 'page1',
    )

    expect(multi).toBeDefined()
    const hiddenSelect = multi!.children.find((c) => c.id === 'irrigationType')
    expect(hiddenSelect?.isNavigable).toBe(false)

    const resolver = {
      resolve: () => '',
    } as unknown as FormTextResolver

    const components = mapScreenToComponents(
      multi!,
      resolver,
      {} as Application,
    )

    expect(components.some((c) => c.id === 'irrigationType' && c.type === 'SELECT')).toBe(
      true,
    )
  })
})
