/* eslint-disable @typescript-eslint/no-explicit-any */
import { isObservable, lastValueFrom } from 'rxjs'

import { CanActivate, ExecutionContext, Type } from '@nestjs/common'

type DeclaredGuard = Type<CanActivate> | CanActivate

/**
 * The result of running a route's guard chain. `rejectedBy` names the guard
 * that stopped the chain - a test that can only say "the chain failed" cannot
 * diagnose an ordering bug, which is the whole reason this helper exists.
 */
export interface GuardChainOutcome {
  allowed: boolean
  rejectedBy?: string
  error?: Error
}

const readDeclaredGuards = (target: unknown): DeclaredGuard[] =>
  Reflect.getMetadata('__guards__', target as object) ?? []

// `@UseGuards()` takes either a class, which Nest instantiates through the
// injector, or a ready-made instance - this codebase declares both, e.g.
// `@UseGuards(RolesGuard, CaseExistsGuard, new CaseTypeGuard(indictmentCases))`.
const isGuardClass = (declared: DeclaredGuard): declared is Type<CanActivate> =>
  typeof declared === 'function'

/**
 * Runs the guards a route actually declares, in the order Nest runs them, and
 * reports whether the request gets through and which guard stopped it.
 *
 * This complements `verifyGuards`, which asserts the declared order without
 * ever calling `canActivate`. That makes it a change-detector: it agrees with
 * whatever is written down. It agreed with the reversed chain that would have
 * rejected every prosecutor transition with a 403, because guards do not run
 * in controller unit tests either. This helper runs them.
 *
 * Three details make it faithful rather than a re-implementation of the route:
 *
 * - The chain is read from `__guards__` metadata on the controller class and
 *   on the method, class-level first, which is the order Nest applies them in.
 *   So the test is tied to the real declaration rather than to a list retyped
 *   in the spec, and a class-level guard cannot be silently skipped.
 * - The execution context's `getHandler()` returns the real controller method,
 *   so `RolesGuard` finds the route's roles rules through the `Reflector` -
 *   without that it would find none, deny everything, and prove nothing.
 * - `canActivate` may return `boolean`, `Promise<boolean>` or
 *   `Observable<boolean>`, and an awaited Observable is a truthy object rather
 *   than its value. Observables are consumed, as Nest's `GuardsConsumer` does.
 *
 * Instances for guards declared *as classes* are supplied by the caller, one
 * per declared class, so that dependency injection stays explicit at the call
 * site. A guard added to the route without being added to the test throws here
 * rather than being silently skipped. Guards declared as instances carry their
 * own configuration and need nothing from the caller.
 */
export const runGuardChain = async (
  controller: Type<unknown>,
  methodName: string,
  guardInstances: CanActivate[],
  request: unknown,
): Promise<GuardChainOutcome> => {
  const handler = (controller as any).prototype[methodName]

  if (!handler) {
    throw new Error(`${controller.name} has no method ${methodName}()`)
  }

  // Nest runs controller-level guards before method-level ones.
  const declaredGuards = [
    ...readDeclaredGuards(controller),
    ...readDeclaredGuards(handler),
  ]

  if (declaredGuards.length === 0) {
    throw new Error(
      `${controller.name}.${methodName}() declares no guards - there is no chain to run`,
    )
  }

  const chain = declaredGuards.map((declaredGuard) => {
    if (!isGuardClass(declaredGuard)) {
      return {
        name: declaredGuard.constructor.name,
        instance: declaredGuard,
      }
    }

    const instance = guardInstances.find((g) => g instanceof declaredGuard)

    if (!instance) {
      throw new Error(
        `No instance supplied for ${declaredGuard.name}, declared on ${controller.name}.${methodName}()`,
      )
    }

    return { name: declaredGuard.name, instance }
  })

  const context = {
    getHandler: () => handler,
    getClass: () => controller,
    getType: () => 'http',
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext

  for (const { name, instance } of chain) {
    try {
      const result = instance.canActivate(context)
      const allowed = isObservable(result)
        ? await lastValueFrom(result)
        : await result

      if (!allowed) {
        return { allowed: false, rejectedBy: name }
      }
    } catch (error) {
      return { allowed: false, rejectedBy: name, error: error as Error }
    }
  }

  return { allowed: true }
}
