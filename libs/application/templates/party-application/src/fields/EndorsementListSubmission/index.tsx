import React, { useState, useEffect } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import {
  Box,
  Text,
  RadioButton,
  IconDeprecated as Icon,
  Pagination,
} from '@island.is/island-ui/core'
import { EndorsementTable } from '../components/EndorsementTable'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import isEqual from 'lodash/isEqual'
import {
  EndorsementListTags,
  SelectedRadio,
  hardcodedList,
} from '../../constants'
import sortBy from 'lodash/sortBy'
import cloneDeep from 'lodash/cloneDeep'
import shuffle from 'lodash/shuffle'
import { Endorsement } from '../../types/schema'
import { useEndorsements } from '../../hooks/fetch-endorsements'
import { SchemaFormValues } from '../../../src/lib/dataSchema'
import { useFormContext } from 'react-hook-form'
import {
  paginate,
  totalPages as pages,
  minAndMaxEndorsements,
} from '../components/utils'

const EndorsementListSubmission = ({ application }: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const {
    constituency,
    endorsements: endorsmentAnswers,
  } = application.answers as SchemaFormValues
  //const endorsementListId = '12'
  const { min: minEndorsements, max: maxEndorsements } = minAndMaxEndorsements(
    constituency as EndorsementListTags,
  )
  //const { endorsements } = useEndorsements(endorsementListId, false)
  const endorsements = sortBy(hardcodedList, 'created')
  const [endorsementsPage, setEndorsementsPage] = useState<
    Endorsement[] | undefined
  >()
  const [selectedEndorsements, setSelectedEndorsements] = useState<
    Endorsement[]
  >([])
  const [selectedRadio, setSelecteRadio] = useState<SelectedRadio>(
    SelectedRadio.AUTO,
  )
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  /* on intital render: decide which radio button should be checked */
  useEffect(() => {
    if (endorsements) {
      if (endorsmentAnswers && !!endorsmentAnswers?.length) {
        console.log('yes have answers')
        const mapToEndorsement = endorsements?.filter((endorsement) => {
          return endorsmentAnswers.indexOf(endorsement?.id) !== -1
        })
        console.log('set ekkert')
        setSelectedEndorsements(mapToEndorsement)
        isEqual(mapToEndorsement, firstX())
          ? setSelecteRadio(SelectedRadio.AUTO)
          : setSelecteRadio(SelectedRadio.RANDOM)
      } else {
        console.log('set fyrstu x')
        firstMaxEndorsements()
      }
      handlePagination(1, endorsements)
    }
  }, [])

  const showWarning =
    selectedEndorsements.length > maxEndorsements ||
    selectedEndorsements.length < minEndorsements

  const firstX = () => {
    const tempEndorsements = [...(endorsements ?? [])]
    console.log(tempEndorsements.slice(0, maxEndorsements))
    return tempEndorsements.slice(0, maxEndorsements)
  }
  const shuffled = () => {
    const tempEndorsements = [...(endorsements ?? [])]
    console.log('Shuffled:', shuffle(tempEndorsements))
    return shuffle(tempEndorsements)
  }

  const firstMaxEndorsements = () => {
    setSelecteRadio(SelectedRadio.AUTO)
    setSelectedEndorsements([...firstX()])
    console.log('setja fyrstu x', [...firstX()])
    updateApplicationWithEndorsements([...firstX()])
  }

  const randomize = () => {
    setSelecteRadio(SelectedRadio.RANDOM)
    const random = shuffled().slice(0, maxEndorsements)
    console.log('er að randomize-a')
    setSelectedEndorsements([...random])
    updateApplicationWithEndorsements([...random])
  }

  const handleCheckboxChange = (endorsement: Endorsement) => {
    setSelecteRadio(SelectedRadio.RANDOM)
    if (selectedEndorsements?.some((e) => e.id === endorsement.id)) {
      deselectEndorsement(endorsement)
    } else {
      const addToEndorsements = [
        ...(selectedEndorsements ? selectedEndorsements : []),
        endorsement,
      ]
      setSelectedEndorsements(addToEndorsements)
      updateApplicationWithEndorsements(addToEndorsements)
    }
  }

  const deselectEndorsement = (endorsement: Endorsement) => {
    const removeFromSelected = selectedEndorsements?.filter(
      (e) => e.id !== endorsement.id,
    )
    setSelectedEndorsements([...(removeFromSelected ? removeFromSelected : [])])
    updateApplicationWithEndorsements([
      ...(removeFromSelected ? removeFromSelected : []),
    ])
  }

  const updateApplicationWithEndorsements = async (
    newEndorsements: Endorsement[],
  ) => {
    const endorsementIds: string[] = newEndorsements.map((e) => e.id)
    setValue('endorsements', cloneDeep(endorsementIds))
  }

  const handlePagination = (
    page: number,
    endorsements: Endorsement[] | undefined,
  ) => {
    const sortEndorements = sortBy(endorsements, 'created')
    setPage(page)
    setTotalPages(pages(endorsements?.length))
    setEndorsementsPage(paginate(sortEndorements, 10, page))
  }

  return (
    <Box marginBottom={8}>
      <Text>{formatMessage(m.endorsementListSubmission.description)}</Text>
      {!!endorsements?.length && (
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
                (endorsements.length < maxEndorsements
                  ? endorsements.length
                  : maxEndorsements)
              }
              checked={selectedRadio === SelectedRadio.AUTO}
              onChange={() => {
                firstMaxEndorsements()
              }}
            />
            <Box marginLeft={5}>
              <RadioButton
                id="chooseManually"
                label={formatMessage(m.endorsementListSubmission.selectRandom)}
                checked={selectedRadio === SelectedRadio.RANDOM}
                onChange={() => {
                  randomize()
                }}
              />
            </Box>
          </Box>
          <EndorsementTable
            application={application}
            endorsements={sortBy(endorsementsPage, 'created')}
            selectedEndorsements={selectedEndorsements}
            onTableSelect={(endorsement: Endorsement) =>
              handleCheckboxChange(endorsement)
            }
          />
          {!!endorsements?.length && (
            <Box marginY={3}>
              <Pagination
                page={page}
                totalPages={totalPages}
                renderLink={(page, className, children) => (
                  <Box
                    cursor="pointer"
                    className={className}
                    onClick={() => handlePagination(page, endorsements)}
                  >
                    {children}
                  </Box>
                )}
              />
            </Box>
          )}
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
              {selectedEndorsements?.length +
                '/' +
                (endorsements.length < maxEndorsements
                  ? endorsements.length
                  : maxEndorsements)}
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
                {selectedEndorsements &&
                  selectedEndorsements.length > maxEndorsements && (
                    <Text fontWeight="semiBold" variant="small">
                      {formatMessage(
                        m.endorsementListSubmission.warningMessageTitleHigh,
                      )}
                    </Text>
                  )}
                {selectedEndorsements &&
                  selectedEndorsements.length < minEndorsements && (
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
