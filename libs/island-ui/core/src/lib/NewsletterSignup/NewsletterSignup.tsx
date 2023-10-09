import * as React from 'react'
import { Text } from '../Text/Text'
import { Input } from '../Input/Input'
import { Button } from '../Button/Button'

import * as styles from './NewsletterSignup.css'
import { Box } from '../Box/Box'
import { Hidden } from '../Hidden/Hidden'
import { AlertMessage } from '../AlertMessage/AlertMessage'

type ColorVariant = 'white' | 'blue'
type State = 'default' | 'error' | 'success'

interface ErrorMessageProps {
  errorMessage?: string
}

const ErrorMessage = ({ errorMessage }: ErrorMessageProps) => (
  <Text variant="eyebrow" fontWeight="medium" color="red600" paddingTop={1}>
    {errorMessage}
  </Text>
)

interface Props {
  heading: string
  text: string
  id?: string
  name?: string
  placeholder: string
  label: string
  buttonText: string
  variant?: ColorVariant
  state?: State
  errorMessage: string
  successTitle: string
  successMessage: string
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  onSubmit: (event: React.FormEvent<unknown>) => void
  value: string
}

export const NewsletterSignup: React.FC<React.PropsWithChildren<Props>> = ({
  heading,
  text,
  id = 'newsletter',
  name = 'newsletter',
  placeholder,
  label,
  buttonText,
  variant = 'white',
  state = 'default',
  onChange,
  onSubmit,
  value,
  errorMessage,
  successTitle,
  successMessage,
}) => {
  return (
    <Box className={styles.variants[variant]}>
      <Text variant="h3" as="h2" color="blue400" paddingBottom={1}>
        {heading}
      </Text>
      {state === 'success' ? (
        <Box className={styles.successBox} marginTop={2}>
          <AlertMessage
            type="success"
            title={successTitle}
            message={successMessage}
          />
        </Box>
      ) : (
        <Box>
          <Text variant="default" paddingBottom={3}>
            {text}
          </Text>
          <Box display="flex" flexDirection={['column', 'column', 'row']}>
            <Box className={styles.inputWrap}>
              <Input
                id={id}
                name={name}
                value={value}
                placeholder={placeholder}
                label={label}
                type="email"
                hasError={state === 'error'}
                onChange={onChange}
              />
              <Hidden above="sm">
                {state === 'error' && (
                  <ErrorMessage errorMessage={errorMessage} />
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
        </Box>
      )}
      <Hidden below="md">
        {state === 'error' && <ErrorMessage errorMessage={errorMessage} />}
      </Hidden>
    </Box>
  )
}
