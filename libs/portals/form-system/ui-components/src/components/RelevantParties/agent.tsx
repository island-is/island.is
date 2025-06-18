import { FormSystemApplicant } from '@island.is/api/schema'
import { Input, Stack, Box, Text } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { m, webMessages } from '../../lib/messages'
import { NationalIdField } from './components/nationalIdField'

interface Props {
  applicantType: FormSystemApplicant
  lang: 'is' | 'en'
}

// TODO: Implementation is still a WIP, still missing an endpoint 
export const Agent = ({ applicantType, lang }: Props) => {
  const { formatMessage } = useIntl()

  return (
    <Box marginTop={4}>
      <Text variant="h2" as="h2" marginBottom={3}>
        {applicantType?.name?.[lang]}
      </Text>
      <Stack space={2}>
        <NationalIdField disabled={false} />
        <Input
          label={formatMessage(m.address)}
          name="address"
          placeholder={formatMessage(m.address)}
          backgroundColor="blue"
          required={true}
        />
        {/* TODO: This should be a dropdown menu */}
        <Input
          label={formatMessage(webMessages.postalCode)}
          name="postalCode"
          placeholder={formatMessage(webMessages.postalCode)}
          backgroundColor="blue"
          required={true}
        />
        <Input
          label={formatMessage(m.email)}
          name="email"
          placeholder={formatMessage(m.email)}
          backgroundColor="blue"
          required={true}
        />
        <Input
          label={formatMessage(m.phoneNumber)}
          name="phone"
          placeholder={formatMessage(m.phoneNumber)}
          backgroundColor="blue"
          required={true}
        />
      </Stack>
    </Box>
  )
}
