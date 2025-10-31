import {
  Box,
  Checkbox,
  GridColumn,
  GridContainer,
  GridRow,
  Input,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/portals/my-pages/core'
import { useUserInfo } from '@island.is/react-spa/bff'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { messages } from '../../..'
import { DelegationState } from '../../../utils/types'
import { useIdentityQueryLazyQuery } from '../MedicineDelegation.generated'

interface FirstStepProps {
  formState?: DelegationState
  setFormState: Dispatch<SetStateAction<DelegationState | undefined>>
}

const FirstStep: FC<FirstStepProps> = ({ setFormState, formState }) => {
  const { formatMessage } = useLocale()
  const userProfile = useUserInfo()
  const [person, setPerson] = useState<{
    nationalId?: string
    name?: string
  }>({
    nationalId: formState?.nationalId || '',
  })

  const [getPersonById, { loading, data, called }] = useIdentityQueryLazyQuery({
    onCompleted: (data) => {
      if (
        data.identity?.name !== person.name &&
        userProfile.profile.nationalId !== data.identity?.nationalId
      ) {
        setPerson({
          nationalId: data.identity?.nationalId || '',
          name: data.identity?.name || '',
        })
        setFormState({ ...formState, nationalId: data.identity?.nationalId })
      }
    },
  })

  return (
    <Box>
      <Text variant="eyebrow" color="purple400">
        {formatMessage(messages.step, { first: 1, second: 2 })}
      </Text>
      <Text variant="h5" marginTop={1} marginBottom={3}>
        {formatMessage(messages.choosePersonToGivePermit)}
      </Text>

      <Box marginBottom={2}>
        <GridContainer>
          <GridRow>
            <GridColumn span={['12/12', '8/12', '8/12', '6/12']}>
              <Input
                loading={loading}
                type="text"
                name="nationalId"
                value={formState?.nationalId}
                onChange={(e) => {
                  if (e.target.value.length === 10) {
                    getPersonById({
                      variables: { input: { nationalId: e.target.value } },
                    })
                  }
                }}
                inputMode="numeric"
                label={formatMessage(m.natreg)}
                placeholder="0000000000"
                size="xs"
                required
                maxLength={10}
                backgroundColor="blue"
                hasError={
                  !loading &&
                  called &&
                  !data?.identity?.name &&
                  person.nationalId?.length === 10
                }
                errorMessage={formatMessage(messages.invalidNationalId)}
              />
              <Text variant="small" color="dark300" marginTop={1}>
                {person.name ?? undefined}
              </Text>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
      <Box>
        <Checkbox
          label={formatMessage(messages.medicineDelegationLookup)}
          checked={Boolean(formState?.lookup)}
          onChange={(e) =>
            setFormState({ ...formState, lookup: e.target.checked })
          }
        />
      </Box>
    </Box>
  )
}

export default FirstStep
