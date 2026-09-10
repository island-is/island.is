import { act, render, renderHook, screen } from '@testing-library/react'
import { PropsWithChildren } from 'react'
import {
  FormProvider,
  useForm,
  useFormContext,
  UseFormReturn,
  useWatch,
} from 'react-hook-form'
import type { SubCriterionStep } from '../../utils/types'
import { parseStepCount, useStepCountSync } from './useStepCountSync'

type Values = { sc: { stepCount: string; steps: SubCriterionStep[] } }

const stepsOf = (count: number): SubCriterionStep[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `s${i + 1}`,
    description: `skilgreining ${i + 1}`,
  }))

// Mirrors the shape SubCriteriaEditor seeds: one sub-criterion under `sc`, its
// steps already carrying the ids the draft handed back.
const setup = (stepCount: number) => {
  let form: UseFormReturn<Values> | undefined
  const Wrapper = ({ children }: PropsWithChildren) => {
    form = useForm<Values>({
      defaultValues: {
        sc: { stepCount: String(stepCount), steps: stepsOf(stepCount) },
      },
    })
    return <FormProvider {...form}>{children}</FormProvider>
  }

  const { result } = renderHook(() => useStepCountSync('sc'), {
    wrapper: Wrapper,
  })

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const methods = () => form!

  return {
    result,
    // Typing into "Fjöldi þrepa" writes the raw string on every keystroke.
    type: (...values: string[]) =>
      values.forEach((value) =>
        act(() => {
          methods().setValue('sc.stepCount', value)
        }),
      ),
    steps: () => methods().getValues('sc.steps'),
    // What applyCatalogEntry does, in its order and in one event: forget the
    // parked tail, then replace both the count and the list with the
    // template's own steps.
    applyTemplate: (count: number) =>
      act(() => {
        result.current.forgetTrimmedSteps()
        methods().setValue('sc.stepCount', String(count))
        methods().setValue(
          'sc.steps',
          Array.from({ length: count }, (_, i) => ({
            id: `t${i + 1}`,
            description: `sniðmát ${i + 1}`,
          })),
        )
      }),
  }
}

const idsOf = (steps: SubCriterionStep[]) => steps.map((s) => s.id)
const descriptionsOf = (steps: SubCriterionStep[]) =>
  steps.map((s) => s.description)

describe('parseStepCount', () => {
  it.each(['2', '8', ' 4 '])('accepts the in-range integer %p', (raw) => {
    expect(parseStepCount(raw)).toBe(Number(raw.trim()))
  })

  it.each(['', '   ', '0', '1', '9', '20', '4.5', 'x', '-3'])(
    'rejects %p',
    (raw) => {
      expect(parseStepCount(raw)).toBeUndefined()
    },
  )
})

