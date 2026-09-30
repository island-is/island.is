import { of } from 'rxjs'

import { CanActivate, Controller, Get, UseGuards } from '@nestjs/common'

import { runGuardChain } from './verifyGuardChain'

// The harness decides whether a route's authorization is executed faithfully,
// so a hole in it reads as "no findings" rather than as a failure. These tests
// pin the three ways it could quietly pass a request the route would reject.

class AllowGuard implements CanActivate {
  canActivate() {
    return true
  }
}

class ClassLevelGuard implements CanActivate {
  canActivate() {
    return false
  }
}

class ObservableDenyGuard implements CanActivate {
  canActivate() {
    // canActivate may return an Observable. Awaiting one yields the Observable
    // itself, which is a truthy object - it has to be consumed to see `false`.
    return of(false)
  }
}

class ConfiguredGuard implements CanActivate {
  constructor(private readonly allowed: boolean) {}

  canActivate() {
    return this.allowed
  }
}

class UnsuppliedGuard implements CanActivate {
  canActivate() {
    return true
  }
}

@Controller()
class MethodGuardsController {
  @UseGuards(AllowGuard, ObservableDenyGuard)
  @Get()
  route() {
    return null
  }
}

@Controller()
@UseGuards(ClassLevelGuard)
class ClassGuardsController {
  @UseGuards(AllowGuard)
  @Get()
  route() {
    return null
  }
}

@Controller()
class InstanceGuardsController {
  @UseGuards(AllowGuard, new ConfiguredGuard(false))
  @Get()
  route() {
    return null
  }
}

@Controller()
class UnsuppliedGuardsController {
  @UseGuards(UnsuppliedGuard)
  @Get()
  route() {
    return null
  }
}

describe('runGuardChain', () => {
  it('should consume an Observable result rather than read the Observable as truthy', async () => {
    const then = await runGuardChain(
      MethodGuardsController,
      'route',
      [new AllowGuard(), new ObservableDenyGuard()],
      {},
    )

    expect(then.allowed).toBe(false)
    expect(then.rejectedBy).toBe(ObservableDenyGuard.name)
  })

  it('should run controller-level guards before method-level ones', async () => {
    const then = await runGuardChain(
      ClassGuardsController,
      'route',
      [new ClassLevelGuard(), new AllowGuard()],
      {},
    )

    // Rejected by the class-level guard, so the method-level chain never ran.
    expect(then.allowed).toBe(false)
    expect(then.rejectedBy).toBe(ClassLevelGuard.name)
  })

  it('should run a guard declared as a configured instance', async () => {
    // `new ConfiguredGuard(false)` carries its own configuration, so the caller
    // supplies nothing for it - and `instanceof` against it would throw.
    const then = await runGuardChain(
      InstanceGuardsController,
      'route',
      [new AllowGuard()],
      {},
    )

    expect(then.allowed).toBe(false)
    expect(then.rejectedBy).toBe(ConfiguredGuard.name)
  })

  it('should refuse to run a chain with a guard the caller did not supply', async () => {
    await expect(
      runGuardChain(UnsuppliedGuardsController, 'route', [], {}),
    ).rejects.toThrow('No instance supplied for UnsuppliedGuard')
  })
})
