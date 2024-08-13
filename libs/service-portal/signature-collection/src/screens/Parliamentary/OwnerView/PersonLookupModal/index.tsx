import { useEffect, useState } from 'react'
import {
  Box,
  Stack,
  Button,
  Text,
  Input,
  Checkbox,
} from '@island.is/island-ui/core'
import { Modal } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { useIdentityQuery } from '@island.is/service-portal/graphql'
import { InputController } from '@island.is/shared/form-fields'
import { useForm } from 'react-hook-form'
import { m } from '../../../../lib/messages'
import { constituencies } from 'libs/service-portal/signature-collection/src/lib/constants'

const PersonLookupModal = ({
  collectionId,
  title,
}: {
  collectionId: string
  title: string
}) => {
  const { formatMessage } = useLocale()
  const { control } = useForm()

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [nationalIdInput, setNationalIdInput] = useState('')
  const [nationalIdNotFound, setNationalIdNotFound] = useState(false)
  const [name, setName] = useState('')

  const { data, loading } = useIdentityQuery({
    variables: {
      input: {
        nationalId: nationalIdInput,
      },
    },
    skip: nationalIdInput.length !== 10,
  })

  useEffect(() => {
    if (!loading) {
      if (nationalIdInput.length === 10 && data?.identity?.name) {
        setName(data.identity.name)
      } else {
        setName('')
        setNationalIdNotFound(nationalIdInput.length === 10)
        if (nationalIdInput.length !== 10) {
          setNationalIdInput('')
        }
      }
    }
  }, [nationalIdInput, loading])

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="flexEnd"
        alignItems="flexEnd"
        style={{ minWidth: '150px' }}
      >
        <Button
          variant="utility"
          icon="add"
          iconType="outline"
          onClick={() => {
            setModalIsOpen(true)
          }}
        >
          {formatMessage(m.add)}
        </Button>
      </Box>
      <Modal
        id="addManager"
        isVisible={modalIsOpen}
        label={''}
        initialVisibility={false}
        onCloseModal={() => setModalIsOpen(false)}
      >
        <Text marginBottom={5} variant="h2">
          {title}
        </Text>
        <Stack space={3}>
          <InputController
            control={control}
            id="nationalId"
            label={formatMessage(m.personNationalId)}
            backgroundColor={'blue'}
            name="nationalId"
            format="######-####"
            type="tel"
            defaultValue={nationalIdInput}
            onChange={(e) => {
              setNationalIdInput(e.target.value.replace(/\W/g, ''))
            }}
            error={nationalIdNotFound ? formatMessage('Not found') : undefined}
            loading={loading}
          />
          <Input
            label={formatMessage(m.personName)}
            backgroundColor="white"
            name="name"
            value={name}
            readOnly
          />
          {title.includes('umsjón') &&
            constituencies.map((constituency) => (
              <Checkbox
                key={constituency}
                name="constituency"
                label={constituency}
                value={constituency}
              />
            ))}
        </Stack>
        <Box display="flex" justifyContent="center" marginY={5}>
          <Button
            onClick={() => {
              console.log('todo')
            }}
          >
            {formatMessage(m.add)}
          </Button>
        </Box>
      </Modal>
    </Box>
  )
}

export default PersonLookupModal
