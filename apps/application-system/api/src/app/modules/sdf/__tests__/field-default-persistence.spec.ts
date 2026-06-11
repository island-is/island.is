import { expr } from '@island.is/application/core'
import {
  Application,
  FieldTypes,
  FormItemTypes,
  FormValue,
} from '@island.is/application/types'
import type { FormScreen } from '@island.is/application/screen-compiler'

import { applyResolvedFieldDefaults } from '../field-default-persistence'

const makeApplication = (over: Partial<Application> = {}): Application =>
  ({
    id: 'app-1',
    answers: {},
    externalData: {},
    ...over,
  } as unknown as Application)

// Minimal multiField page screen carrying the given fields.
const page = (children: unknown[]): FormScreen =>
  ({
    type: FormItemTypes.MULTI_FIELD,
    isNavigable: true,
    children,
  } as unknown as FormScreen)

describe('applyResolvedFieldDefaults', () => {
  it('seeds a static text default when the answer is absent', () => {
    const merged: FormValue = {}
    applyResolvedFieldDefaults(
      page([
        { id: 'foo', type: FieldTypes.TEXT, isNavigable: true, defaultValue: 'bar' },
      ]),
      merged,
      makeApplication(),
      'is',
    )
    expect(merged.foo).toBe('bar')
  })

  it('resolves a function default from external data into a nested id', () => {
    const merged: FormValue = {}
    const application = makeApplication({
      externalData: {
        nationalRegistry: { data: { fullName: 'Jón Jónsson' } },
      } as unknown as Application['externalData'],
    })
    applyResolvedFieldDefaults(
      page([
        {
          id: 'applicant.name',
          type: FieldTypes.TEXT,
          isNavigable: true,
          defaultValue: (app: Application) =>
            (
              app.externalData as unknown as {
                nationalRegistry?: { data?: { fullName?: string } }
              }
            )?.nationalRegistry?.data?.fullName ?? '',
        },
      ]),
      merged,
      application,
      'is',
    )
    expect(merged).toEqual({ applicant: { name: 'Jón Jónsson' } })
  })

  it('never overwrites an existing user answer', () => {
    const merged: FormValue = { foo: 'user-typed' }
    applyResolvedFieldDefaults(
      page([
        {
          id: 'foo',
          type: FieldTypes.TEXT,
          isNavigable: true,
          defaultValue: 'default',
        },
      ]),
      merged,
      makeApplication(),
      'is',
    )
    expect(merged.foo).toBe('user-typed')
  })

  it('excludes DISPLAY fields even if they carry a default', () => {
    const merged: FormValue = {}
    applyResolvedFieldDefaults(
      page([
        {
          id: 'computed',
          type: FieldTypes.DISPLAY,
          isNavigable: true,
          defaultValue: '12345',
        },
      ]),
      merged,
      makeApplication(),
      'is',
    )
    expect(merged.computed).toBeUndefined()
  })

  it('skips a field hidden by clientShowWhen', () => {
    const merged: FormValue = { trigger: 'no' }
    applyResolvedFieldDefaults(
      page([
        {
          id: 'conditional',
          type: FieldTypes.TEXT,
          isNavigable: true,
          defaultValue: 'seed',
          clientShowWhen: expr.equals(expr.get('trigger'), 'yes'),
        },
      ]),
      merged,
      makeApplication(),
      'is',
    )
    expect(merged.conditional).toBeUndefined()
  })

  it('seeds a field shown by clientShowWhen', () => {
    const merged: FormValue = { trigger: 'yes' }
    applyResolvedFieldDefaults(
      page([
        {
          id: 'conditional',
          type: FieldTypes.TEXT,
          isNavigable: true,
          defaultValue: 'seed',
          clientShowWhen: expr.equals(expr.get('trigger'), 'yes'),
        },
      ]),
      merged,
      makeApplication(),
      'is',
    )
    expect(merged.conditional).toBe('seed')
  })

  it('skips fields hidden by a server condition (isNavigable === false)', () => {
    const merged: FormValue = {}
    applyResolvedFieldDefaults(
      page([
        { id: 'hidden', type: FieldTypes.TEXT, isNavigable: false, defaultValue: 'x' },
      ]),
      merged,
      makeApplication(),
      'is',
    )
    expect(merged.hidden).toBeUndefined()
  })

  it('is a no-op for external-data-provider screens', () => {
    const merged: FormValue = {}
    const screen = {
      type: FormItemTypes.EXTERNAL_DATA_PROVIDER,
      isNavigable: true,
    } as unknown as FormScreen
    expect(
      applyResolvedFieldDefaults(screen, merged, makeApplication(), 'is'),
    ).toBe(merged)
    expect(Object.keys(merged)).toHaveLength(0)
  })

  it('resolves externalData defaults from a Sequelize-like model (getter attrs + toJSON)', () => {
    const merged: FormValue = {}
    // Mimic a Sequelize model: real data is only reachable via `toJSON()`, not as
    // own-enumerable properties — so a plain object spread of the model drops
    // `externalData`. The helper must normalize via `toJSON` before resolving
    // closures, otherwise the externalData-derived default resolves to empty.
    const dataValues = {
      id: 'app-1',
      answers: {},
      externalData: { userProfile: { data: { email: 'a@b.is' } } },
    }
    const model = { toJSON: () => dataValues } as unknown as Application

    applyResolvedFieldDefaults(
      page([
        {
          id: 'applicant.email',
          type: FieldTypes.EMAIL,
          isNavigable: true,
          defaultValue: (app: Application) =>
            (
              app.externalData as unknown as {
                userProfile?: { data?: { email?: string } }
              }
            )?.userProfile?.data?.email ?? '',
        },
      ]),
      merged,
      model,
      'is',
    )
    expect(merged).toEqual({ applicant: { email: 'a@b.is' } })
  })

  it('treats a throwing default closure as no default', () => {
    const merged: FormValue = {}
    applyResolvedFieldDefaults(
      page([
        {
          id: 'boom',
          type: FieldTypes.TEXT,
          isNavigable: true,
          defaultValue: () => {
            throw new Error('x')
          },
        },
      ]),
      merged,
      makeApplication(),
      'is',
    )
    expect(merged.boom).toBeUndefined()
  })
})
