import React, { useContext, useEffect, useState } from 'react'
import { Stack, Checkbox, Box, Text } from '@island.is/island-ui/core'
import FormBuilderContext from '../../../../context/FormBuilderContext'
import { IInput } from '../../../../types/interfaces'
import { addInput, deleteItem } from '../../../../services/apiService'
import SingleParty from './components/SingleParty'

const applicantTypeLabel = [
  'Einstaklingur (innskráður)',
  'Einstaklingur í umboði annars einstaklings',
  'Einstaklingur í umboði lögaðila',
  'Einstaklingur með prókúru',
]

const applicantTypes = [
  'Einstaklingur',
  'Einstaklingur_með_umboð_annars_einstaklings',
  'Einstaklingur_með_umboð_lögaðila',
  'Einstaklingur_með_prókúru',
]

export default function RelevantParties() {
  const { lists, formBuilder, listsDispatch } = useContext(FormBuilderContext)
  const { activeItem } = lists
  const [relevantParties, setRelevantParties] = useState<IInput[]>([])
  const groupId = lists.groups.find(
    (g) => g.stepGuid === activeItem.data.guid,
  ).id

  useEffect(() => {
    setRelevantParties(() => {
      const groupGuid = lists.groups.find(
        (g) => g.stepGuid === activeItem.data.guid,
      ).guid
      return lists.inputs.filter((i) => i.groupGuid === groupGuid)
    })
  }, [lists, activeItem.data.guid])

  useEffect(() => {
    console.log(relevantParties)
  }, [relevantParties])

  const handleCheckboxChange = async (checked: boolean, index: number) => {
    if (checked) {
      const newInput = await addInput(relevantParties.length, groupId)
      const { label: is, value: en } = getOptions(applicantTypes[index])[0]
      listsDispatch({
        type: 'addInputRelevantParty',
        payload: {
          data: newInput,
          type: applicantTypes[index],
          name: {
            is,
            en,
          },
        },
      })
    } else {
      const toDelete = relevantParties.find(
        (i) => i.inputSettings.type === applicantTypes[index],
      )
      deleteItem('Input', toDelete.id)
      listsDispatch({
        type: 'removeInput',
        payload: {
          guid: toDelete.guid,
        },
      })
    }
  }

  const getOptions = (type: string) => {
    return formBuilder.applicantTypes
      .find((at) => at.type === type)
      .nameSuggestions.map((n) => ({
        label: n.is,
        value: n.en,
      }))
  }

  return (
    <Stack space={2}>
      <Box marginBottom={2}>
        <Text variant="h4">
          Veldu þá einstaklinga sem mega opna þessa umsókn
        </Text>
      </Box>
      <Box padding={2}>
        <Stack space={2}>
          {applicantTypeLabel.map((label, index) => (
            <Checkbox
              key={index}
              label={label}
              checked={relevantParties.some(
                (i) => i.inputSettings.type === applicantTypes[index],
              )}
              onChange={(e) => {
                handleCheckboxChange(e.target.checked, index)
              }}
            />
          ))}
        </Stack>
      </Box>
      {relevantParties.filter((i) => i.type === 'Aðili').length > 0 && ( // TODO: During lag, an input type with text input gets stored in the array
        <Box marginTop={1}>
          <Text variant="h4">* Skilgreindu hlutaðeigandi aðila</Text>
        </Box>
      )}
      {relevantParties.some(
        (i) => i.inputSettings.type === applicantTypes[0],
      ) && (
        <SingleParty
          title={applicantTypeLabel[0]}
          options={getOptions(applicantTypes[0])}
          input={relevantParties.find(
            (i) => i.inputSettings.type === applicantTypes[0],
          )}
        />
      )}
      {relevantParties.some(
        (i) => i.inputSettings.type === applicantTypes[1],
      ) && (
        <SingleParty
          title={applicantTypeLabel[1]}
          options={getOptions(applicantTypes[1])}
          input={relevantParties.find(
            (i) => i.inputSettings.type === applicantTypes[1],
          )}
        />
      )}
      {relevantParties.some(
        (i) => i.inputSettings.type === applicantTypes[2],
      ) && (
        <SingleParty
          title={applicantTypeLabel[2]}
          options={getOptions(applicantTypes[2])}
          input={relevantParties.find(
            (i) => i.inputSettings.type === applicantTypes[2],
          )}
        />
      )}
      {relevantParties.some(
        (i) => i.inputSettings.type === applicantTypes[3],
      ) && (
        <SingleParty
          title={applicantTypeLabel[3]}
          options={getOptions(applicantTypes[2])}
          input={relevantParties.find(
            (i) => i.inputSettings.type === applicantTypes[3],
          )}
        />
      )}
    </Stack>
  )
}
