/* eslint-disable @typescript-eslint/no-explicit-any */
import { CanActivate, Type } from '@nestjs/common'

import { RolesRule } from '@island.is/judicial-system/auth'

export const verifyGuards = (
  controller: object,
  methodName: string | undefined,
  expectedGuards: Type<CanActivate>[], // verify defined guards and order
  expectedGuardProps?: { guard: Type<CanActivate>; prop: any }[], // verify specific guard properties
): void => {
  const targetName = (controller as any).name ?? controller.constructor.name
  const description = methodName
    ? `${targetName}.${methodName}() guards`
    : `${targetName} (class-level) guards`

  const guards: Array<new () => CanActivate> =
    Reflect.getMetadata(
      '__guards__',
      methodName ? (controller as any).prototype[methodName] : controller,
    ) ?? []

  const guardInstances = guards.map((g) =>
    typeof g === 'function' && (g as any).prototype
      ? new (g as new () => CanActivate)()
      : (g as unknown as CanActivate),
  )

  describe(description, () => {
    it('should have the correct number of guards', () => {
      expect(guards).toHaveLength(expectedGuards.length)
    })

    expectedGuards.forEach((expectedGuard, index) => {
      describe(`${expectedGuard.name}`, () => {
        // eslint-disable-next-line @typescript-eslint/ban-types
        let guard: CanActivate | Function

        beforeEach(() => {
          const g = guards[index]
          if (typeof g === 'function' && g.prototype) {
            guard = new guards[index]()
          } else {
            guard = g
          }
        })

        it(`should be guard at position ${index + 1}`, () => {
          expect(guard).toBeInstanceOf(expectedGuard)
        })
      })
    })

    expectedGuardProps?.forEach(
      ({ guard: expectedGuard, prop: expectedProp }) => {
        describe(`${expectedGuard.name}`, () => {
          const targetGuard = guardInstances.find(
            (g) => g instanceof expectedGuard,
          )
          it(`should include guard properties`, () => {
            expect(targetGuard).toBeDefined()
            expect(targetGuard).toMatchObject(expectedProp)
          })
        })
      },
    )
  })
}

export const verifyRolesRules = (
  controller: object,
  methodName: string,
  expectedRules: RolesRule[],
): void => {
  const controllerName = (controller as any).name ?? controller.constructor.name
  const description = `${controllerName}.${methodName}() roles-rules`

  const rules: RolesRule[] =
    Reflect.getMetadata(
      'roles-rules',
      (controller as any).prototype[methodName],
    ) ?? []

  describe(description, () => {
    it('should have the correct number of rules', () => {
      expect(rules).toHaveLength(expectedRules.length)
    })

    it('should match the expected rules', () => {
      expect(rules).toEqual(expectedRules)
    })
  })
}
