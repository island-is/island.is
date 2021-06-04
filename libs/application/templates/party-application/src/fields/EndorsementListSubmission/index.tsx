import React, { FC, useState, useEffect } from 'react'
import { coreMessages, FieldBaseProps } from '@island.is/application/core'
import {
  Box,
  Text,
  RadioButton,
  IconDeprecated as Icon,
} from '@island.is/island-ui/core'
import EndorsementTable from './EndorsementTable'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { Endorsement, SchemaFormValues } from '../../../src/lib/dataSchema'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useMutation } from '@apollo/client'
import isEqual from 'lodash/isEqual'
import { toast } from '@island.is/island-ui/core'
import { Constituencies } from '../../types'
import { constituencyMapper } from '../../constants'
import sortBy from 'lodash/sortBy'

const ENDORSEMENTS: Endorsement[] = [
  {
    id: '1',
    date: '21.01.2021',
    name: 'Örvar Þór Sigurðsson',
    nationalId: '1991921335',
    address: 'Baugholt 15',
    hasWarning: false,
    bulkImported: false,
  },
  {
    id: '2',
    date: '21.06.2021',
    name: 'Þórhildur Tyrfingsdóttir',
    nationalId: '1991921335',
    address: 'Miðskógar 17',
    hasWarning: true,
    bulkImported: false,
  },
  {
    id: '3',
    date: '21.05.2021',
    name: 'Stefán Haukdal',
    nationalId: '1991921335',
    address: 'Skúr hjá mömmu',
    hasWarning: false,
    bulkImported: false,
  },
  {
    id: '4',
    date: '21.03.2021',
    name: 'Brian Johannesen',
    nationalId: '1991921335',
    address: 'Reykjavík',
    hasWarning: false,
    bulkImported: false,
  },
  {
    id: '5',
    date: '21.02.2021',
    name: 'Örvar Þór Sigurðsson',
    nationalId: '1991921335',
    address: 'Baugholt 15',
    hasWarning: false,
    bulkImported: false,
  },
  {
    id: '6',
    date: '21.04.2021',
    name: 'Örvar Þór Sigurðsson',
    nationalId: '1991921335',
    address: 'Baugholt 15',
    hasWarning: true,
    bulkImported: false,
  },
]

const EndorsementListSubmission: FC<FieldBaseProps> = ({ application }) => {
  const { lang: locale, formatMessage } = useLocale()
  const answers = application.answers as SchemaFormValues
  const [endorsements] = useState(sortBy(ENDORSEMENTS, 'date'))
  const [selectedEndorsements, setSelectedEndorsements] = useState<
    Endorsement[]
  >([])
  const [autoSelect, setAutoSelect] = useState(false)
  const [chooseRandom, setChooseRandom] = useState(false)

  const [updateApplication, { loading }] = useMutation(UPDATE_APPLICATION, {
    onError: (error) => {
      // If there was an error doing the update we will deselect the endorsement
      toast.error(formatMessage(coreMessages.updateOrSubmitError, { error }))
      setSelectedEndorsements(answers.endorsements ?? [])
    },
  })
  const maxEndorsements =
    constituencyMapper[answers.constituency as Constituencies].high
  const minEndorsements =
    constituencyMapper[answers.constituency as Constituencies].low
  const showWarning =
    selectedEndorsements.length > maxEndorsements ||
    selectedEndorsements.length < minEndorsements
  const firstX = () => {
    const tempEndorsements = endorsements
    return tempEndorsements.slice(0, maxEndorsements)
  }
  const shuffled = () => {
    const tempEndorsements = sortBy(endorsements, 'date')
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
      endorsementsWithWarning: newEndorsements.filter((e) => e.hasWarning),
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
    }).then((response) => {
      application.answers = response.data?.updateApplication?.answers
    })
  }

  /* on intital render: decide which radio button should be checked */
  useEffect(() => {
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
              label={
                formatMessage(m.endorsementListSubmission.selectAuto) +
                maxEndorsements
              }
              checked={autoSelect}
              onChange={() => {
                firstMaxEndorsements()
              }}
            />
            <Box marginLeft={5}>
              <RadioButton
                id="chooseManually"
                label={formatMessage(m.endorsementListSubmission.selectRandom)}
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
          <Box
            marginTop={3}
            display="flex"
            alignItems="center"
            justifyContent="spaceBetween"
          >
            <Text fontWeight="semiBold" variant="small">
              {formatMessage(m.endorsementListSubmission.chosenEndorsements)}
            </Text>
            <Text variant="h5">
              {selectedEndorsements.length + '/' + maxEndorsements}
            </Text>
          </Box>
          {showWarning && (
            <Box
              marginTop={5}
              background="yellow200"
              display="flex"
              alignItems="center"
              padding={3}
              borderRadius="large"
              borderColor="yellow400"
              borderWidth="standard"
            >
              <Icon type="alert" color="yellow600" width={26} />
              <Box marginLeft={3}>
                {selectedEndorsements.length > maxEndorsements && (
                  <Text fontWeight="semiBold" variant="small">
                    {formatMessage(
                      m.endorsementListSubmission.warningMessageTitleHigh,
                    )}
                  </Text>
                )}
                {selectedEndorsements.length < minEndorsements && (
                  <Text fontWeight="semiBold" variant="small">
                    {formatMessage(
                      m.endorsementListSubmission.warningMessageTitleLow,
                    )}
                  </Text>
                )}
                <Text variant="small">
                  {formatMessage(
                    m.endorsementListSubmission.warningMessagePt1,
                  ) +
                    minEndorsements +
                    ' - ' +
                    maxEndorsements +
                    formatMessage(
                      m.endorsementListSubmission.warningMessagePt2,
                    )}
                </Text>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export default EndorsementListSubmission
