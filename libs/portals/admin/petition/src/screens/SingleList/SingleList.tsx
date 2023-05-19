import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Input,
  Stack,
  DialogPrompt,
  toast,
  AlertMessage,
  DatePicker,
  Breadcrumbs,
} from '@island.is/island-ui/core'
import { useLoaderData, useLocation } from 'react-router-dom'

import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '../../lib/messages'
import { useMutation } from '@apollo/client'
import Skeleton from '../../components/Skeleton/skeleton'
import { EndorsementList } from '../../shared/utils/types'
import PetitionsTable from '../../components/PetitionsTable'
import { PetitionPaths } from '../../lib/paths'

const SingleList = () => {
  const { listId, petition, endorsements } = useLoaderData() as EndorsementList
  const { formatMessage } = useLocale()

  const [title, setTitle] = useState(petition?.title)
  const [description, setDescription] = useState(petition?.description)
  const [closedDate, setClosedDate] = useState(petition?.closedDate)
  const [openedDate, setOpenedDate] = useState(petition?.openedDate)

  return (
    <Box>
      <Breadcrumbs
        items={[
          {
            title: formatMessage(m.title),
            href: '/stjornbord' + PetitionPaths.PetitionsRoot,
          },
        ]}
      />
      {petition ? (
        <Stack space={3}>
          {petition.adminLock && (
            <AlertMessage type="error" title={''} message="" />
          )}
          <Input
            name={title as string}
            value={title ?? ''}
            onChange={(e) => {
              setTitle(e.target.value)
            }}
            label={'Heiti lista'}
            size="xs"
          />
          <Input
            size="xs"
            name={description as string}
            value={description ?? ''}
            onChange={(e) => {
              setDescription(e.target.value)
            }}
            label={'Um lista'}
            textarea
            rows={10}
          />
          {closedDate && openedDate && (
            <Box display={['block', 'flex']} justifyContent="spaceBetween">
              <Box width="half" marginRight={[0, 2]}>
                <DatePicker
                  selected={new Date(openedDate)}
                  handleChange={(date) => setOpenedDate(date.toISOString())}
                  label="Tímabil frá"
                  locale="is"
                  placeholderText="Veldu dagsetningu"
                  size="xs"
                />
              </Box>
              <Box width="half" marginLeft={[0, 2]} marginTop={[2, 0]}>
                <DatePicker
                  selected={new Date(closedDate)}
                  handleChange={(date) => setClosedDate(date.toISOString)}
                  label="Tímabil til"
                  locale="is"
                  placeholderText="Veldu dagsetningu"
                  size="xs"
                />
              </Box>
            </Box>
          )}

          <Input
            size="xs"
            backgroundColor="blue"
            disabled
            name={petition?.ownerName ?? ''}
            value={petition?.ownerName ?? ''}
            label={formatMessage(m.listOwner)}
          />

          <Box
            display="flex"
            justifyContent="spaceBetween"
            marginTop={5}
            marginBottom={7}
          >
            {!petition.adminLock ? (
              <DialogPrompt
                baseId="demo_dialog"
                title={
                  '//Todo: add texts after moving this screen to admin system'
                }
                ariaLabel={''}
                disclosureElement={
                  <Button
                    icon="lockClosed"
                    iconType="outline"
                    colorScheme="destructive"
                  >
                    {'Loka lista'}
                  </Button>
                }
                // onConfirm={() => onLockList()}
                buttonTextConfirm={'Já'}
                buttonTextCancel={'Nei'}
              />
            ) : (
              <DialogPrompt
                baseId="demo_dialog"
                title={
                  '//Todo: add texts after moving this screen to admin system'
                }
                ariaLabel={''}
                disclosureElement={
                  <Button icon="reload" iconType="outline">
                    {'Opna lista'}
                  </Button>
                }
                // onConfirm={() => onUnlockList()}
                buttonTextConfirm={'Já'}
                buttonTextCancel={'Nei'}
              />
            )}
            <DialogPrompt
              baseId="demo_dialog"
              title={
                '//Todo: add texts after moving this screen to admin system'
              }
              ariaLabel={''}
              disclosureElement={
                <Button icon="checkmark" iconType="outline">
                  {'Uppfæra lista'}
                </Button>
              }
              //   onConfirm={() => onUpdateList()}
              buttonTextConfirm={'Já'}
              buttonTextCancel={'Nei'}
            />
          </Box>

          <PetitionsTable
            petitions={endorsements}
            listId={listId}
            isViewTypeEdit={true}
          />
        </Stack>
      ) : (
        <Skeleton />
      )}
    </Box>
  )
}

export default SingleList
