/* eslint-disable @typescript-eslint/no-explicit-any */
import { CanActivate, Type } from '@nestjs/common'

import { RolesRule } from '@island.is/judicial-system/auth'

export const verifyGuards = (
  controller: object,
  methodName: string | undefined,
  expectedGuards: Type<CanActivate>[],
): void => {
  const targetName = (controller as any).name ?? controller.constructor.name
  const description = methodName
    ? `${targetName}.${methodName}() guards`
    : `${targetName} (class-level) guards`

  const guards: Array<new () => CanActivate> = Reflect.getMetadata(
    '__guards__',
    methodName ? (controller as any).prototype[methodName] : controller,
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
