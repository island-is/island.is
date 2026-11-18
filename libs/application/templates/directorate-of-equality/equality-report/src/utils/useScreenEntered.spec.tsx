import { ReactElement, useCallback, useEffect, useRef } from 'react'
import { render } from '@testing-library/react'
import type {
  BeforeSubmitCallback,
  SetBeforeSubmitCallback,
} from '@island.is/application/types'
import { useScreenEntered } from './useScreenEntered'

// The parts of ui-shell's Screen that decide whether a field's guard survives:
// a map of guards (allowMultiple composes, null clears all) and the effect
// that clears them whenever activeScreenIndex changes, including on mount.
const FakeScreen = ({
  activeScreenIndex,
  guards,
  children,
}: {
  activeScreenIndex: number
  guards: Map<string, BeforeSubmitCallback>
  children: (set: SetBeforeSubmitCallback) => ReactElement | null
}) => {
  const hasGuard = useRef(false)
  const set = useCallback<SetBeforeSubmitCallback>(
    (callback, options) => {
      if (callback === null) {
        guards.clear()
        hasGuard.current = false
        return
      }
      if (!options?.allowMultiple) guards.clear()
      guards.set(options?.customCallbackId ?? 'single', callback)
      hasGuard.current = true
    },
    [guards],
  )
  useEffect(() => {
    if (hasGuard.current) set(null)
  }, [activeScreenIndex, set])
  return children(set)
}

const guard: BeforeSubmitCallback = async () => [false, 'blocked']

const MountOnlyField = ({ set }: { set: SetBeforeSubmitCallback }) => {
  useEffect(() => {
    set(guard, { allowMultiple: true, customCallbackId: 'mountOnly' })
  }, [set])
  return null
}

const EnteredField = ({ set }: { set: SetBeforeSubmitCallback }) => {
  const screenEntered = useScreenEntered()
  useEffect(() => {
    set(guard, { allowMultiple: true, customCallbackId: 'entered' })
  }, [screenEntered, set])
  return null
}

describe('useScreenEntered', () => {
  it('a guard registered only on mount is cleared by the screen', () => {
    const guards = new Map<string, BeforeSubmitCallback>()
    render(
      <FakeScreen activeScreenIndex={0} guards={guards}>
        {(set) => <MountOnlyField set={set} />}
      </FakeScreen>,
    )
    expect(guards.has('mountOnly')).toBe(false)
  })

  it('keeps the guard when the screen first mounts with the field', () => {
    const guards = new Map<string, BeforeSubmitCallback>()
    render(
      <FakeScreen activeScreenIndex={0} guards={guards}>
        {(set) => <EnteredField set={set} />}
      </FakeScreen>,
    )
    expect(guards.has('entered')).toBe(true)
  })

  it('keeps the guard when the field arrives with a screen change', () => {
    const guards = new Map<string, BeforeSubmitCallback>()
    const { rerender } = render(
      <FakeScreen activeScreenIndex={0} guards={guards}>
        {() => null}
      </FakeScreen>,
    )
    rerender(
      <FakeScreen activeScreenIndex={1} guards={guards}>
        {(set) => <EnteredField set={set} />}
      </FakeScreen>,
    )
    expect(guards.has('entered')).toBe(true)
  })
})
