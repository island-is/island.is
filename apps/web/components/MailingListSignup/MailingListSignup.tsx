import React, { FC } from 'react'
import Background from '../Background/Background'
import { Columns, Column, Typography, Stack, Input, Button } from '@island.is/island-ui/core'

export const MailingListSignup: FC = () => {
  return (
    <Stack space={4}>
      <div>
        <Typography variant="h3" as="h3" color="blue400">
          Vertu með
        </Typography>
        <Typography variant="p" as="p">
          Skráðu þig á póstlista Stafræns Íslands og fylgstu með því nýjasta í
          stafrænni opinberri þjónustu.
        </Typography>
      </div>
      <Columns alignY="center" space={8}>
        <Column>
          <Input name="name" label="Netfang" />
        </Column>
        <Column width="content">
          <Button variant="text">
            Skrá mig á póstlista
          </Button>
        </Column>
      </Columns>
    </Stack>
  )
}

export default MailingListSignup
