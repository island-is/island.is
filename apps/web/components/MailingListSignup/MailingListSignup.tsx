import React, { FC } from 'react'
import {
  Columns,
  Column,
  Typography,
  Stack,
  Input,
  Button,
} from '@island.is/island-ui/core'
import { MailingListSignupSlice } from '@island.is/api/schema'

export const MailingListSignup: FC<MailingListSignupSlice> = ({
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

export default MailingListSignup
