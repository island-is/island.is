import { Box, Text, Button, Stack, Input } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../../lib/messages'
import { useEffect, useState } from 'react'
import { Modal } from '@island.is/react/components'
import { useIdentityLookupLazyQuery } from './identityLookup.generated'
import { InputController } from '@island.is/shared/form-fields'
import { Control, useForm } from 'react-hook-form'

const CompareLists = () => {
  const { formatMessage } = useLocale()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const { control } = useForm()
  const [identityLookup, { loading }] = useIdentityLookupLazyQuery()

  const [nationalIdInput, setNationalIdInput] = useState('')
  const [nationalIdNotFound, setNationalIdNotFound] = useState(false)
  const [name, setName] = useState('')

  useEffect(() => {
    if (nationalIdInput.length === 10) {
      identityLookup({
        variables: {
          input: {
            nationalId: nationalIdInput,
          },
        },
      }).then((res) => {
        if (res.data?.identity?.name) {
          setName(res.data.identity.name)
        } else {
          setName('')
          setNationalIdNotFound(true)
        }
      })
    } else {
      setName('')
      setNationalIdInput('')
      setNationalIdNotFound(false)
    }
  }, [nationalIdInput])

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="flexEnd"
        alignItems="flexEnd"
        style={{ minWidth: '150px' }}
      >
        <Button
          variant="ghost"
          size="small"
          nowrap
          onClick={() => setModalIsOpen(true)}
        >
          {formatMessage(m.createCollection)}
        </Button>
      </Box>
      <Modal
        id="compareLists"
        isVisible={modalIsOpen}
        title={formatMessage(m.createCollection)}
        onClose={() => {
          setModalIsOpen(false)
          setNationalIdInput('')
          setName('')
        }}
        hideOnClickOutside={false}
        closeButtonLabel={''}
        label={''}
      >
        <Text marginBottom={5}>
          {formatMessage(m.createCollectionModalDescription)}
        </Text>
        <Stack space={3}>
          <InputController
            control={control as unknown as Control}
            type="tel"
            id="candidateNationalId"
            label={formatMessage(m.candidateNationalId)}
            format="######-####"
            defaultValue={nationalIdInput}
            onChange={(v) =>
              setNationalIdInput(v.target.value.replace(/\W/g, ''))
            }
            loading={loading}
            error={
              nationalIdNotFound
                ? formatMessage(m.candidateNationalIdNotFound)
                : undefined
            }
          />
          <Input
            name="candidateName"
            label={formatMessage(m.candidateName)}
            readOnly
            value={name}
          />
        </Stack>
        <Box display="flex" justifyContent="center" marginY={5}>
          <Button onClick={() => setModalIsOpen(false)}>
            {formatMessage(m.createCollection)}
          </Button>
        </Box>
      </Modal>
    </Box>
  )
}

export default CompareLists
