import React, { useState, useEffect } from 'react'
import { DatePicker } from '@island.is/island-ui/core'
import {
  Box,
  Button,
  Input,
  Stack,
  DialogPrompt,
  Text,
} from '@island.is/island-ui/core'
import { useLocation } from 'react-router-dom'
import { useGetSinglePetition } from '../queries'
import { list } from '../mocks'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import PetitionsTable from '../PetitionsTable'

const ViewPetitionAdmin = () => {
  const { formatMessage } = useLocale()
  const location: any = useLocation()
  const petition = useGetSinglePetition(location.state?.listId)

  const [title, setTitle] = useState(petition?.title)
  const [description, setDescription] = useState(petition?.description)

  useEffect(() => {
    setTitle(petition?.title)
    setDescription(list.description)
  }, [petition])

  return (
    <Box>
      <Stack space={3}>
        <Input
          name={title as string}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
          }}
          label={'Heiti meðmælendalista'}
        />
        <Input
          name={description as string}
          value={description as string}
          onChange={(e) => {
            setDescription(e.target.value)
          }}
          label={'Um meðmælendalista'}
          textarea
          rows={10}
        />
        <Box display="flex" justifyContent="spaceBetween">
          <Box width="half" marginRight={2}>
            <DatePicker
              selected={new Date()}
              handleChange={(date: Date) => console.log(date)}
              label="Tímabil frá"
              locale="is"
              placeholderText="Veldu dagsetningu"
            />
          </Box>
          <Box width="half" marginLeft={2}>
            <DatePicker
              selected={new Date()}
              handleChange={(date: Date) => console.log(date)}
              label="Tímabil til"
              locale="is"
              placeholderText="Veldu dagsetningu"
            />
          </Box>
        </Box>

        <Input
          name={list.owner}
          value={list.owner}
          label={formatMessage(m.viewPetition.listOwner)}
        />

        <Box
          display="flex"
          justifyContent="spaceBetween"
          marginTop={5}
          marginBottom={7}
        >
          <DialogPrompt
            baseId="demo_dialog"
            title={formatMessage(m.viewPetition.dialogPromptCloseListTitle)}
            ariaLabel={formatMessage(m.viewPetition.dialogPromptCloseListTitle)}
            disclosureElement={
              <Button
                icon="lockClosed"
                iconType="outline"
                colorScheme="destructive"
              >
                {formatMessage(m.viewPetition.closeListButton)}
              </Button>
            }
            onConfirm={() => console.log('Confirmed')}
            onCancel={() => console.log('Cancelled')}
            buttonTextConfirm={formatMessage(
              m.viewPetition.dialogPromptConfirm,
            )}
            buttonTextCancel={formatMessage(m.viewPetition.dialogPromptCancel)}
          />
          <Button icon="checkmark" iconType="outline">
            {formatMessage(m.viewPetition.updateListButton)}
          </Button>
        </Box>

        <Box>
          <Text variant="h3">Yfirlit meðmæla</Text>
          <PetitionsTable />
        </Box>
      </Stack>
    </Box>
  )
}

export default ViewPetitionAdmin
