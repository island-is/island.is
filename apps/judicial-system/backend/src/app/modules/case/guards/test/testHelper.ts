/* eslint-disable @typescript-eslint/no-explicit-any */
import { CanActivate, Type } from '@nestjs/common'

import { RolesRule } from '@island.is/judicial-system/auth'

/**
 * Helper function to test guards applied to a controller method or class.
 *
 * @param target - The controller class or its prototype
 * @param methodName - Optional method name to get guards from a specific method
 * @param expectedGuards - Array of guard classes in expected order
 */
export const testGuards = (
  target: object,
  methodName: string | undefined,
  expectedGuards: Type<CanActivate>[],
): void => {
  const targetName = (target as any).name ?? target.constructor.name
  const description = methodName
    ? `${targetName}.${methodName}() guards`
    : `${targetName} (class-level) guards`

  const guards: Array<new () => CanActivate> = Reflect.getMetadata(
    '__guards__',
    methodName ? (target as any).prototype[methodName] : target,
  )

  describe(description, () => {
    it('should have the correct number of guards', () => {
      expect(guards).toHaveLength(expectedGuards.length)
    })

    expectedGuards.forEach((ExpectedGuard, index) => {
      describe(`${ExpectedGuard.name}`, () => {
        let guard: CanActivate

        beforeEach(() => {
          guard = new guards[index]()
        })

        it(`should be guard at position ${index + 1}`, () => {
          expect(guard).toBeInstanceOf(ExpectedGuard)
        })
      })
    })
  })
}
/**
 * Helper function to test @RolesRules metadata on a controller method.
 *
 * @param target - The controller class
 * @param methodName - The method name to inspect
 * @param expectedRules - Array of expected rules (e.g., prosecutorRule)
 */

export const testRolesRules = (
  target: object,
  methodName: string,
  expectedRules: RolesRule[],
): void => {
  const controllerName = (target as any).name ?? target.constructor.name
  const description = `${controllerName}.${methodName}() roles-rules`

  const rules: RolesRule[] =
    Reflect.getMetadata('roles-rules', (target as any).prototype[methodName]) ??
    []

  console.log(rules)

  describe(description, () => {
    it('should have the correct number of rules', () => {
      expect(rules).toHaveLength(expectedRules.length)
    })

    it('should include all expected rules', () => {
      expectedRules.forEach((expectedRule) => {
        expect(rules).toContain(expectedRule)
      })
    })
  })
}
