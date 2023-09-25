import { FC, useEffect, useCallback } from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import { Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { childPensionFormMessage } from '../../../lib/messages'
import { Application, RecordObject } from '@island.is/application/types'
import { Parent } from './Parent'

interface ParentIsDeadProps {
  id: string
  application: Application
  errors?: RecordObject
}

const ParentIsDead: FC<React.PropsWithChildren<ParentIsDeadProps>> = ({
  id,
  application,
  errors,
}) => {
  const { getValues } = useFormContext()
  const { formatMessage } = useLocale()

  const parentIsDeadFieldId = id.replace('reason', 'parentIsDead')

  const { fields, append, remove } = useFieldArray({
    name: `${parentIsDeadFieldId}`,
  })

  const handleAddParent = useCallback(() => {
    append({
      name: '',
      parentDoesNotHaveNationalId: false,
      nationalIdOrBirthDate: undefined,
    })
  }, [append])

  useEffect(() => {
    const parentIsDeadFields = getValues(parentIsDeadFieldId)

    // The repeater should include one line by default
    if (fields.length === 0 && parentIsDeadFields.length === 0) {
      handleAddParent()
    }
  }, [fields, handleAddParent, getValues, parentIsDeadFieldId])

  return (
    <Box marginTop={2} marginBottom={5}>
      {fields.map((field, index) => (
        <Parent
          key={field.id}
          index={index}
          remove={remove}
          parentIsDeadFieldId={parentIsDeadFieldId}
          application={application}
          errors={errors}
        />
      ))}
      {fields.length === 1 && (
        <Box marginTop={2}>
          <Button
            colorScheme="default"
            iconType="filled"
            size="small"
            type="button"
            variant="text"
            icon="add"
            onClick={handleAddParent}
          >
            {formatMessage(
              childPensionFormMessage.info
                .childPensionReasonParentIsDeadAddParent,
            )}
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default ParentIsDead
