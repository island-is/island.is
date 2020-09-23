import React from 'react'
import Typography from '../Typography/Typography'
import Input from '../Input/Input'
import { Button } from '../Button/Button'

import * as styles from './NewsletterSignup.treat'
import { Box } from '../Box'

type ColorVariant = 'white' | 'blue'
type State = 'default' | 'error' | 'success'

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
  onChange: (bla: any) => void
  value: string
}

const NewsletterSignup: React.FC<Props> = ({
  heading,
  text,
  id = 'newsletter',
  placeholder,
  label,
  buttonText,
  variant = 'white',
  state = 'default',
  onChange,
  value,
  errorMessage,
}) => {
  return (
    <Box className={styles.variants[variant]} paddingY={[4, 6, 8]}>
      <Typography variant="h3" as="h3" color="blue400" paddingBottom={1}>
        {heading}
      </Typography>
      <Typography variant="p" paddingBottom={3}>
        {text}
      </Typography>
      <Box display="flex">
        <Box className={styles.inputWrap}>
          <Input
            id={id}
            name={id}
            value={value}
            placeholder={placeholder}
            label={label}
            backgroundColor={variant === 'white' ? 'blue' : 'white'}
            hasError={state === 'error'}
            errorMessage={errorMessage}
            onChange={onChange}
          />
        </Box>
        <Box
          className={styles.buttonWrap}
          paddingTop={1}
          marginLeft={[4, 4, 8]}
        >
          <Button variant="text" htmlType="submit">
            {buttonText}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default NewsletterSignup
