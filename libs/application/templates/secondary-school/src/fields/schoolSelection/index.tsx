import { FieldBaseProps } from '@island.is/application/types'
import { AlertMessage, Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useState } from 'react'
import { school } from '../../lib/messages'
import { getValueViaPath } from '@island.is/application/core'
import { useFormContext } from 'react-hook-form'
import { SelectionItem } from './SelectionItem'
import { checkIsFreshman, hasDuplicates, SecondarySchool } from '../../utils'
import { SecondarySchoolAnswers } from '../..'

export const SchoolSelection: FC<FieldBaseProps> = (props) => {
  const { formatMessage } = useLocale()
  const { application, setBeforeSubmitCallback } = props
  const { setValue, getValues, register, watch } = useFormContext()

  const isFirstFirstProgramSpecialNeedsProgram = watch(
    `${props.field.id}[0].firstProgram.isSpecialNeedsProgram`,
  )

  const isFreshman = checkIsFreshman(application.answers)

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
  const [minSelectionCount, setMinSelectionCount] = useState<
    number | undefined
  >()
  const [maxSelectionCount, setMaxSelectionCount] = useState<
    number | undefined
  >()

  const getSelectionCount = () => {
    return 1 + (showSecondSelection ? 1 : 0) + (showThirdSelection ? 1 : 0)
  }

  const onClickAdd = () => {
    const currentCount = getSelectionCount()
    if (maxSelectionCount && currentCount < maxSelectionCount) {
      if (currentCount === 1) {
        setShowSecondSelection(true)
        setValue(`${props.field.id}[1].include`, true)
      } else if (currentCount === 2) {
        setShowThirdSelection(true)
        setValue(`${props.field.id}[2].include`, true)
      }
    }
  }

  const onClickRemove = () => {
    const currentCount = getSelectionCount()
    if (minSelectionCount && currentCount > minSelectionCount) {
      if (currentCount === 2) {
        setShowSecondSelection(false)
        setValue(`${props.field.id}[1].include`, false)
      } else if (currentCount === 3) {
        setShowThirdSelection(false)
        setValue(`${props.field.id}[2].include`, false)
      }
    }
  }

  const checkSchoolDuplicate = () => {
    const updatedSelection = getValueViaPath<
      SecondarySchoolAnswers['selection']
    >(getValues(), 'selection')

    const schoolIds: string[] = [updatedSelection?.[0]?.school?.id || '']

    if (showSecondSelection)
      schoolIds.push(updatedSelection?.[1]?.school?.id || '')

    if (showThirdSelection)
      schoolIds.push(updatedSelection?.[2]?.school?.id || '')

    return hasDuplicates(schoolIds.filter((x) => !!x))
  }

  const checkProgramDuplicate = () => {
    const updatedSelection = getValueViaPath<
      SecondarySchoolAnswers['selection']
    >(getValues(), 'selection')

    const programIds = [
      updatedSelection?.[0]?.firstProgram?.id || '',
      updatedSelection?.[0]?.secondProgram?.id || '',
    ]

    if (showSecondSelection) {
      programIds.push(updatedSelection?.[1]?.firstProgram?.id || '')
      programIds.push(updatedSelection?.[1]?.secondProgram?.id || '')
    }

    if (showThirdSelection) {
      programIds.push(updatedSelection?.[2]?.firstProgram?.id || '')
      programIds.push(updatedSelection?.[2]?.secondProgram?.id || '')
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
      if (isFirstFirstProgramSpecialNeedsProgram) {
        showSecondSelection = getValues(`${props.field.id}[1].include`)
        showThirdSelection = getValues(`${props.field.id}[2].include`)
        minSelectionCount = 1
        maxSelectionCount = 3
      } else {
        showSecondSelection = true
        showThirdSelection = getValues(`${props.field.id}[2].include`)
        minSelectionCount = 2
        maxSelectionCount = 3
      }
    } else {
      showSecondSelection = getValues(`${props.field.id}[1].include`)
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

    setValue(`${props.field.id}[0].include`, true)
    setValue(`${props.field.id}[1].include`, showSecondSelection)
    setValue(`${props.field.id}[2].include`, showThirdSelection)

    setShowSecondSelection(showSecondSelection || false)
    setShowThirdSelection(showThirdSelection || false)
    setMinSelectionCount(minSelectionCount)
    setMaxSelectionCount(maxSelectionCount)
  }, [
    isFreshman,
    props.field.id,
    setValue,
    getValues,
    schools,
    isFirstFirstProgramSpecialNeedsProgram,
  ])

  const showAddButton =
    maxSelectionCount && getSelectionCount() < maxSelectionCount
  const showRemoveButton =
    minSelectionCount && getSelectionCount() > minSelectionCount

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
          id: `${props.field.id}[0]`,
        }}
        otherFieldIds={[`${props.field.id}[1]`, `${props.field.id}[2]`]}
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
              id: `${props.field.id}[1]`,
            }}
            otherFieldIds={[`${props.field.id}[0]`, `${props.field.id}[2]`]}
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
              id: `${props.field.id}[2]`,
            }}
            otherFieldIds={[`${props.field.id}[0]`, `${props.field.id}[1]`]}
          />
        </>
      )}

      <Box display="flex" justifyContent="flexEnd" marginTop={2}>
        {showRemoveButton && (
          <Box marginRight={2}>
            <Button
              variant="ghost"
              colorScheme="destructive"
              type="button"
              onClick={onClickRemove}
            >
              {formatMessage(school.selection.removeButtonLabel)}
            </Button>
          </Box>
        )}
        <Button
          variant="ghost"
          type="button"
          onClick={onClickAdd}
          icon="add"
          disabled={!showAddButton}
        >
          {formatMessage(school.selection.addButtonLabel)}
        </Button>
      </Box>

      {showAddButton && isFreshman && (
        <Box marginTop={2}>
          <AlertMessage
            type="info"
            title=""
            message={formatMessage(school.thirdSelection.addDescription)}
          />
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

      <input type="hidden" {...register(`${props.field.id}[0]`)} />
      <input type="hidden" {...register(`${props.field.id}[1]`)} />
      <input type="hidden" {...register(`${props.field.id}[2]`)} />
    </Box>
  )
}
