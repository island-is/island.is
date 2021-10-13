import React, { useState, useEffect } from 'react'
import { Text, DatePicker } from '@island.is/island-ui/core'
import { Box, Button, toast, DialogPrompt } from '@island.is/island-ui/core'
import { useLocation } from 'react-router-dom'
import { ExportAsCSV } from '@island.is/application/ui-components'
import {
  useGetSinglePetition,
  UnendorseList,
  useGetSingleEndorsement,
} from '../queries'
import { useMutation } from '@apollo/client'
import { list } from '../mocks'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import PetitionsTable from '../PetitionsTable'

const isLocalhost = window.location.origin.includes('localhost')
const isDev = window.location.origin.includes('beta.dev01.devland.is')
const isStaging = window.location.origin.includes('beta.staging01.devland.is')

const baseUrlForm = isLocalhost
  ? 'http://localhost:4242/umsoknir'
  : isDev
  ? 'https://beta.dev01.devland.is/umsoknir'
  : isStaging
  ? 'https://beta.staging01.devland.is/umsoknir'
  : 'https://island.is/umsoknir'

const mapToCSVFile = (petitions: any) => {
  return petitions.map((pet: any) => {
    return {
      Dagsetning: new Date(pet.signed),
      Nafn: pet.name,
    }
  })
}

const ViewPetition = () => {
  const { formatMessage } = useLocale()
  const location: any = useLocation()
  const petition = useGetSinglePetition(location.state?.listId)
  const viewTypeEdit = location.state?.type === 'edit'

  const userHasSigned = useGetSingleEndorsement(location.state?.listId)
  const [hasSigned, setHasSigned] = useState(userHasSigned ? true : false)
  const [unendorseList, { loading: isLoading }] = useMutation(UnendorseList)

  useEffect(() => {
    setHasSigned(userHasSigned ? true : false)
  }, [userHasSigned])

  const onUnendorse = async () => {
    const success = await unendorseList({
      variables: {
        input: {
          listId: location.state?.listId,
        },
      },
    }).catch(() => {
      toast.error(formatMessage(m.viewPetition.toastError))
    })

    if (success) {
      toast.success(formatMessage(m.viewPetition.toastSuccess))
      setHasSigned(false)
    }
  }

  return (
    <Box>
      <Text variant="h2" marginBottom={3}>
        {petition?.title}
      </Text>
      <Text variant="default" marginBottom={3}>
        {petition?.description}
      </Text>

      <Box
        marginBottom={5}
        display="flex"
        justifyContent="spaceBetween"
        width={viewTypeEdit ? 'half' : 'full'}
      >
        {!viewTypeEdit && (
          <Box>
            <Text variant="h4">{formatMessage(m.viewPetition.openTil)}</Text>
            <Text variant="default" marginBottom={3}>
              {list.til}
            </Text>
          </Box>
        )}

        <Box>
          <Text variant="h4">{formatMessage(m.viewPetition.numberSigned)}</Text>
          <Text variant="default" marginBottom={3}>
            {list.signedPetitions.length}
          </Text>
        </Box>
        <Box>
          <Text variant="h4">{formatMessage(m.viewPetition.listOwner)}</Text>
          <Text variant="default" marginBottom={3}>
            {list.owner}
          </Text>
        </Box>
      </Box>

      {!viewTypeEdit && (
        <Box>
          {hasSigned ? (
            <Box marginBottom={5} width="half">
              <DialogPrompt
                baseId="dialog"
                title={formatMessage(
                  m.viewPetition.dialogPromptRemoveNameTitle,
                )}
                ariaLabel={formatMessage(
                  m.viewPetition.dialogPromptRemoveNameTitle,
                )}
                disclosureElement={
                  <Button loading={isLoading} variant="primary" icon="close">
                    {formatMessage(m.viewPetition.removeMyPetitionButton)}
                  </Button>
                }
                onConfirm={() => onUnendorse()}
                buttonTextConfirm={formatMessage(
                  m.viewPetition.dialogPromptConfirm,
                )}
                buttonTextCancel={formatMessage(
                  m.viewPetition.dialogPromptCancel,
                )}
              />
            </Box>
          ) : (
            <Box marginBottom={5} width="half">
              <Button
                variant="primary"
                icon="arrowForward"
                onClick={() =>
                  window.open(
                    `${baseUrlForm}/medmaelendalisti/3deeab21-cbdf-4414-adcd-381e3232f41b`,
                  )
                }
              >
                {formatMessage(m.viewPetition.signPetitionButton)}
              </Button>
            </Box>
          )}
        </Box>
      )}

      {location.state.type === 'edit' && (
        <Box>
          <Box width="half">
            <DatePicker
              label="Breyta loka dagsetningu"
              locale="is"
              placeholderText="Veldu dagsetningu"
            />
          </Box>
          <Box
            display="flex"
            justifyContent="spaceBetween"
            marginTop={5}
            marginBottom={10}
          >
            <DialogPrompt
              baseId="demo_dialog"
              title={formatMessage(m.viewPetition.dialogPromptCloseListTitle)}
              ariaLabel={formatMessage(
                m.viewPetition.dialogPromptCloseListTitle,
              )}
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
              buttonTextCancel={formatMessage(
                m.viewPetition.dialogPromptCancel,
              )}
            />

            <Button icon="reload" iconType="outline">
              {formatMessage(m.viewPetition.updateListButton)}
            </Button>
          </Box>

          <Box display="flex" justifyContent="flexEnd" marginY={5}>
            <ExportAsCSV
              data={mapToCSVFile(list.signedPetitions) as object[]}
              filename="Meðmælalisti"
              title="Sækja lista"
              variant="text"
            />
          </Box>
        </Box>
      )}

      <PetitionsTable />
    </Box>
  )
}

export default ViewPetition
