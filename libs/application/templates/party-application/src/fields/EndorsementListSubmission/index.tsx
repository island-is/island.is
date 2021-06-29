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
  EndorsementListTags as ETag,
  SelectedRadio as R,
} from '../../constants'
import sortBy from 'lodash/sortBy'
import shuffle from 'lodash/shuffle'
import { Endorsement as E } from '../../types/schema'
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

  const [endorsementsPage, setEndorsementsPage] = useState<E[] | undefined>()
  const [selectedEndorsements, setSelectedEndorsements] = useState<E[]>([])
  const [selectedRadio, setSelecteRadio] = useState<R>(R.AUTO)

  const [showWarning, setShowWarning] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const { min, max } = minAndMaxEndorsements(constituency as ETag)
  const { endorsements } = useEndorsements(endorsementListId, false)

  /* on intital render: decide which radio button should be checked */
  useEffect(() => {
    if (endorsements) {
      if (endorsmentAnswers && !!endorsmentAnswers?.length) {
        const mapToEndorsement = endorsements?.filter((endorsement) => {
          return endorsmentAnswers.indexOf(endorsement?.id) !== -1
        })
        handleSelectedEndorsements(mapToEndorsement)
      } else {
        handleSelectedEndorsements(firstX())
      }
      handlePagination(1, endorsements)
    }
  })

  const handleSelectedEndorsements = (newEndorsements: E[]) => {
    setSelectedEndorsements(newEndorsements)
    toggleRadio(newEndorsements)
    setShowWarning(newEndorsements.length > max || newEndorsements.length < min)
    updateApplicationWithEndorsements(newEndorsements)
  }

  const firstX = () => {
    const tempEndorsements = [...(endorsements ?? [])]
    return tempEndorsements.slice(0, max)
  }
  const shuffled = () => {
    const tempEndorsements = [...(shuffle(endorsements) ?? [])]
    return tempEndorsements.slice(0, max)
  }

  const toggleRadio = (newEndorsements: E[]) => {
    isEqual(newEndorsements, firstX())
      ? setSelecteRadio(R.AUTO)
      : setSelecteRadio(R.RANDOM)
  }

  const handleCheckboxChange = (endorsement: E) => {
    if (selectedEndorsements?.some((e) => e.id === endorsement.id)) {
      deselectEndorsement(endorsement)
    } else {
      const addToEndorsements = [
        ...(selectedEndorsements ? selectedEndorsements : []),
        endorsement,
      ]
      handleSelectedEndorsements(addToEndorsements)
    }
  }

  const deselectEndorsement = (endorsement: E) => {
    const removeFromSelected = selectedEndorsements?.filter(
      (e) => e.id !== endorsement.id,
    )
    handleSelectedEndorsements([
      ...(removeFromSelected ? removeFromSelected : []),
    ])
  }

  const updateApplicationWithEndorsements = async (newEndorsements: E[]) => {
    const endorsementIds: string[] = newEndorsements.map((e) => e.id)
    setValue('endorsements', endorsementIds)
  }

  const handlePagination = (page: number, endorsements: E[] | undefined) => {
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
                (endorsements.length < max ? endorsements.length : max)
              }
              checked={selectedRadio === R.AUTO}
              onChange={() => {
                handleSelectedEndorsements(firstX())
              }}
            />
            <Box marginLeft={5}>
              <RadioButton
                id="chooseManually"
                label={formatMessage(m.endorsementListSubmission.selectRandom)}
                checked={selectedRadio === R.RANDOM}
                onChange={() => {
                  handleSelectedEndorsements(shuffled())
                }}
              />
            </Box>
          </Box>
          <EndorsementTable
            application={application}
            endorsements={sortBy(endorsementsPage, 'created')}
            selectedEndorsements={selectedEndorsements}
            onTableSelect={(endorsement: E) =>
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
                (endorsements.length < max ? endorsements.length : max)}
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
                {selectedEndorsements && selectedEndorsements.length > max && (
                  <Text fontWeight="semiBold" variant="small">
                    {formatMessage(
                      m.endorsementListSubmission.warningMessageTitleHigh,
                    )}
                  </Text>
                )}
                {selectedEndorsements && selectedEndorsements.length < min && (
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
                    min +
                    ' - ' +
                    max +
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
