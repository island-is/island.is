import { FormBuilder } from '@island.is/application/core'
import { convertFormToScreens } from '@island.is/application/screen-compiler'
import type { MultiFieldScreen } from '@island.is/application/screen-compiler'
import { Application, FormItemTypes } from '@island.is/application/types'

import { FormTextResolver } from '../i18n-resolver.service'
import { mapScreenToComponents } from '../screen-mapper'

describe('mapScreenToComponents — clientShowWhen children', () => {
  it('emits clientShowWhen for a select when it targets another field', () => {
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
              clientShowWhen: {
                operator: 'EQUALS',
                args: [{ operator: 'GET', args: ['gate'] }, 'open'],
              },
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

    if (!multi) {
      throw new Error('Expected page1 multi-field screen')
    }
    const resolver = {
      resolve: () => '',
    } as unknown as FormTextResolver

    const components = mapScreenToComponents(multi, resolver, {} as Application)

    expect(
      components.some((c) => c.id === 'irrigationType' && c.type === 'SELECT'),
    ).toBe(true)
    expect(
      components.find((c) => c.id === 'irrigationType')?.clientShowWhen,
    ).toEqual({
      operator: 'EQUALS',
      args: [{ operator: 'GET', args: ['gate'] }, 'open'],
    })
  })

  it('does not emit server-hidden children even when they have clientShowWhen', () => {
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
              showWhen: { field: 'serverGate', equals: 'open' },
              clientShowWhen: {
                operator: 'EQUALS',
                args: [{ operator: 'GET', args: ['gate'] }, 'open'],
              },
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

    if (!multi) {
      throw new Error('Expected page1 multi-field screen')
    }
    const resolver = {
      resolve: () => '',
    } as unknown as FormTextResolver

    const components = mapScreenToComponents(multi, resolver, {} as Application)

    expect(components.some((c) => c.id === 'irrigationType')).toBe(false)
  })
})
