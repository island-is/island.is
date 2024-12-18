import { FieldBaseProps } from '@island.is/application/types'
import { AlertMessage, Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useState } from 'react'
import { school } from '../../lib/messages'
import { getValueViaPath } from '@island.is/application/core'
import { useFormContext } from 'react-hook-form'
import { SelectionItem } from './selectionItem'
import { ApplicationType } from '../../shared'
import { hasDuplicates } from '../../utils'
import { SecondarySchoolAnswers } from '../..'

export const SchoolSelection: FC<FieldBaseProps> = (props) => {
  const { formatMessage } = useLocale()
  const { application, setBeforeSubmitCallback } = props
  const { setValue, getValues } = useFormContext()

  const isFreshman =
    getValueViaPath<ApplicationType>(
      application.answers,
      'applicationType.type',
    ) === ApplicationType.FRESHMAN

  const [schoolDuplicateError, setSchoolDuplicateError] =
    useState<boolean>(false)
  const [programDuplicateError, setProgramDuplicateError] =
    useState<boolean>(false)

  const [includeSecondSelection, setIncludeSecondSelection] = useState<boolean>(
    isFreshman
      ? true
      : getValueViaPath<boolean>(
          application.answers,
          `${props.field.id}.second.include`,
        ) || false,
  )
  const [includeThirdSelection, setIncludeThirdSelection] = useState<boolean>(
    getValueViaPath<boolean>(
      application.answers,
      `${props.field.id}.third.include`,
    ) || false,
  )

  // Add / remove second selection (only non-freshman can to this)
  const onClickAddSecond = () => {
    if (!isFreshman) {
      setIncludeSecondSelection(true)
      setValue(`${props.field.id}.second.include`, true)
    }
  }
  const onClickRemoveSecond = () => {
    if (!isFreshman) {
      setIncludeSecondSelection(false)
      setValue(`${props.field.id}.second.include`, false)
    }
  }

  // Add / remove third selection (only freshman can to this)
  const onClickAddThird = () => {
    if (isFreshman) {
      setIncludeThirdSelection(true)
      setValue(`${props.field.id}.third.include`, true)
    }
  }
  const onClickRemoveThird = () => {
    if (isFreshman) {
      setIncludeThirdSelection(false)
      setValue(`${props.field.id}.third.include`, false)
    }
  }

  const checkSchoolDuplicate = () => {
    const updatedSelection = getValueViaPath<
      SecondarySchoolAnswers['selection']
    >(getValues(), 'selection')

    const schoolIds: string[] = [updatedSelection?.first?.school?.id || '']

    if (includeSecondSelection)
      schoolIds.push(updatedSelection?.second?.school?.id || '')

    if (includeThirdSelection)
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

    if (includeSecondSelection) {
      programIds.push(updatedSelection?.second?.firstProgram?.id || '')
      if (updatedSelection?.second?.secondProgram?.include) {
        programIds.push(updatedSelection?.second?.secondProgram?.id || '')
      }
    }

    if (includeThirdSelection) {
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
    setValue(`${props.field.id}.first.include`, true)
    if (isFreshman) setValue(`${props.field.id}.second.include`, true)
    if (!isFreshman) setValue(`${props.field.id}.third.include`, false)
  }, [isFreshman, props.field.id, setValue])

  return (
    <Box>
      {/* First selection */}
      {/* Required for everyone */}
      <Box>
        {includeSecondSelection && (
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
        />
      </Box>

      {/* Second selection */}
      {/* Required for freshman, optional for non-freshman */}
      {includeSecondSelection ? (
        <Box marginTop={2}>
          <Text variant="h5">
            {formatMessage(school.secondSelection.subtitle)}
          </Text>
          <SelectionItem
            {...props}
            field={{
              ...props.field,
              id: `${props.field.id}.second`,
            }}
          />
        </Box>
      ) : (
        <Box marginTop={2}>
          <Text variant="h5">
            {formatMessage(school.secondSelection.addSubtitle)}
          </Text>
          <Text>{formatMessage(school.thirdSelection.addDescription)}</Text>
        </Box>
      )}
      {!isFreshman && (
        <Box marginTop={2}>
          {!includeSecondSelection && (
            <Button
              icon="add"
              onClick={() => onClickAddSecond()}
              variant="ghost"
              fluid
            >
              {formatMessage(school.thirdSelection.addButtonLabel)}
            </Button>
          )}
          {includeSecondSelection && (
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

      {/* Third selection */}
      {/* Optional for freshman, hidden for non-freshman */}
      {isFreshman && (
        <>
          {includeThirdSelection ? (
            <Box marginTop={2}>
              <Text variant="h5">
                {formatMessage(school.thirdSelection.subtitle)}
              </Text>
              <SelectionItem
                {...props}
                field={{
                  ...props.field,
                  id: `${props.field.id}.third`,
                }}
              />
            </Box>
          ) : (
            <Box marginTop={2}>
              <Text variant="h5">
                {formatMessage(school.thirdSelection.addSubtitle)}
              </Text>
              <Text>{formatMessage(school.thirdSelection.addDescription)}</Text>
            </Box>
          )}
          <Box marginTop={2}>
            {!includeThirdSelection && (
              <Button
                icon="add"
                onClick={() => onClickAddThird()}
                variant="ghost"
                fluid
              >
                {formatMessage(school.thirdSelection.addButtonLabel)}
              </Button>
            )}
            {includeThirdSelection && (
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
    </Box>
  )
}
