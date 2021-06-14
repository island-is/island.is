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
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { useMutation } from '@apollo/client'
import isEqual from 'lodash/isEqual'
import { toast } from '@island.is/island-ui/core'
import { Constituencies } from '../../types'
import { constituencyMapper } from '../../constants'
import sortBy from 'lodash/sortBy'
import cloneDeep from 'lodash/cloneDeep'
import set from 'lodash/set'
import { Endorsement } from '../../types/schema'
import { useEndorsements } from '../../hooks/fetch-endorsements'
import { SchemaFormValues } from '../../../src/lib/dataSchema'

const EndorsementListSubmission: FC<FieldBaseProps> = ({ application }) => {
  const { lang: locale, formatMessage } = useLocale()
  const answers = application.answers as SchemaFormValues
  const [selectedEndorsements, setSelectedEndorsements] = useState<
    Endorsement[]
  >([])
  const [autoSelect, setAutoSelect] = useState(false)
  const [chooseRandom, setChooseRandom] = useState(false)
  const endorsementListId = (application.externalData?.createEndorsementList
    .data as any).id
  const {endorsements: endorsementsHook} = useEndorsements(endorsementListId, false)

   
  useEffect(() => {
  //setEndorsements(sortBy(endorsementsHook, 'created'))
  }, [endorsementsHook])

  const [updateApplication, { loading }] = useMutation(UPDATE_APPLICATION, {
    onError: (error) => {
      // If there was an error doing the update we will deselect the endorsement
      toast.error(formatMessage(coreMessages.updateOrSubmitError, { error }))

      const endorsements: any = endorsementsHook?.filter((e: any) => {
        return answers.selectedEndorsements?.indexOf(e.id) !== -1
      })
      console.log(endorsements)
      setSelectedEndorsements(endorsements ?? [])
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
    const tempEndorsements = endorsementsHook?.length ? endorsementsHook : []
    return tempEndorsements?.slice(0, maxEndorsements)
  }
  const shuffled = () => {
    const tempEndorsements = sortBy(endorsementsHook, 'created')
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
    console.log('new', newEndorsements)
    const endorsementIds: string[] = newEndorsements.map((e) => e.id)
    const updatedAnswers = {
      ...answers,
      selectedEndorsements: endorsementIds,
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
    }).then(() => {
      set(answers, 'selectedEndorsements', endorsementIds)
    })

    console.log('ANSWERS', application.answers)
  }

  /* on intital render: decide which radio button should be checked */
  useEffect(() => {
    if (answers.selectedEndorsements && answers.selectedEndorsements.length > 0) {
      const endorsements: any = endorsementsHook?.filter((e: any) => {
        return answers.selectedEndorsements?.indexOf(e.id) !== -1
      })

      setSelectedEndorsements(endorsements)
      isEqual(endorsementsHook, firstX())
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
      {endorsementsHook && endorsementsHook.length > 0 && (
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
            endorsements={endorsementsHook}
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
