import { FieldBaseProps } from '@island.is/application/types'
import { AlertMessage, Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useState } from 'react'
import { school } from '../../lib/messages'
import { getValueViaPath } from '@island.is/application/core'
import { useFormContext } from 'react-hook-form'
import { SelectionItem } from './SelectionItem'
import { ApplicationType, hasDuplicates, SecondarySchool } from '../../utils'
import { SecondarySchoolAnswers } from '../..'

export const SchoolSelection: FC<FieldBaseProps> = (props) => {
  const { formatMessage } = useLocale()
  const { application, setBeforeSubmitCallback } = props
  const { setValue, getValues, register, watch } = useFormContext()

  const isFirstFirstProgramSpecialNeedsEducation = watch(
    `${props.field.id}.first.firstProgram.isSpecialNeedsProgram`,
  )

  const isFreshman =
    getValueViaPath<ApplicationType>(
      application.answers,
      'applicationType.value',
    ) === ApplicationType.FRESHMAN

  const schools = getValueViaPath<SecondarySchool[]>(
    application.externalData,
    'schools.data',
  )

  const [schoolDuplicateError, setSchoolDuplicateError] =
    useState<boolean>(false)
  const [programDuplicateError, setProgramDuplicateError] =
    useState<boolean>(false)

  const [showSecondSelection, setShowSecondSelection] = useState<boolean>(false)
  const [showThirdSelection, setShowThirdSelection] = useState<boolean>(false)
  const [minSelectionCount, setMinSelectionCount] = useState<number>(1)
  const [maxSelectionCount, setMaxSelectionCount] = useState<number>(3)

  const getSelectionCount = () => {
    return 1 + (showSecondSelection ? 1 : 0) + (showThirdSelection ? 1 : 0)
  }

  const onClickAdd = () => {
    const currentCount = getSelectionCount()
    if (currentCount < maxSelectionCount) {
      if (currentCount === 1) {
        setShowSecondSelection(true)
        setValue(`${props.field.id}.second.include`, true)
      } else if (currentCount === 2) {
        setShowThirdSelection(true)
        setValue(`${props.field.id}.third.include`, true)
      }
    }
  }

  const onClickRemove = () => {
    const currentCount = getSelectionCount()
    if (currentCount > minSelectionCount) {
      if (currentCount === 2) {
        setShowSecondSelection(false)
        setValue(`${props.field.id}.second.include`, false)
      } else if (currentCount === 3) {
        setShowThirdSelection(false)
        setValue(`${props.field.id}.third.include`, false)
      }
    }
  }

  const checkSchoolDuplicate = () => {
    const updatedSelection = getValueViaPath<
      SecondarySchoolAnswers['selection']
    >(getValues(), 'selection')

    const schoolIds: string[] = [updatedSelection?.first?.school?.id || '']

    if (showSecondSelection)
      schoolIds.push(updatedSelection?.second?.school?.id || '')

    if (showThirdSelection)
      schoolIds.push(updatedSelection?.third?.school?.id || '')

    return hasDuplicates(schoolIds.filter((x) => !!x))
  }

  const checkProgramDuplicate = () => {
    const updatedSelection = getValueViaPath<
      SecondarySchoolAnswers['selection']
    >(getValues(), 'selection')

    const programIds: string[] = [
      updatedSelection?.first?.firstProgram?.id || '',
    ]
    if (updatedSelection?.first?.secondProgram?.include) {
      programIds.push(updatedSelection?.first?.secondProgram?.id || '')
    }

    if (showSecondSelection) {
      programIds.push(updatedSelection?.second?.firstProgram?.id || '')
      if (updatedSelection?.second?.secondProgram?.include) {
        programIds.push(updatedSelection?.second?.secondProgram?.id || '')
      }
    }

    if (showThirdSelection) {
      programIds.push(updatedSelection?.third?.firstProgram?.id || '')
      if (updatedSelection?.third?.secondProgram?.include) {
        programIds.push(updatedSelection?.third?.secondProgram?.id || '')
      }
    }

    return hasDuplicates(programIds.filter((x) => !!x))
  }

  setBeforeSubmitCallback?.(async () => {
    setSchoolDuplicateError(false)
    setProgramDuplicateError(false)

    const hasSchoolDuplicate = await checkSchoolDuplicate()
    if (hasSchoolDuplicate) {
      setSchoolDuplicateError(true)
      return [false, 'Duplicate school selection']
    }

    const hasProgramDuplicate = await checkProgramDuplicate()
    if (hasProgramDuplicate) {
      setProgramDuplicateError(true)
      return [false, 'Duplicate program selection']
    }

    return [true, null]
  })

  // default set include for first, second and third selection
  // freshman has second selection as required, and third selection as optional
  // non-freshman has second selection as optional, and third selection is hidden (not available)
  // handle specifically if school count is limited, or if first selection is special needs program
  useEffect(() => {
    let showSecondSelection: boolean | undefined
    let showThirdSelection: boolean | undefined
    let minSelectionCount: number | undefined
    let maxSelectionCount: number | undefined

    const filteredSchools = schools?.filter((x) =>
      isFreshman ? x.isOpenForAdmissionFreshman : x.isOpenForAdmissionGeneral,
    )

    if (isFreshman) {
      if (isFirstFirstProgramSpecialNeedsEducation) {
        showSecondSelection = getValues(`${props.field.id}.second.include`)
        showThirdSelection = getValues(`${props.field.id}.third.include`)
        minSelectionCount = 1
        maxSelectionCount = 3
      } else {
        showSecondSelection = true
        showThirdSelection = getValues(`${props.field.id}.third.include`)
        minSelectionCount = 2
        maxSelectionCount = 3
      }
    } else {
      showSecondSelection = getValues(`${props.field.id}.second.include`)
      showThirdSelection = false
      minSelectionCount = 1
      maxSelectionCount = 2
    }

    // overwrite values to handle if schools length is limited
    if (filteredSchools?.length === 1) {
      showSecondSelection = false
      showThirdSelection = false
      minSelectionCount = 1
      maxSelectionCount = 1
    } else if (filteredSchools?.length === 2) {
      showThirdSelection = false
      minSelectionCount = Math.min(minSelectionCount, 2)
      maxSelectionCount = 2
    }

    setValue(`${props.field.id}.first.include`, true)
    setValue(`${props.field.id}.second.include`, showSecondSelection)
    setValue(`${props.field.id}.third.include`, showThirdSelection)

    setShowSecondSelection(showSecondSelection || false)
    setShowThirdSelection(showThirdSelection || false)
    setMinSelectionCount(minSelectionCount || 1)
    setMaxSelectionCount(maxSelectionCount || 3)
  }, [
    isFreshman,
    props.field.id,
    setValue,
    getValues,
    schools,
    isFirstFirstProgramSpecialNeedsEducation,
  ])

  const showAddButton = getSelectionCount() < maxSelectionCount
  const showRemoveButton = getSelectionCount() > minSelectionCount

  return (
    <Box>
      {/* First selection */}
      {/* Required for everyone */}
      {showSecondSelection && (
        <Text variant="h5">
          {formatMessage(school.firstSelection.subtitle)}
        </Text>
      )}
      <SelectionItem
        {...props}
        field={{
          ...props.field,
          id: `${props.field.id}.first`,
        }}
        otherFieldIds={[`${props.field.id}.second`, `${props.field.id}.third`]}
      />

      {/* Second selection */}
      {/* Required for freshman, optional for non-freshman */}
      {showSecondSelection && (
        <>
          <Text variant="h5" marginTop={2}>
            {formatMessage(school.secondSelection.subtitle)}
          </Text>
          <SelectionItem
            {...props}
            field={{
              ...props.field,
              id: `${props.field.id}.second`,
            }}
            otherFieldIds={[
              `${props.field.id}.first`,
              `${props.field.id}.third`,
            ]}
          />
        </>
      )}

      {/* Third selection */}
      {/* Optional for freshman, hidden for non-freshman */}
      {showThirdSelection && (
        <>
          <Text variant="h5" marginTop={2}>
            {formatMessage(school.thirdSelection.subtitle)}
          </Text>
          <SelectionItem
            {...props}
            field={{
              ...props.field,
              id: `${props.field.id}.third`,
            }}
            otherFieldIds={[
              `${props.field.id}.first`,
              `${props.field.id}.second`,
            ]}
          />
        </>
      )}

      {/* Remove button */}
      {showRemoveButton && (
        <Box marginTop={2}>
          <Button
            icon="remove"
            onClick={() => onClickRemove()}
            variant="ghost"
            colorScheme="destructive"
            fluid
          >
            {formatMessage(school.selection.removeButtonLabel)}
          </Button>
        </Box>
      )}

      {/* Add subtitle + description */}
      {showAddButton && !showSecondSelection && (
        <Text variant="h5" marginTop={2}>
          {formatMessage(school.secondSelection.addSubtitle)}
        </Text>
      )}
      {showAddButton && showSecondSelection && !showThirdSelection && (
        <>
          <Text variant="h5" marginTop={2}>
            {formatMessage(school.thirdSelection.addSubtitle)}
          </Text>
          <Text>{formatMessage(school.thirdSelection.addDescription)}</Text>
        </>
      )}

      {/* Add button */}
      {showAddButton && (
        <Box marginTop={2}>
          <Button icon="add" onClick={() => onClickAdd()} variant="ghost" fluid>
            {formatMessage(school.selection.addButtonLabel)}
          </Button>
        </Box>
      )}

      {/* Duplicate error */}
      {schoolDuplicateError && (
        <Box marginTop={4}>
          <AlertMessage
            type="error"
            title={formatMessage(school.selection.schoolDuplicateError)}
          />
        </Box>
      )}
      {programDuplicateError && (
        <Box marginTop={4}>
          <AlertMessage
            type="error"
            title={formatMessage(school.selection.programDuplicateError)}
          />
        </Box>
      )}

      <input type="hidden" {...register(`${props.field.id}.first`)} />
      <input type="hidden" {...register(`${props.field.id}.second`)} />
      <input type="hidden" {...register(`${props.field.id}.third`)} />
    </Box>
  )
}
