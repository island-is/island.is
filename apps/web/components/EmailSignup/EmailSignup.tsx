import React, { FC } from 'react'
import {
  Columns,
  Column,
  Typography,
  Stack,
  Input,
  Button,
} from '@island.is/island-ui/core'

export interface EmailSignupProps {
  title: string
  description: string
  inputLabel: string
  buttonText: string
}

export const EmailSignup: FC<EmailSignupProps> = ({
  title,
  description,
  inputLabel,
  buttonText,
}) => {
  return (
    <Stack space={4}>
      <div>
        <Typography variant="h3" as="h3" color="blue400">
          {title}
        </Typography>
        <Typography variant="p" as="p">
          {description}
        </Typography>
      </div>
      <Columns alignY="center" space={[2, 2, 8]} collapseBelow="md">
        <Column>
          <Input name="email" label={inputLabel} />
        </Column>
        <Column width="content">
          <Button variant="text">{buttonText}</Button>
        </Column>
      </Columns>
    </Stack>
  )
}

export default EmailSignup
