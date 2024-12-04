import { FieldBaseProps } from '@island.is/application/types'
import { AlertMessage, Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useEffect, useState } from 'react'
import { school } from '../../lib/messages'
import { getValueViaPath } from '@island.is/application/core'
import { useFormContext } from 'react-hook-form'
import { SelectionItem } from './selectionItem'

export const SchoolSelection: FC<FieldBaseProps> = (props) => {
  const { formatMessage } = useLocale()
  const { application, setBeforeSubmitCallback } = props
  const { setValue, watch } = useFormContext()

  const [schoolDuplicateError, setSchoolDuplicateError] =
    useState<boolean>(false)
  const [programDuplicateError, setProgramDuplicateError] =
    useState<boolean>(false)

  const [includeThirdSelection, setIncludeThirdSelection] = useState<boolean>(
    getValueViaPath<boolean>(
      application.answers,
      `${props.field.id}.third.include`,
    ) || false,
  )

  const onClickAdd = () => {
    setIncludeThirdSelection(true)
    setValue(`${props.field.id}.third.include`, true)
  }

  const onClickRemove = () => {
    setIncludeThirdSelection(false)
    setValue(`${props.field.id}.third.include`, false)
  }

  const checkSchoolDuplicate = () => {
    const firstSchoolId = watch(`${props.field.id}.first.school.id`)
    const secondSchoolId = watch(`${props.field.id}.second.school.id`)
    const thirdSchoolId = watch(`${props.field.id}.third.school.id`)
    const includeThird = watch(`${props.field.id}.third.include`) as boolean

    if (
      firstSchoolId === secondSchoolId ||
      (includeThird &&
        (firstSchoolId === thirdSchoolId || secondSchoolId === thirdSchoolId))
    ) {
      return true
    }

    return false
  }

  const checkProgramDuplicate = () => {
    if (
      watch(`${props.field.id}.first.firstProgram.id`) ===
      watch(`${props.field.id}.first.secondProgram.id`)
    )
      return true

    if (
      watch(`${props.field.id}.second.firstProgram.id`) ===
      watch(`${props.field.id}.second.secondProgram.id`)
    )
      return true

    const includeThird = watch(`${props.field.id}.third.include`) as boolean

    if (
      includeThird &&
      watch(`${props.field.id}.third.firstProgram.id`) ===
        watch(`${props.field.id}.third.secondProgram.id`)
    )
      return true

    return false
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

  // default set include=true for first and second selection since
  // they should both be required
  useEffect(() => {
    setValue(`${props.field.id}.first.include`, true)
    setValue(`${props.field.id}.second.include`, true)
  }, [props.field.id, setValue])

  return (
    <Box>
      <Box>
        <Text variant="h5">
          {formatMessage(school.firstSelection.subtitle)}
        </Text>
        <SelectionItem
          application={props.application}
          field={{
            ...props.field,
            id: `${props.field.id}.first`,
          }}
        />
      </Box>

      <Box marginTop={2}>
        <Text variant="h5">
          {formatMessage(school.secondSelection.subtitle)}
        </Text>
        <SelectionItem
          application={props.application}
          field={{
            ...props.field,
            id: `${props.field.id}.second`,
          }}
        />
      </Box>

      {includeThirdSelection ? (
        <Box marginTop={2}>
          <Text variant="h5">
            {formatMessage(school.thirdSelection.subtitle)}
          </Text>
          <SelectionItem
            application={props.application}
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
          <Button icon="add" onClick={() => onClickAdd()} variant="ghost" fluid>
            {formatMessage(school.thirdSelection.addButtonLabel)}
          </Button>
        )}
        {includeThirdSelection && (
          <Button
            icon="remove"
            onClick={() => onClickRemove()}
            variant="ghost"
            colorScheme="destructive"
            fluid
          >
            {formatMessage(school.thirdSelection.removeButtonLabel)}
          </Button>
        )}
      </Box>

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
