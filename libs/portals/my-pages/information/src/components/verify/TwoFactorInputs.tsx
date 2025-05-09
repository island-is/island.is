import {
  ChangeEvent,
  ClipboardEvent,
  createRef,
  KeyboardEvent,
  useEffect,
  useState,
} from 'react'

import { useLocale } from '@island.is/localization'
import { validateNumber } from './validate'
import { useEffectOnce } from '@island.is/react-spa/shared'
import { Box, ErrorMessage, Input } from '@island.is/island-ui/core'
import { emailsMsg } from '../../lib/messages'

const inputs = ['char0', 'char1', 'char2']

const keyCodes = {
  KEY_TAB: 'Tab',
  KEY_BACKSPACE: 'Backspace',
  KEY_ARROW_LEFT: 'ArrowLeft',
  KEY_ARROW_RIGHT: 'ArrowRight',
}

/**
 * Max two-factor input index
 */
const MAX_INPUTS_INDEX = 2

type TwoFactorInputProps = {
  onChange(code: string): void
  clearCode?: boolean
  onClearCodeReset?(): void
  disabled?: boolean
  error?: string
}

export const TwoFactorInputs = ({
  onChange,
  clearCode,
  onClearCodeReset,
  disabled = false,
  error,
}: TwoFactorInputProps) => {
  const refs = inputs.map(() => createRef<HTMLInputElement>())
  const { formatMessage } = useLocale()
  const [twoFactorCode, setTwoFactorCode] = useState<string[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  const reset = () => {
    setTwoFactorCode([])
    setActiveIndex(0)

    refs.forEach((ref) => {
      const input = ref?.current

      if (input) {
        input.value = ''
      }
    })

    refs[0]?.current?.focus()

    // Call onClearCodeReset callback to verify that the code has been cleared
    onClearCodeReset?.()
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const code = e.clipboardData.getData('text')

    // Return early if code is not a number
    if (!validateNumber(code)) {
      return
    }

    const codeArr = code.split('')
    let currentCodeArrIndex = 0
    let lastPasteInputIndex = 0

    refs.forEach((ref, inputIndex) => {
      const input = ref?.current

      if (inputIndex >= activeIndex) {
        // Clipboard value for current input
        const value = codeArr[currentCodeArrIndex]

        if (value && input) {
          // Set the clipboard value to the input and update the code array
          input.value = value
          currentCodeArrIndex += 1
          lastPasteInputIndex = inputIndex
        }
      }
    })

    if (lastPasteInputIndex < MAX_INPUTS_INDEX) {
      // Focus the next input if the last pasted input is not the last input
      focusTwoFactorInputByIndex(lastPasteInputIndex + 1)
    } else if (
      lastPasteInputIndex === MAX_INPUTS_INDEX &&
      document.activeElement instanceof HTMLElement
    ) {
      // If the last pasted input is the last input, then remove focus from the code input,
      document.activeElement.blur()
    }

    setTwoFactorCode(codeArr)
  }

  useEffect(() => {
    onChange(twoFactorCode.join(''))
  }, [onChange, twoFactorCode])

  /**
   * Handles two-factor input change events
   *
   * - Makes sure that only numbers are allowed
   * - Updates two-factor code state
   * - Focuses next input if the current input is not the last input
   */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = e.target
    const currentIndex = refs.findIndex((ref) => ref.current === e.target)
    const inputRef = refs[currentIndex]?.current

    if (!validateNumber(value) && inputRef) {
      inputRef.value = ''
      updateTwoFactorCode('', currentIndex)

      return
    }
    updateTwoFactorCode(value, currentIndex)

    if (currentIndex < MAX_INPUTS_INDEX) {
      focusTwoFactorInputByIndex(currentIndex + 1)
    }
  }

  /**
   * Update two-factor code state and calls onChange callback with current code
   */
  const updateTwoFactorCode = (value: string, index: number) => {
    const newTwoFactorCode = [...twoFactorCode]
    newTwoFactorCode[index] = value
    setTwoFactorCode(newTwoFactorCode)
  }

  /**
   * Focus two-factor input by index and sets the active index state
   */
  const focusTwoFactorInputByIndex = (index: number) => {
    const input = refs[index]?.current

    if (input) {
      setActiveIndex(index)
      input.focus()
      inputTextHighlight(input)
    }
  }

  const inputTextHighlight = (input: HTMLInputElement) => {
    // Necessary for input to be selected
    setTimeout(() => {
      input.select()
    }, 0)
  }

  const handleOnClick = (index: number) => {
    setActiveIndex(index)
    focusTwoFactorInputByIndex(index)
  }

  /**
   * Handles two-factor input keydown events
   *
   * - Arrow left: Focus previous input
   * - Arrow right: Focus next input
   * - Backspace: Clear input value and focus previous input
   * - Tab: Focus next input
   * - Shift + Tab: Focus previous input
   * - Updates two-factor code state
   */
  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    switch (e.code) {
      case keyCodes.KEY_ARROW_LEFT: {
        const prevIndex = activeIndex - 1

        if (prevIndex >= 0) {
          focusTwoFactorInputByIndex(prevIndex)
        } else if (activeIndex === 0) {
          const input = refs[0]?.current

          if (input) {
            inputTextHighlight(input)
          }
        }

        break
      }

      case keyCodes.KEY_ARROW_RIGHT: {
        const nextIndex = activeIndex + 1

        if (nextIndex <= MAX_INPUTS_INDEX) {
          focusTwoFactorInputByIndex(nextIndex)
        } else if (activeIndex === MAX_INPUTS_INDEX) {
          // If the first input is active, then blur the input
          const input = refs[refs.length - 1]?.current
          if (input) {
            input.focus()
            inputTextHighlight(input)
          }
        }

        break
      }

      case keyCodes.KEY_BACKSPACE: {
        // Find active input
        const activeInput = refs[activeIndex]?.current

        if (activeInput && activeInput === document.activeElement) {
          const tempValue = activeInput.value

          // Clear value
          activeInput.value = ''
          updateTwoFactorCode('', activeIndex)

          // If the value is not empty, then do nothing
          if (tempValue.length === 1) return

          // Focus previous input
          focusTwoFactorInputByIndex(activeIndex - 1)
        }

        break
      }

      case keyCodes.KEY_TAB: {
        refs.forEach((ref, inputIndex) => {
          const input = ref?.current

          // If the current input is active
          if (input === document.activeElement) {
            // If shift is pressed, then decrease index
            if (e.shiftKey && inputIndex > 0) {
              setActiveIndex(inputIndex - 1)
            } else if (!e.shiftKey && inputIndex < MAX_INPUTS_INDEX) {
              // If shift is not pressed, then next index
              setActiveIndex(inputIndex + 1)
            }
          }
        })

        break
      }

      default: {
        const { value } = e.currentTarget
        const currentIndex = refs.findIndex(
          (ref) => ref.current === e.currentTarget,
        )
        const currentValue = refs[currentIndex]?.current?.value
        const hasSameValue =
          value !== '' && refs[currentIndex]?.current?.value === value

        // Return early
        // - If the key is not a number
        // - If the input value is not the same and the key is a number
        if (
          !validateNumber(e.key) ||
          (validateNumber(e.key) && e.key !== currentValue)
        ) {
          return
        }

        if (hasSameValue && currentIndex < MAX_INPUTS_INDEX) {
          e.preventDefault()
          // We want to stop the event propagation when the input value is the same,
          // to prevent the state and focus from updating twice
          // This is necessary because onChange event is not triggered when the input value is the same.
          e.stopPropagation()
          focusTwoFactorInputByIndex(currentIndex + 1)
        }
        break
      }
    }
  }

  useEffectOnce(() => {
    const firstInput = refs[0]?.current

    if (firstInput) {
      // Set focus to the first input on mount
      firstInput.focus()
    }
  })

  useEffect(() => {
    if (clearCode) {
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearCode])

  return (
    <Box display="flex" justifyContent="center">
      <input
        type="hidden"
        name="code"
        id="code"
        value={twoFactorCode.join('')}
      />
      <Box display="flex" flexDirection="column" alignItems="flexStart">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          columnGap={2}
        >
          {inputs.map((id, index) => (
            <Input
              ref={refs[index]}
              key={id}
              name={id}
              id={id}
              size="md"
              inputMode="numeric"
              type="tel"
              backgroundColor="blue"
              disabled={disabled}
              placeholder=""
              maxLength={1}
              hideIcon
              hasError={!!error}
              onKeyDown={handleKeyDown}
              onChange={handleChange}
              onPaste={handlePaste}
              onClick={() => handleOnClick(index)}
              oneDigit
              aria-label={formatMessage(
                index === 0
                  ? emailsMsg.ariaLabelTwoFactorDigit
                  : emailsMsg.ariaLabelTwoFactorDigitSimple,
                {
                  num: index + 1,
                },
              )}
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
              /* @ts-ignore - These attributes are both valid. Spellcheck defines whether the element may be checked for spelling errors. Autocorrect is a Safari only attribute  */
              spellCheck={false}
              autoCorrect="off"
            />
          ))}
        </Box>
        {error && <ErrorMessage id="two-factor-input">{error}</ErrorMessage>}
      </Box>
    </Box>
  )
}
