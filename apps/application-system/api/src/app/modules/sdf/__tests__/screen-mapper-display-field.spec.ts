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

const makeDisplayChild = (
  id: string,
  extra: Record<string, unknown>,
) => ({
  id,
  type: FieldTypes.DISPLAY,
  component: 'DisplayFormField',
  title: `${id}-title`,
  isNavigable: true,
  sectionIndex: 0,
  subSectionIndex: 0,
  ...extra,
})

describe('mapScreenToComponents — display field parity props', () => {
  it('maps variant, titleVariant, halfWidthOwnline, suffix, rightAlign, and inline input label', () => {
    const answers = { sourceNumber: 1000 }
    const screen = {
      type: FormItemTypes.MULTI_FIELD,
      id: 'page1',
      title: 'Display Fields',
      sectionIndex: 0,
      subSectionIndex: 0,
      isNavigable: true,
      children: [
        makeDisplayChild('displayField', {
          width: 'half',
          variant: 'currency',
          rightAlign: true,
          titleVariant: 'h4',
          halfWidthOwnline: true,
          label: 'ISK',
          suffix: ' kr.',
          value: (vals: { sourceNumber?: number }) =>
            String((vals?.sourceNumber ?? 0) * 2),
        }),
        makeDisplayChild('displayField2', {
          variant: 'number',
          suffix: ' pts',
          value: () => '42',
        }),
      ],
    } as unknown as MultiFieldScreen

    const app = { answers, externalData: {} } as unknown as Application

    const components = mapScreenToComponents(screen, stubResolver, app)

    const byId = (id: string) => components.find((c) => c.id === id)

    const df1 = byId('displayField')
    expect(df1?.width).toBe('HALF')
    expect(df1?.inputVariant).toBe('currency')
    expect(df1?.rightAlign).toBe(true)
    expect(df1?.titleVariant).toBe('h4')
    expect(df1?.halfWidthOwnline).toBe(true)
    expect(df1?.displayInputLabel).toBe('ISK')
    expect(df1?.textSuffix).toBe(' kr.')
    expect(df1?.value).toBe('2000')

    const df2 = byId('displayField2')
    expect(df2?.inputVariant).toBe('number')
    expect(df2?.textSuffix).toBe(' pts')
    expect(df2?.halfWidthOwnline).toBeUndefined()
    expect(df2?.rightAlign).toBeUndefined()
    expect(df2?.value).toBe('42')
  })

  it('recomputes value reactively when merged answers change (mirrors computeDisplayValues)', () => {
    // Mirrors the example-inputs displayFieldSubsection.ts `displayField`
    // closure: Sum of inputs 1, 2, and 3. The same closure is invoked by
    // `AstAdapterService.computeDisplayValues` during VALIDATE; re-running the
    // mapper with different `application.answers` is a high-fidelity proxy
    // for the reactive recompute path.
    const screen = {
      type: FormItemTypes.MULTI_FIELD,
      id: 'page1',
      title: 'Display Fields',
      sectionIndex: 0,
      subSectionIndex: 0,
      isNavigable: true,
      children: [
        makeDisplayChild('displayField', {
          variant: 'currency',
          rightAlign: true,
          label: 'Sum of inputs 1, 2 and 3',
          value: (answers: Record<string, string | undefined>) => {
            const v1 = Number(answers?.input1 ?? 0)
            const v2 = Number(answers?.input2 ?? 0)
            const v3 = Number(answers?.input3 ?? 0)
            return `${v1 + v2 + v3}`
          },
        }),
        makeDisplayChild('displayField2', {
          variant: 'currency',
          rightAlign: true,
          value: (answers: Record<string, string | undefined>) => {
            const v4 = Number(answers?.input4 ?? 0)
            const v5 = answers?.radioFieldForDisplayField
            if (!v4 || !v5) return ''
            if (v5 === 'other') return 'Önnur upphæð'
            return `${v4 * Number(v5)}`
          },
        }),
      ],
    } as unknown as MultiFieldScreen

    const runWithAnswers = (answers: Record<string, unknown>) => {
      const app = { answers, externalData: {} } as unknown as Application
      return mapScreenToComponents(screen, stubResolver, app)
    }

    // Initial render — no answers yet
    let out = runWithAnswers({})
    expect(out.find((c) => c.id === 'displayField')?.value).toBe('0')
    expect(out.find((c) => c.id === 'displayField2')?.value).toBe('')

    // After typing inputs 1/2/3
    out = runWithAnswers({ input1: '100', input2: '250', input3: '50' })
    expect(out.find((c) => c.id === 'displayField')?.value).toBe('400')

    // Second display field: needs both input4 and radio pick
    out = runWithAnswers({
      input4: '1000',
      radioFieldForDisplayField: '2',
    })
    expect(out.find((c) => c.id === 'displayField2')?.value).toBe('2000')

    // 'other' radio option short-circuits to the static label
    out = runWithAnswers({
      input4: '1000',
      radioFieldForDisplayField: 'other',
    })
    expect(out.find((c) => c.id === 'displayField2')?.value).toBe(
      'Önnur upphæð',
    )
  })
})
