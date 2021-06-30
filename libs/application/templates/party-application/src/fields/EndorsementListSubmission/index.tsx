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
  SelectedRadio as Radio,
  hardcodedList,
} from '../../constants'
import sortBy from 'lodash/sortBy'
import shuffle from 'lodash/shuffle'
import { Endorsement } from '../../types/schema'
import { useEndorsements } from '../../hooks/fetch-endorsements'
import { SchemaFormValues } from '../../../src/lib/dataSchema'
import { useFormContext } from 'react-hook-form'
import {
  paginate,
  calculateTotalPages,
  minAndMaxEndorsements,
  PAGE_SIZE,
} from '../components/utils'

const firstMaxEndorsements = (endorsementsHook: Endorsement[], max: number) => {
  return endorsementsHook.slice(0, max)
}
const randomMaxEndorsements = (
  endorsementsHook: Endorsement[],
  max: number,
) => {
  return shuffle(endorsementsHook).slice(0, max)
}

const EndorsementListSubmission = ({ application }: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const {
    constituency,
    endorsements: endorsmentAnswers,
  } = application.answers as SchemaFormValues
  const endorsementListId = (application.externalData?.createEndorsementList
    .data as any).id

  const [paginatedEndorsements, setPaginatedEndorsements] = useState<
    Endorsement[]
  >([])
  const [selectedEndorsements, setSelectedEndorsements] = useState<
    Endorsement[]
  >([])
  const [selectedRadio, setSelecteRadio] = useState<Radio>(Radio.AUTO)
  const [showWarning, setShowWarning] = useState(false)
  const [page, setPage] = useState(1)

  const { minEndorsements, maxEndorsements } = minAndMaxEndorsements(
    constituency as EndorsementListTags,
  )
  //const { endorsements: endorsementsHook = [] } = useEndorsements(endorsementListId, false)
  const endorsementsHook = sortBy(hardcodedList, 'created')
  const totalPages = calculateTotalPages(endorsementsHook.length)

  useEffect(() => {
    if (endorsementsHook.length) {
      if (endorsmentAnswers && !!endorsmentAnswers.length) {
        const mapToEndorsement = endorsementsHook.filter((endorsement) => {
          return endorsmentAnswers.indexOf(endorsement.id) !== -1
        })
        updateSelectedEndorsements(mapToEndorsement)
      } else {
        updateSelectedEndorsements(
          firstMaxEndorsements(endorsementsHook, maxEndorsements),
        )
      }
      handlePagination(1)
    }
  }, [])

  const updateSelectedEndorsements = (
    updatedSlectedEndorsements: Endorsement[],
  ) => {
    isEqual(
      updatedSlectedEndorsements,
      firstMaxEndorsements(endorsementsHook, maxEndorsements),
    )
      ? setSelecteRadio(Radio.AUTO)
      : setSelecteRadio(Radio.RANDOM)
    setSelectedEndorsements(updatedSlectedEndorsements)
    setShowWarning(
      updatedSlectedEndorsements.length > maxEndorsements ||
        updatedSlectedEndorsements.length < minEndorsements,
    )
    setValue(
      'endorsements',
      updatedSlectedEndorsements.map((e) => e.id),
    )
  }

  const handleCheckboxChange = (endorsement: Endorsement) => {
    const isSelected = selectedEndorsements.some((e) => e.id === endorsement.id)
    if (isSelected) {
      const removeFromSelected = selectedEndorsements.filter(
        (e) => e.id !== endorsement.id,
      )
      updateSelectedEndorsements([
        ...(removeFromSelected ? removeFromSelected : []),
      ])
    } else updateSelectedEndorsements([...selectedEndorsements, endorsement])
  }

  const handlePagination = (page: number) => {
    const endorsementsSortedByDate = sortBy(endorsementsHook, 'created')
    const endorsementPage =
      paginate(endorsementsSortedByDate, PAGE_SIZE, page) ?? []
    setPaginatedEndorsements(endorsementPage)
    setPage(page)
  }

  return (
    <Box marginBottom={8}>
      <Text>{formatMessage(m.endorsementListSubmission.description)}</Text>
      {!!endorsementsHook.length && (
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
                (endorsementsHook.length < maxEndorsements
                  ? endorsementsHook.length
                  : maxEndorsements)
              }
              checked={selectedRadio === Radio.AUTO}
              onChange={() => {
                updateSelectedEndorsements(
                  firstMaxEndorsements(endorsementsHook, maxEndorsements),
                )
              }}
            />
            <Box marginLeft={5}>
              <RadioButton
                id="chooseManually"
                label={formatMessage(m.endorsementListSubmission.selectRandom)}
                checked={selectedRadio === Radio.RANDOM}
                onChange={() => {
                  updateSelectedEndorsements(
                    randomMaxEndorsements(endorsementsHook, maxEndorsements),
                  )
                }}
              />
            </Box>
          </Box>
          <EndorsementTable
            application={application}
            endorsements={paginatedEndorsements}
            selectedEndorsements={selectedEndorsements}
            onTableSelect={(endorsement: Endorsement) =>
              handleCheckboxChange(endorsement)
            }
          />
          {!!endorsementsHook.length && (
            <Box marginY={3}>
              <Pagination
                page={page}
                totalPages={totalPages}
                renderLink={(page, className, children) => (
                  <Box
                    cursor="pointer"
                    className={className}
                    onClick={() => handlePagination(page)}
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
              {selectedEndorsements.length +
                '/' +
                (endorsementsHook.length < maxEndorsements
                  ? endorsementsHook.length
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
