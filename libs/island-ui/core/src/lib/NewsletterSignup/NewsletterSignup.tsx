import * as React from 'react'
import { Text } from '../Text/Text'
import { Input } from '../Input/Input'
import { Button } from '../Button/Button'

import * as styles from './NewsletterSignup.treat'
import { Box } from '../Box/Box'
import { Hidden } from '../Hidden/Hidden'

type ColorVariant = 'white' | 'blue'
type State = 'default' | 'error' | 'success'

interface MessageProps {
  state: State
  successMessage?: string
  errorMessage?: string
}

const Message = ({ state, successMessage, errorMessage }: MessageProps) => (
  <Text
    variant="eyebrow"
    fontWeight="medium"
    color={
      (state === 'success' && 'blue400') ||
      (state === 'error' && 'red600') ||
      undefined
    }
    paddingTop={1}
  >
    {(state === 'success' && successMessage) ||
      (state === 'error' && errorMessage)}
  </Text>
)

interface Props {
  heading: string
  text: string
  id?: string
  placeholder: string
  label: string
  buttonText: string
  variant?: ColorVariant
  state?: State
  errorMessage?: string
  successMessage?: string
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  onSubmit: (event: React.FormEvent<unknown>) => void
  value: string
}

export const NewsletterSignup: React.FC<Props> = ({
  heading,
  text,
  id = 'newsletter',
  placeholder,
  label,
  buttonText,
  variant = 'white',
  state = 'default',
  onChange,
  onSubmit,
  value,
  errorMessage,
  successMessage,
}) => {
  return (
    <Box className={styles.variants[variant]}>
      <Text variant="h3" as="h3" color="blue400" paddingBottom={1}>
        {heading}
      </Text>
      <Text variant="default" paddingBottom={3}>
        {text}
      </Text>
      <Box display="flex" flexDirection={['column', 'column', 'row']}>
        <Box className={styles.inputWrap}>
          <Input
            id={id}
            name={id}
            value={value}
            placeholder={placeholder}
            label={label}
            type="email"
            hasError={state === 'error'}
            icon={state === 'success' ? 'checkmarkCircle' : undefined}
            onChange={onChange}
          />
          <Hidden above="sm">
            {(state === 'success' || state === 'error') && (
              <Message
                state={state}
                successMessage={successMessage}
                errorMessage={errorMessage}
              />
            )}
          </Hidden>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          className={styles.buttonWrap}
          paddingTop={[3, 2, 0]}
          marginLeft={[0, 0, 8]}
        >
          <Box>
            <Button as="span" onClick={onSubmit} variant="text">
              {buttonText}
            </Button>
          </Box>
        </Box>
      </Box>
      <Hidden below="md">
        {(state === 'success' || state === 'error') && (
          <Message
            state={state}
            successMessage={successMessage}
            errorMessage={errorMessage}
          />
        )}
      </Hidden>
    </Box>
  )
}
