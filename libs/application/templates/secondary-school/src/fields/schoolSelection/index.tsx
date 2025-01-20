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
  const { setValue, getValues, register } = useFormContext()

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

  const [showSecondAddRemoveButtons, setShowSecondAddRemoveButtons] =
    useState<boolean>(false)
  const [showThirdAddRemoveButtons, setShowThirdAddRemoveButtons] =
    useState<boolean>(false)
  const [showSecondSelection, setShowSecondSelection] = useState<boolean>(false)
  const [showThirdSelection, setShowThirdSelection] = useState<boolean>(false)

  // Add / remove second selection (only non-freshman can to this)
  const onClickAddSecond = () => {
    if (!isFreshman) {
      setShowSecondSelection(true)
      setValue(`${props.field.id}.second.include`, true)
    }
  }
  const onClickRemoveSecond = () => {
    if (!isFreshman) {
      setShowSecondSelection(false)
      setValue(`${props.field.id}.second.include`, false)
    }
  }

  // Add / remove third selection (only freshman can to this)
  const onClickAddThird = () => {
    if (isFreshman) {
      setShowThirdSelection(true)
      setValue(`${props.field.id}.third.include`, true)
    }
  }
  const onClickRemoveThird = () => {
    if (isFreshman) {
      setShowThirdSelection(false)
      setValue(`${props.field.id}.third.include`, false)
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
  useEffect(() => {
    let showSecondAddRemoveButtons: boolean | undefined
    let showThirdAddRemoveButtons: boolean | undefined
    let showSecondSelection: boolean | undefined
    let showThirdSelection: boolean | undefined

    const filteredSchools = schools?.filter((x) =>
      isFreshman ? x.isOpenForAdmissionFreshman : x.isOpenForAdmissionGeneral,
    )

    if (isFreshman) {
      showSecondAddRemoveButtons = false
      showSecondSelection = true
      showThirdAddRemoveButtons = true
      showThirdSelection = getValues(`${props.field.id}.third.include`)
    } else {
      showSecondAddRemoveButtons = true
      showSecondSelection = getValues(`${props.field.id}.second.include`)
      showThirdAddRemoveButtons = false
      showThirdSelection = false
    }

    // overwrite values to handle if schools length is limited
    if (filteredSchools?.length === 1) {
      showSecondAddRemoveButtons = false
      showSecondSelection = false
      showThirdAddRemoveButtons = false
      showThirdSelection = false
    } else if (filteredSchools?.length === 2) {
      showThirdAddRemoveButtons = false
      showThirdSelection = false
    }

    setValue(`${props.field.id}.first.include`, true)
    setValue(`${props.field.id}.second.include`, showSecondSelection)
    setValue(`${props.field.id}.third.include`, showThirdSelection)

    setShowSecondAddRemoveButtons(showSecondAddRemoveButtons || false)
    setShowThirdAddRemoveButtons(showThirdAddRemoveButtons || false)
    setShowSecondSelection(showSecondSelection || false)
    setShowThirdSelection(showThirdSelection || false)
  }, [isFreshman, props.field.id, setValue, getValues, schools])

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
      {(showSecondSelection || showSecondAddRemoveButtons) && (
        <>
          <Text variant="h5" marginTop={2}>
            {showSecondSelection
              ? formatMessage(school.secondSelection.subtitle)
              : formatMessage(school.secondSelection.addSubtitle)}
          </Text>
          {showSecondSelection && (
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
          )}
          {showSecondAddRemoveButtons && (
            <Box marginTop={2}>
              {!showSecondSelection && (
                <Button
                  icon="add"
                  onClick={() => onClickAddSecond()}
                  variant="ghost"
                  fluid
                >
                  {formatMessage(school.thirdSelection.addButtonLabel)}
                </Button>
              )}
              {showSecondSelection && (
                <Button
                  icon="remove"
                  onClick={() => onClickRemoveSecond()}
                  variant="ghost"
                  colorScheme="destructive"
                  fluid
                >
                  {formatMessage(school.thirdSelection.removeButtonLabel)}
                </Button>
              )}
            </Box>
          )}
        </>
      )}

      {/* Third selection */}
      {/* Optional for freshman, hidden for non-freshman */}
      {(showThirdSelection || showThirdAddRemoveButtons) && (
        <>
          <Text variant="h5" marginTop={2}>
            {showThirdSelection
              ? formatMessage(school.thirdSelection.subtitle)
              : formatMessage(school.thirdSelection.addSubtitle)}
          </Text>
          {!showThirdSelection && (
            <Text>{formatMessage(school.thirdSelection.addDescription)}</Text>
          )}
          {showThirdSelection && (
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
          )}
          {showThirdAddRemoveButtons && (
            <Box marginTop={2}>
              {!showThirdSelection && (
                <Button
                  icon="add"
                  onClick={() => onClickAddThird()}
                  variant="ghost"
                  fluid
                >
                  {formatMessage(school.thirdSelection.addButtonLabel)}
                </Button>
              )}
              {showThirdSelection && (
                <Button
                  icon="remove"
                  onClick={() => onClickRemoveThird()}
                  variant="ghost"
                  colorScheme="destructive"
                  fluid
                >
                  {formatMessage(school.thirdSelection.removeButtonLabel)}
                </Button>
              )}
            </Box>
          )}
        </>
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
