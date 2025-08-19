import { FormSystemApplicant } from '@island.is/api/schema'
import { NationalIdField } from './components/nationalIdField'
import { Input, Stack, Box, Text } from '@island.is/island-ui/core'
import { m, webMessages } from '../../lib/messages'
import { useIntl } from 'react-intl'

interface Props {
  applicantType: FormSystemApplicant
  lang: 'is' | 'en'
}

export const LegalEntity = ({ applicantType, lang }: Props) => {
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
        />
        <Input
          label={formatMessage(webMessages.postalCode)}
          name="postalCode"
          placeholder={formatMessage(webMessages.postalCode)}
          backgroundColor="blue"
        />
      </Stack>
    </Box>
  )
}
