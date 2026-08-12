import { act, renderHook } from '@testing-library/react'

import useDebouncedField from './index'

const DELAY = 500

describe('useDebouncedField', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const advance = (ms: number) => act(() => jest.advanceTimersByTime(ms))

  describe('debouncing', () => {
    it('should save once with the last value after a burst of changes', () => {
      const onSave = jest.fn()
      const { result } = renderHook(() =>
        useDebouncedField({ value: '', onSave }),
      )

      act(() => result.current.onChange('a'))
      act(() => result.current.onChange('ab'))
      act(() => result.current.onChange('abc'))

      expect(onSave).not.toHaveBeenCalled()

      advance(DELAY)

      expect(onSave).toHaveBeenCalledTimes(1)
      expect(onSave).toHaveBeenCalledWith('abc')
    })

    it('should not save before the delay has elapsed', () => {
      const onSave = jest.fn()
      const { result } = renderHook(() =>
        useDebouncedField({ value: '', onSave }),
      )

      act(() => result.current.onChange('abc'))
      advance(DELAY - 1)

      expect(onSave).not.toHaveBeenCalled()
    })

    it('should honour a custom delay', () => {
      const onSave = jest.fn()
      const { result } = renderHook(() =>
        useDebouncedField({ value: '', onSave, delay: 1000 }),
      )

      act(() => result.current.onChange('abc'))
      advance(DELAY)

      expect(onSave).not.toHaveBeenCalled()

      advance(DELAY)

      expect(onSave).toHaveBeenCalledWith('abc')
    })

    it('should call onChange on every keystroke but onSave only once', () => {
      const onChange = jest.fn()
      const onSave = jest.fn()
      const { result } = renderHook(() =>
        useDebouncedField({ value: '', onSave, onChange }),
      )

      act(() => result.current.onChange('a'))
      act(() => result.current.onChange('ab'))

      expect(onChange).toHaveBeenCalledTimes(2)
      expect(onChange).toHaveBeenNthCalledWith(1, 'a')
      expect(onChange).toHaveBeenNthCalledWith(2, 'ab')
      expect(onSave).not.toHaveBeenCalled()

      advance(DELAY)

      expect(onSave).toHaveBeenCalledTimes(1)
    })

    it('should not save when disabled', () => {
      const onSave = jest.fn()
      const { result } = renderHook(() =>
        useDebouncedField({ value: '', onSave, disabled: true }),
      )

      act(() => result.current.onChange('abc'))
      advance(DELAY)

      expect(onSave).not.toHaveBeenCalled()
    })
  })

  describe('clearing a field', () => {
    it('should persist an empty value when the field has no validations', () => {
      const onSave = jest.fn()
      const { result } = renderHook(() =>
        useDebouncedField({ value: 'Jón', onSave }),
      )

      act(() => result.current.onChange(''))
      advance(DELAY)

      expect(onSave).toHaveBeenCalledWith('')
    })

    it('should not persist an empty value for a required field, and should set an error message', () => {
      const onSave = jest.fn()
      const { result } = renderHook(() =>
        useDebouncedField({ value: 'Jón', onSave, validations: ['empty'] }),
      )

      act(() => result.current.onChange(''))
      advance(DELAY)

      expect(onSave).not.toHaveBeenCalled()
      expect(result.current.errorMessage).not.toBe('')
      expect(result.current.hasError).toBe(true)
    })
  })

  describe('flushing', () => {
    it('should save a pending edit on unmount', () => {
      const onSave = jest.fn()
      const { result, unmount } = renderHook(() =>
        useDebouncedField({ value: '', onSave }),
      )

      act(() => result.current.onChange('abc'))
      expect(onSave).not.toHaveBeenCalled()

      unmount()

      expect(onSave).toHaveBeenCalledTimes(1)
      expect(onSave).toHaveBeenCalledWith('abc')
    })

    it('should save immediately on blur, and not save again when the timer elapses', () => {
      const onSave = jest.fn()
      const { result } = renderHook(() =>
        useDebouncedField({ value: '', onSave }),
      )

      act(() => result.current.onChange('abc'))
      act(() => result.current.onBlur())

      expect(onSave).toHaveBeenCalledTimes(1)
      expect(onSave).toHaveBeenCalledWith('abc')

      advance(DELAY)

      expect(onSave).toHaveBeenCalledTimes(1)
    })

    it('should not save on blur when the user has not edited', () => {
      const onSave = jest.fn()
      const { result } = renderHook(() =>
        useDebouncedField({ value: 'Jón', onSave, validations: ['empty'] }),
      )

      act(() => result.current.onBlur())

      expect(onSave).not.toHaveBeenCalled()
      expect(result.current.errorMessage).toBe('')
    })

    it('should still validate on blur when nothing is pending', () => {
      const onSave = jest.fn()
      const { result } = renderHook(() =>
        useDebouncedField({ value: '', onSave, validations: ['empty'] }),
      )

      act(() => result.current.onBlur())

      expect(onSave).not.toHaveBeenCalled()
      expect(result.current.hasError).toBe(true)
    })

    it('should save a pending edit when flush is called explicitly', () => {
      const onSave = jest.fn()
      const { result } = renderHook(() =>
        useDebouncedField({ value: '', onSave }),
      )

      act(() => result.current.onChange('abc'))
      act(() => result.current.flush())

      expect(onSave).toHaveBeenCalledWith('abc')
    })
  })

  describe('following the persisted value', () => {
    it('should adopt a new persisted value before the user has edited', () => {
      const { result, rerender } = renderHook(
        ({ value }: { value: string }) =>
          useDebouncedField({ value, onSave: jest.fn() }),
        { initialProps: { value: '' } },
      )

      expect(result.current.value).toBe('')

      rerender({ value: 'autofilled' })

      expect(result.current.value).toBe('autofilled')
    })

    it('should ignore a new persisted value once the user has edited', () => {
      const { result, rerender } = renderHook(
        ({ value }: { value: string }) =>
          useDebouncedField({ value, onSave: jest.fn() }),
        { initialProps: { value: '' } },
      )

      act(() => result.current.onChange('typed by the user'))

      rerender({ value: 'echoed by the server' })

      expect(result.current.value).toBe('typed by the user')
    })

    it('should treat a nullish persisted value as an empty string', () => {
      const { result } = renderHook(() =>
        useDebouncedField({ value: null, onSave: jest.fn() }),
      )

      expect(result.current.value).toBe('')
    })
  })

  describe('resetKey', () => {
    it('should re-adopt the persisted value and clear the error when the entity changes', () => {
      const { result, rerender } = renderHook(
        ({ value, resetKey }: { value: string; resetKey: string }) =>
          useDebouncedField({
            value,
            resetKey,
            onSave: jest.fn(),
            validations: ['empty'],
          }),
        { initialProps: { value: 'first', resetKey: 'defendant-1' } },
      )

      act(() => result.current.onChange(''))
      advance(DELAY)

      expect(result.current.value).toBe('')
      expect(result.current.hasError).toBe(true)

      rerender({ value: 'second', resetKey: 'defendant-2' })

      expect(result.current.value).toBe('second')
      expect(result.current.hasError).toBe(false)
    })

    it('should still save a pending edit to the previous entity', () => {
      const firstOnSave = jest.fn()
      const secondOnSave = jest.fn()

      const { result, rerender } = renderHook(
        ({
          value,
          resetKey,
          onSave,
        }: {
          value: string
          resetKey: string
          onSave: (value: string) => void
        }) => useDebouncedField({ value, resetKey, onSave }),
        {
          initialProps: {
            value: 'first',
            resetKey: 'defendant-1',
            onSave: firstOnSave,
          },
        },
      )

      act(() => result.current.onChange('edited first'))

      rerender({
        value: 'second',
        resetKey: 'defendant-2',
        onSave: secondOnSave,
      })
      advance(DELAY)

      expect(firstOnSave).toHaveBeenCalledWith('edited first')
      expect(secondOnSave).not.toHaveBeenCalled()
      expect(result.current.value).toBe('second')
    })
  })

  describe('binding the save at schedule time', () => {
    it('should save through the handler that was current when the user typed', () => {
      const firstOnSave = jest.fn()
      const secondOnSave = jest.fn()

      const { result, rerender } = renderHook(
        ({ onSave }: { onSave: (value: string) => void }) =>
          useDebouncedField({ value: '', onSave }),
        { initialProps: { onSave: firstOnSave } },
      )

      act(() => result.current.onChange('typed against the first entity'))

      rerender({ onSave: secondOnSave })
      advance(DELAY)

      expect(firstOnSave).toHaveBeenCalledWith('typed against the first entity')
      expect(secondOnSave).not.toHaveBeenCalled()
    })
  })

  describe('tabs', () => {
    it('should replace tabs before both the optimistic update and the save', () => {
      const onChange = jest.fn()
      const onSave = jest.fn()
      const { result } = renderHook(() =>
        useDebouncedField({ value: '', onSave, onChange }),
      )

      act(() => result.current.onChange('a\tb'))
      advance(DELAY)

      expect(onChange).toHaveBeenCalledWith('a b')
      expect(onSave).toHaveBeenCalledWith('a b')
      expect(result.current.value).toBe('a b')
    })
  })

  describe('error messages', () => {
    it('should clear the error message once the value becomes valid', () => {
      const { result } = renderHook(() =>
        useDebouncedField({
          value: 'Jón',
          onSave: jest.fn(),
          validations: ['empty'],
        }),
      )

      act(() => result.current.onChange(''))
      advance(DELAY)

      expect(result.current.hasError).toBe(true)

      act(() => result.current.onChange('Jóna'))

      expect(result.current.errorMessage).toBe('')
      expect(result.current.hasError).toBe(false)
    })
  })
})
