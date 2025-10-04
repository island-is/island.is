import { Box, Button, Checkbox, Input, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/portals/my-pages/core'
import { useUserInfo } from '@island.is/react-spa/bff'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { messages } from '../../..'
import { useIdentityQueryLazyQuery } from '../MedicineDelegation.generated'
import { DelegationInput } from '../utils/mockdata'

interface FirstStepProps {
  onClick: () => void
  formState?: DelegationInput
  setFormState: Dispatch<SetStateAction<DelegationInput | undefined>>
}

// Choose Person by national ID
const FirstStep: FC<FirstStepProps> = ({
  onClick,
  setFormState,
  formState,
}) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const userProfile = useUserInfo()
  const [name, setName] = useState<string>('')
  const [formData, setFormData] = useState<{
    nationalId?: string
  }>({
    nationalId: formState?.nationalId || '',
  })

  const [getPersonById, { loading, data, called }] = useIdentityQueryLazyQuery({
    variables: { input: { nationalId: formData.nationalId || '' } },
    onCompleted: (data) => {
      if (
        data.identity?.name !== name &&
        userProfile.profile.nationalId !== data.identity?.nationalId
      ) {
        setName(data.identity?.name ?? '')
      }
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (formData.nationalId && formData.nationalId.length >= 10) {
      setFormState?.({
        ...formState,
        nationalId: formData.nationalId || '',
        lookUp: formState?.lookUp || false,
      })
      onClick()
    }
  }

  return (
    <Box>
      <Text variant="eyebrow" color="purple400">
        {formatMessage(messages.step, { first: 1, second: 2 })}
      </Text>
      <Text variant="h5" marginTop={1} marginBottom={3}>
        {formatMessage(messages.choosePersonToGivePermit)}
      </Text>

      <form onSubmit={handleSubmit}>
        <Box marginBottom={2} width="half">
          <Input
            loading={loading}
            type="text"
            name="nationalId"
            value={formData.nationalId}
            onChange={(e) => {
              setFormData({ ...formData, nationalId: e.target.value })
              if (e.target.value.length === 10) {
                getPersonById()
              }
              if (e.target.value.length < 10 && name) {
                setName('')
              }
            }}
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
              formData.nationalId?.length === 10
            }
            errorMessage={formatMessage(messages.invalidNationalId)}
          />
          <Text variant="small" color="dark300" marginTop={1}>
            {name ?? undefined}
          </Text>
        </Box>
        <Box>
          <Checkbox label={formatMessage(messages.medicineDelegationLookup)} />
        </Box>
        <Box
          display="flex"
          justifyContent="spaceBetween"
          marginTop={4}
          flexWrap="wrap"
          columnGap={2}
        >
          <Box marginRight={1}>
            <Button
              fluid
              variant="ghost"
              size="small"
              type="button"
              onClick={() => navigate(-1)}
              preTextIcon="arrowBack"
            >
              {formatMessage(m.buttonCancel)}
            </Button>
          </Box>
          <Box marginLeft={1}>
            <Button
              fluid
              size="small"
              type="submit"
              onClick={() => onClick()}
              disabled={!formData.nationalId || formData.nationalId.length < 10}
            >
              {formatMessage(m.nextStep)}
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  )
}

export default FirstStep
