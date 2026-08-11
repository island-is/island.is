import { useMutation } from '@apollo/client'
import {
  CREATE_FORM_DELEGATION,
  DELETE_FORM_DELEGATION,
} from '@island.is/form-system/graphql'
import { Box, Checkbox, GridRow, Stack, Text } from '@island.is/island-ui/core'
import { useContext, useEffect, useRef } from 'react'
import { ControlContext } from '../../../../context/ControlContext'

export const Delegation = () => {
  const { control, controlDispatch, organizationDelegations } =
    useContext(ControlContext)
  const { isReadOnly } = control
  const selectedDelegations = control.form.delegations ?? []
  const formRef = useRef(control.form)
  const selectedDelegationsRef = useRef(selectedDelegations)
  const saveQueueRef = useRef(Promise.resolve())

  useEffect(() => {
    formRef.current = control.form
    selectedDelegationsRef.current = selectedDelegations
  }, [control.form, selectedDelegations])

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

    const saveDelegationChange = async () => {
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
        ? [...new Set([...selectedDelegationsRef.current, delegation])]
        : selectedDelegationsRef.current.filter(
            (selectedDelegation) => selectedDelegation !== delegation,
          )

      const form = {
        ...formRef.current,
        delegations,
      }

      formRef.current = form
      selectedDelegationsRef.current = delegations

      controlDispatch({
        type: 'SET_FORM',
        payload: {
          form,
        },
      })
    }

    const queuedSave = saveQueueRef.current.then(saveDelegationChange)
    saveQueueRef.current = queuedSave.catch(() => undefined)

    await queuedSave
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
