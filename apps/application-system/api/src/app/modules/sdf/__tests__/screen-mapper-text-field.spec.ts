import { FormBuilder } from '@island.is/application/core'
import { convertFormToScreens } from '@island.is/application/screen-compiler'
import type { MultiFieldScreen } from '@island.is/application/screen-compiler'
import { Application, FormItemTypes } from '@island.is/application/types'

import { FormTextResolver } from '../i18n-resolver.service'
import { mapScreenToComponents } from '../screen-mapper'

describe('mapScreenToComponents — text field parity props', () => {
  it('maps TextField styling and format props onto the component DTO', () => {
    const form = new FormBuilder('f', 'Form')
      .addSection('sec', 'Section', (section) => {
        section.addPage('page1', 'Page', (page) => {
          page
            .addTextField('plain', 'Plain', { placeholder: 'p' })
            .addTextField('whiteBg', 'White field', {
              backgroundColor: 'white',
              variant: 'text',
            })
            .addTextField('currency', 'Cur', {
              variant: 'currency',
              suffix: ' $',
            })
            .addTextField('mask', 'Kenni', {
              format: '######-####',
              placeholder: 'kt',
            })
            .addTextField('ro', 'RO', {
              readOnly: true,
              rightAlign: true,
            })
            .addTextField('maxlen', 'Max', {
              maxLength: 10,
              showMaxLength: true,
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

    const resolver = {
      resolve: (v: unknown) =>
        typeof v === 'string' ? v : v != null ? String(v) : '',
    } as unknown as FormTextResolver

    const components = mapScreenToComponents(
      multi!,
      resolver,
      {} as Application,
    )

    const byId = (id: string) => components.find((c) => c.id === id)

    expect(byId('plain')?.inputBackgroundColor).toBe('blue')
    expect(byId('whiteBg')?.inputBackgroundColor).toBe('white')
    expect(byId('currency')?.inputVariant).toBe('currency')
    expect(byId('currency')?.textSuffix).toBe(' $')
    expect(byId('mask')?.textFormat).toBe('######-####')
    expect(byId('ro')?.readOnly).toBe(true)
    expect(byId('ro')?.rightAlign).toBe(true)
    expect(byId('maxlen')?.showMaxLength).toBe(true)
    expect(byId('maxlen')?.maxLength).toBe(10)
  })
})
