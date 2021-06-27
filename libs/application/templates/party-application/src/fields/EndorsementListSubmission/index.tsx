import React, { useState, useEffect } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import {
  Box,
  Text,
  RadioButton,
  IconDeprecated as Icon,
  Pagination,
} from '@island.is/island-ui/core'
import { EndorsementTable } from '../components/EndorsementsTable'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import isEqual from 'lodash/isEqual'
import { EndorsementListTags, SelectedRadio } from '../../constants'
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
  const endorsementListId = (application.externalData?.createEndorsementList
    .data as any).id
  const { min: minEndorsements, max: maxEndorsements } = minAndMaxEndorsements(
    constituency as EndorsementListTags,
  )
  const { endorsements } = useEndorsements(endorsementListId, false)
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
        endorsements?.filter((e) => {
          return endorsmentAnswers.indexOf(e?.id) !== -1
        })

        setSelectedEndorsements(sortBy(endorsements, 'created'))
        isEqual(endorsements, firstX())
          ? setSelecteRadio(SelectedRadio.AUTO)
          : setSelecteRadio(SelectedRadio.RANDOM)
      } else {
        firstMaxEndorsements()
        setSelecteRadio(SelectedRadio.AUTO)
      }
      handlePagination(1, endorsements)
    }
  }, [endorsements])

  const showWarning =
    selectedEndorsements.length > maxEndorsements ||
    selectedEndorsements.length < minEndorsements

  const firstX = () => {
    const tempEndorsements = [...(endorsements ?? [])]
    return tempEndorsements?.slice(0, maxEndorsements)
  }
  const shuffled = () => {
    const tempEndorsements = [...(endorsements ?? [])]
    return shuffle(tempEndorsements)
  }

  const firstMaxEndorsements = () => {
    setSelecteRadio(SelectedRadio.AUTO)
    setSelectedEndorsements([...firstX()])
    updateApplicationWithEndorsements([...firstX()])
  }

  const randomize = () => {
    setSelecteRadio(SelectedRadio.RANDOM)
    const random = shuffled().slice(0, maxEndorsements)
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
            onTableSelect={(endorsement) => handleCheckboxChange(endorsement)}
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
