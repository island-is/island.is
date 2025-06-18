import { FormSystemApplicant } from '@island.is/api/schema'
import {
  GridColumn,
  GridRow,
  Input,
  Stack,
  Box,
  Text,
} from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { m, webMessages } from '../../lib/messages'
import { NationalIdField } from './components/nationalIdField'

interface Props {
  applicantType: FormSystemApplicant
  lang: 'is' | 'en'
}

export const IndividualApplicant = ({ applicantType, lang }: Props) => {
  const { formatMessage } = useIntl()

  return (
    <Box marginTop={4}>
      <Text variant="h2" as="h2" marginBottom={3}>
        {applicantType?.name?.[lang]}
      </Text>
      <Stack space={2}>
        <NationalIdField disabled={true} />
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/12', '6/12']}>
            <Input
              label={formatMessage(m.address)}
              name="address"
              placeholder={formatMessage(m.address)}
              disabled={true}
            />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/12', '6/12']}>
            <Box marginTop={[2, 2, 0, 0]}>
              <Input
                label={formatMessage(webMessages.postalCode)}
                name="postalCode"
                placeholder={formatMessage(webMessages.postalCode)}
                disabled={true}
              />
            </Box>
          </GridColumn>
        </GridRow>
        <Input
          label={formatMessage(m.email)}
          name="email"
          placeholder="Email"
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
