import { useMutation } from '@apollo/client'
import {
  CREATE_FORM_DELEGATION,
  DELETE_FORM_DELEGATION,
} from '@island.is/form-system/graphql'
import { Box, Checkbox, GridRow, Stack, Text } from '@island.is/island-ui/core'
import { useContext } from 'react'
import { ControlContext } from '../../../../context/ControlContext'

export const Delegation = () => {
  const { control, controlDispatch, organizationDelegations } =
    useContext(ControlContext)
  const { isReadOnly } = control
  const selectedDelegations = control.form.delegations ?? []

  const [createFormDelegationMutation] = useMutation(CREATE_FORM_DELEGATION)
  const [deleteFormDelegationMutation] = useMutation(DELETE_FORM_DELEGATION)

  const handleDelegationChange = async (
    delegation: string,
    checked: boolean,
  ) => {
    const formId = control.form.id

    if (!formId) {
      return
    }

    const mutation = checked
      ? createFormDelegationMutation
      : deleteFormDelegationMutation

    await mutation({
      variables: {
        input: {
          updateFormDelegationDto: {
            formId,
            delegation,
          },
        },
      },
    })

    const delegations = checked
      ? [...selectedDelegations, delegation]
      : selectedDelegations.filter(
          (selectedDelegation) => selectedDelegation !== delegation,
        )

    controlDispatch({
      type: 'SET_FORM',
      payload: {
        form: {
          ...control.form,
          delegations,
        },
      },
    })
  }

  return (
    <Stack space={2}>
      <GridRow>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          columnGap={4}
          marginLeft={2}
        >
          <Text variant="h3">
            Veldu umboð sem umboðsaðilar þurfa að hafa til að sækja um þessa
            umsókn
          </Text>
        </Box>
      </GridRow>

      <Stack space={2}>
        {organizationDelegations.map((delegation) => (
          <Checkbox
            key={delegation}
            name={delegation}
            label={delegation}
            value={delegation}
            checked={selectedDelegations.includes(delegation)}
            disabled={isReadOnly}
            onChange={(event) =>
              void handleDelegationChange(delegation, event.target.checked)
            }
          />
        ))}
      </Stack>
    </Stack>
  )
}