describe('useStepCountSync', () => {
  it('reports the step count the screen loaded with', () => {
    const { result } = setup(5)

    expect(result.current.loadedStepCount).toBe(5)
  })

  it.each([
    ['5', false],
    ['', false],
    ['1', true],
    ['9', true],
    ['x', true],
  ] as const)('flags %p as out of range: %p', (raw, expected) => {
    const { result, type } = setup(5)

    type(raw)

    expect(result.current.isStepCountOutOfRange).toBe(expected)
  })

  it('trims from the end when the count drops', () => {
    const { type, steps } = setup(5)

    type('4')

    expect(idsOf(steps())).toEqual(['s1', 's2', 's3', 's4'])
    expect(descriptionsOf(steps())).toEqual([
      'skilgreining 1',
      'skilgreining 2',
      'skilgreining 3',
      'skilgreining 4',
    ])
  })

  // The reported bug: 5 -> 4 is typed as backspace-then-4, and the blank in
  // between used to collapse the list to two steps and re-grow it out of fresh
  // ids — dropping the definitions for þrep 3 and 4 and every classification
  // that pointed at the old step rows.
  it('survives the blank keystroke between 5 and 4', () => {
    const { type, steps } = setup(5)

    type('', '4')

    expect(idsOf(steps())).toEqual(['s1', 's2', 's3', 's4'])
    expect(descriptionsOf(steps())).toEqual([
      'skilgreining 1',
      'skilgreining 2',
      'skilgreining 3',
      'skilgreining 4',
    ])
  })

  it('leaves the steps untouched while the field is empty', () => {
    const { type, steps } = setup(5)

    type('')

    expect(idsOf(steps())).toEqual(['s1', 's2', 's3', 's4', 's5'])
  })

  it.each(['1', '0', '9', '12', '4.5', 'x'])(
    'ignores the un-actionable value %p',
    (raw) => {
      const { type, steps } = setup(5)

      type(raw)

      expect(idsOf(steps())).toEqual(['s1', 's2', 's3', 's4', 's5'])
    },
  )

  // What the applicant is told hangs on this: the warning offers "raise the
  // count back and nothing changes", which is only true while the trimmed steps
  // are still parked.
  it('reports a plain reduction as restorable', () => {
    const { result, type } = setup(5)

    type('4')

    expect(result.current.canRestoreTrimmedSteps).toBe(true)
  })

  it('reports a shorter catalog template as unrestorable', () => {
    const { result, applyTemplate, steps } = setup(5)

    applyTemplate(3)

    // The template's steps stand, unshortened by the resize effect…
    expect(idsOf(steps())).toEqual(['t1', 't2', 't3'])
    // …and there is nothing parked to put the discarded þrep back.
    expect(result.current.canRestoreTrimmedSteps).toBe(false)
  })

  it('keeps a same-length catalog template out of the warning entirely', () => {
    const { result, applyTemplate, steps } = setup(5)

    applyTemplate(5)

    expect(steps()).toHaveLength(5)
    // Nothing was reduced, so SubCriterionItem never asks about restoring.
    expect(result.current.loadedStepCount).toBe(5)
  })

  it('restores the trimmed steps, ids and all, when the count goes back up', () => {
    const { type, steps } = setup(5)

    type('4', '5')

    expect(idsOf(steps())).toEqual(['s1', 's2', 's3', 's4', 's5'])
    expect(descriptionsOf(steps())).toEqual([
      'skilgreining 1',
      'skilgreining 2',
      'skilgreining 3',
      'skilgreining 4',
      'skilgreining 5',
    ])
  })

  it('restores the parked steps in order across several changes', () => {
    const { type, steps } = setup(6)

    type('2')
    expect(idsOf(steps())).toEqual(['s1', 's2'])

    type('4')
    expect(idsOf(steps())).toEqual(['s1', 's2', 's3', 's4'])

    type('6')
    expect(idsOf(steps())).toEqual(['s1', 's2', 's3', 's4', 's5', 's6'])
    expect(descriptionsOf(steps())).toEqual([
      'skilgreining 1',
      'skilgreining 2',
      'skilgreining 3',
      'skilgreining 4',
      'skilgreining 5',
      'skilgreining 6',
    ])
  })

  it('mints blank steps once the parked ones run out', () => {
    const { type, steps } = setup(3)

    type('2', '5')

    expect(idsOf(steps()).slice(0, 3)).toEqual(['s1', 's2', 's3'])
    expect(steps()).toHaveLength(5)
    expect(descriptionsOf(steps()).slice(3)).toEqual(['', ''])
    // Fresh ids, not a second copy of the ones already in the list.
    expect(new Set(idsOf(steps())).size).toBe(5)
  })

  it('mints blank steps after the parked ones are forgotten', () => {
    const { result, type, steps } = setup(5)

    type('3')
    act(() => result.current.forgetTrimmedSteps())
    type('5')

    expect(idsOf(steps()).slice(0, 3)).toEqual(['s1', 's2', 's3'])
    expect(descriptionsOf(steps()).slice(3)).toEqual(['', ''])
    expect(idsOf(steps())).not.toContain('s4')
    expect(idsOf(steps())).not.toContain('s5')
  })
})

/**
 * The same thing again through registered inputs rather than form values: the
 * definitions the applicant can see are the point, and SubCriterionItem renders
 * one textarea per step keyed by index, so a step list that is silently
 * re-minted shows up here as emptied boxes.
 *
 * Plain `register` inputs stand in for its InputControllers, as in
 * emptyOutlierGroupAnswer.spec.tsx — both resolve an input's initial value out
 * of react-hook-form's `_formValues`.
 */
let setStepCount: ((value: string) => void) | null = null

const StepFields = () => {
  const { register } = useFormContext<Values>()
  useStepCountSync('sc')
  const steps: SubCriterionStep[] = useWatch({ name: 'sc.steps' }) ?? []

  return (
    <div>
      {steps.map((_, index) => (
        <input
          key={index}
          data-testid={`step-${index}`}
          {...register(`sc.steps.${index}.description`)}
        />
      ))}
    </div>
  )
}

const StepsForm = ({ stepCount }: { stepCount: number }) => {
  const form = useForm<Values>({
    defaultValues: {
      sc: { stepCount: String(stepCount), steps: stepsOf(stepCount) },
    },
  })
  setStepCount = (value) => form.setValue('sc.stepCount', value)

  return (
    <FormProvider {...form}>
      <StepFields />
    </FormProvider>
  )
}

const stepInputs = () =>
  screen
    .queryAllByTestId(/^step-/)
    .map((input) => (input as HTMLInputElement).value)

describe('the step definitions on screen', () => {
  it('keeps the definitions of the steps that remain, and brings back the one that returns', () => {
    render(<StepsForm stepCount={5} />)
    expect(stepInputs()).toHaveLength(5)

    // "5" backspaced away, then "4" typed.
    act(() => setStepCount?.(''))
    act(() => setStepCount?.('4'))

    expect(stepInputs()).toEqual([
      'skilgreining 1',
      'skilgreining 2',
      'skilgreining 3',
      'skilgreining 4',
    ])

    // Changed back before leaving the screen.
    act(() => setStepCount?.('5'))

    expect(stepInputs()).toEqual([
      'skilgreining 1',
      'skilgreining 2',
      'skilgreining 3',
      'skilgreining 4',
      'skilgreining 5',
    ])
  })
})
