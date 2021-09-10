import React, { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import isEqual from 'lodash/isEqual'
import orderBy from 'lodash/orderBy'
import shuffle from 'lodash/shuffle'
import { useMutation } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import {
  Box,
  Text,
  RadioButton,
  IconDeprecated as Icon,
  Pagination,
} from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/core'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { SchemaFormValues } from '../../../src/lib/dataSchema'
import { m } from '../../lib/messages'
import { Endorsement } from '../../types/schema'
import { useEndorsements } from '../../hooks/fetch-endorsements'
import {
  EndorsementListTags,
  SelectedEndorsementsRadio as Radio,
} from '../../constants'
import {
  paginate,
  calculateTotalPages,
  minAndMaxEndorsements,
  PAGE_SIZE,
} from '../components/utils'
import { EndorsementTable } from '../components/EndorsementTable'

const firstMaxEndorsements = (endorsementsHook: Endorsement[], max: number) => {
  return endorsementsHook.slice(0, max)
}
const randomMaxEndorsements = (
  endorsementsHook: Endorsement[],
  max: number,
) => {
  return shuffle(endorsementsHook).slice(0, max)
}
const shouldShowWarning = (
  endorsementsLength: number,
  max: number,
  min: number,
) => {
  const hasEndorsements = endorsementsLength > 0
  const greatedThanMaxEndorsements = endorsementsLength > max
  const lessThanMinEndorsements = endorsementsLength < min

  return (
    hasEndorsements && (greatedThanMaxEndorsements || lessThanMinEndorsements)
  )
}

const EndorsementListSubmission = ({ application }: FieldBaseProps) => {
  const { lang: locale, formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const { constituency, endorsements: endorsmentAnswers } =
    application.answers as SchemaFormValues
  const endorsementListId = (
    application.externalData?.createEndorsementList.data as any
  ).id

  const [paginatedEndorsements, setPaginatedEndorsements] = useState<
    Endorsement[]
  >([])
  const [selectedEndorsements, setSelectedEndorsements] = useState<
    Endorsement[]
  >([])
  const [selectedRadio, setSelecteRadio] = useState<Radio>(Radio.AUTO)
  const [showWarning, setShowWarning] = useState(false)
  const [selectedPageNumber, setSelectedPageNumber] = useState(1)

  const { minEndorsements, maxEndorsements } = minAndMaxEndorsements(
    constituency as EndorsementListTags,
  )
  const { endorsements: endorsementsHook = [] } = useEndorsements(
    endorsementListId,
    false,
  )
  const totalPages = calculateTotalPages(endorsementsHook.length)

  const [updateApplication] = useMutation(UPDATE_APPLICATION)

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
    } else {
      setShowWarning(true)
    }
  }, [endorsementsHook])

  const updateSelectedEndorsements = async (
    updatedSelectedEndorsements: Endorsement[],
  ) => {
    isEqual(
      updatedSelectedEndorsements,
      firstMaxEndorsements(endorsementsHook, maxEndorsements),
    )
      ? setSelecteRadio(Radio.AUTO)
      : setSelecteRadio(Radio.RANDOM)
    setSelectedEndorsements(updatedSelectedEndorsements)
    setShowWarning(
      shouldShowWarning(
        updatedSelectedEndorsements.length,
        maxEndorsements,
        minEndorsements,
      ),
    )
    const updatedEndorsementsAnswers = updatedSelectedEndorsements.map(
      (e) => e.id,
    )
    await updateApplication({
      variables: {
        input: {
          id: application.id,
          answers: {
            ...application.answers,
            endorsements: updatedEndorsementsAnswers,
          },
        },
        locale,
      },
    }).then((_) => {
      setValue('endorsements', updatedEndorsementsAnswers)
    })
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
    const endorsementsSortedByDate = orderBy(
      endorsementsHook,
      'created',
      'desc',
    )
    const endorsementPage =
      paginate(endorsementsSortedByDate, PAGE_SIZE, page) ?? []
    setPaginatedEndorsements(endorsementPage)
    setSelectedPageNumber(page)
  }

  return (
    <Box marginBottom={8}>
      <Text>{formatMessage(m.endorsementListSubmission.description)}</Text>
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
              page={selectedPageNumber}
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
          <Text variant="h5">{selectedEndorsements.length}</Text>
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
                {formatMessage(m.endorsementListSubmission.warningMessagePt1) +
                  minEndorsements +
                  ' - ' +
                  maxEndorsements +
                  formatMessage(m.endorsementListSubmission.warningMessagePt2)}
              </Text>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default EndorsementListSubmission
