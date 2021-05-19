import React, { FC, useState, useEffect } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, RadioButton } from '@island.is/island-ui/core'
import EndorsementTable from './EndorsementTable'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import {
  Endorsement,
  PartyApplicationAnswers,
} from '../../../src/lib/PartyApplicationTemplate'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useMutation } from '@apollo/client'
import isEqual from 'lodash/isEqual'
import { toast } from '@island.is/island-ui/core'

const ENDORSEMENTS: Endorsement[] = [
  {
    id: 1,
    date: '21.01.2021',
    name: 'Örvar Þór Sigurðsson',
    nationalId: '1991921335',
    address: 'Baugholt 15',
    hasWarning: false,
  },
  {
    id: 2,
    date: '21.01.2021',
    name: 'Þórhildur Tyrfingsdóttir',
    nationalId: '1991921335',
    address: 'Miðskógar 17',
    hasWarning: false,
  },
  {
    id: 3,
    date: '21.01.2021',
    name: 'Stefán Haukdal',
    nationalId: '1991921335',
    address: 'Skúr hjá mömmu',
    hasWarning: false,
  },
  {
    id: 4,
    date: '21.01.2021',
    name: 'Brian Johannesen',
    nationalId: '1991921335',
    address: 'Reykjavík',
    hasWarning: false,
  },
  {
    id: 5,
    date: '21.01.2021',
    name: 'Örvar Þór Sigurðsson',
    nationalId: '1991921335',
    address: 'Baugholt 15',
    hasWarning: false,
  },
  {
    id: 6,
    date: '21.01.2021',
    name: 'Örvar Þór Sigurðsson',
    nationalId: '1991921335',
    address: 'Baugholt 15',
    hasWarning: true,
  },
]

const EndorsementListSubmission: FC<FieldBaseProps> = ({ application }) => {
  const { lang: locale, formatMessage } = useLocale()
  const answers = (application as any).answers as PartyApplicationAnswers
  const [endorsements, setEndorsements] = useState(
    ENDORSEMENTS.sort((a, b) => a.id - b.id), //todo: sort by date :)
  )
  const [selectedEndorsements, setSelectedEndorsements] = useState<
    Endorsement[]
  >([])
  const [autoSelect, setAutoSelect] = useState(false)
  const [chooseRandom, setChooseRandom] = useState(false)

  const [updateApplication, { loading }] = useMutation(UPDATE_APPLICATION, {
    onError: () => {
      // If there was an error doing the update we will deselect the endorsement
      toast.error('Eitthvað fór úrskeiðis, vinsamlegast reyndu aftur')
      setSelectedEndorsements(answers.endorsements ?? [])
    },
  })
  const maxEndorsements = 3 //commentaði út fyrir neðan á meðan við erum að vinna með svona lítið array :)
  //constituencyMapper[answers.constituency as Constituencies].high
  const autoSelectRadioLabel = 'Senda inn fyrstu ' + maxEndorsements
  const firstX = () => {
    const tempEndorsements = endorsements
    return tempEndorsements.slice(0, maxEndorsements)
  }
  const shuffled = () => {
    const tempEndorsements = endorsements
    return tempEndorsements.sort(() => 0.5 - Math.random())
  }

  const firstMaxEndorsements = () => {
    setAutoSelect(true)
    setChooseRandom(false)
    setSelectedEndorsements([...firstX()])
    updateApplicationWithEndorsements([...firstX()])
  }

  const randomize = () => {
    setAutoSelect(false)
    setChooseRandom(true)
    const random = shuffled().slice(0, maxEndorsements)
    setSelectedEndorsements([...random])
    updateApplicationWithEndorsements([...random])
  }

  const handleCheckboxChange = (endorsement: Endorsement) => {
    setAutoSelect(false)
    setChooseRandom(true)
    if (selectedEndorsements?.some((e) => e.id === endorsement.id)) {
      deselectEndorsement(endorsement)
    } else {
      const addToEndorsements = [...selectedEndorsements, endorsement]
      setSelectedEndorsements(addToEndorsements)
      updateApplicationWithEndorsements(addToEndorsements)
    }
  }

  const deselectEndorsement = (endorsement: Endorsement) => {
    const removeFromSelected = selectedEndorsements.filter(
      (e) => e.id !== endorsement.id,
    )
    setSelectedEndorsements([...removeFromSelected])
    updateApplicationWithEndorsements([...removeFromSelected])
  }

  const updateApplicationWithEndorsements = async (
    newEndorsements: Endorsement[],
  ) => {
    const updatedAnswers = {
      ...answers,
      endorsements: newEndorsements,
    }
    await updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: {
            ...updatedAnswers,
          },
        },
        locale,
      },
    })
  }

  // on initial render:
  useEffect(() => {
    console.log(
      'answers: ',
      answers,
      ' selected endorsements: ',
      selectedEndorsements,
    )
    /* if on initail render we have endorsements selected we want to
      decide which radio button should be checked
    */
    if (answers.endorsements && answers.endorsements.length > 0) {
      setSelectedEndorsements(answers.endorsements)
      isEqual(answers.endorsements, firstX())
        ? setAutoSelect(true)
        : setChooseRandom(true)
    } else {
      firstMaxEndorsements()
      setAutoSelect(true)
    }
  }, [])

  return (
    <Box marginBottom={8}>
      <Text>{formatMessage(m.endorsementListSubmission.description)}</Text>
      {endorsements && endorsements.length > 0 && (
        <Box>
          <Box
            marginTop={3}
            marginBottom={3}
            display="flex"
            alignItems="center"
            justifyContent="flexStart"
          >
            <RadioButton
              id="autoSelect"
              label={autoSelectRadioLabel}
              checked={autoSelect}
              onChange={() => {
                firstMaxEndorsements()
              }}
            />
            <Box marginLeft={5}>
              <RadioButton
                id="chooseManually"
                label="Valið af handahófi"
                checked={chooseRandom}
                onChange={() => {
                  randomize()
                }}
              />
            </Box>
          </Box>
          <EndorsementTable
            endorsements={endorsements}
            selectedEndorsements={selectedEndorsements}
            onChange={(endorsement) => handleCheckboxChange(endorsement)}
            disabled={loading}
          />
        </Box>
      )}
    </Box>
  )
}

export default EndorsementListSubmission
