import { LawAndOrderGroup, LawAndOrderItemType } from '@island.is/api/schema'
import {
  AlertMessage,
  Box,
  Button,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { isDefined } from '@island.is/shared/utils'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { messages } from '../../lib/messages'
import { SubmitHandler } from '../../utils/types'
import { RenderItem } from './RenderItem'

type RadioFormValues = {
  [key: string]: string
  itemIndex: string
}

interface Props {
  group: LawAndOrderGroup
  onFormSubmit?: SubmitHandler
  submitMessage?: string
  appealDecision?: string
  loading?: boolean
}

export const RadioFormGroup = ({
  group,
  onFormSubmit,
  submitMessage,
  appealDecision,
  loading,
}: Props) => {
  const { formatMessage } = useLocale()
  const [response, setResponse] = useState(false)
  // Use group.label or group.id as the field name
  const radioFieldName = group.label ?? 'radio-button-group'

  const { control, handleSubmit, formState, setValue } =
    useForm<RadioFormValues>({
      defaultValues: {
        [radioFieldName]: appealDecision || '',
      },
    })

  const { isDirty } = formState

  useEffect(() => {
    // Only set the value if appealDecision exists and form hasn't been interacted with yet
    if (appealDecision && !isDirty) {
      setValue(radioFieldName, appealDecision, { shouldDirty: false })
    }
  }, [appealDecision, radioFieldName, setValue, isDirty])

  const onSubmit = async (data: RadioFormValues) => {
    const result = await onFormSubmit?.(data)
    isDefined(result) && setResponse(result)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Text variant="eyebrow" color="purple400" marginBottom={2}>
        {group.label}
      </Text>
      {submitMessage && response && !loading && (
        <Box marginBottom={3}>
          <AlertMessage
            type="info"
            title={formatMessage(messages.registrationCompleted)}
            message={submitMessage}
          />
        </Box>
      )}
      <Controller
        name={radioFieldName}
        control={control}
        render={({ field }) => (
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <>
            {group.items?.map((item, i) => {
              if (item.type !== LawAndOrderItemType.RadioButton) {
                return <RenderItem key={i} item={item} />
              }
              if (!item.value) {
                // eslint-disable-next-line react/jsx-no-useless-fragment
                return <></>
              }
              return (
                <Box marginBottom={1} key={i}>
                  <RadioButton
                    name={`${radioFieldName}.${i}`}
                    label={item.label ?? ''}
                    value={item.value}
                    checked={field.value === item.value}
                    onChange={field.onChange}
                  />
                </Box>
              )
            })}
          </>
        )}
      />
      <Box marginY={3}>
        <Button
          size="small"
          type="submit"
          disabled={
            formState.isSubmitting || !!formState.errors[radioFieldName]
          }
          loading={loading}
        >
          {formatMessage(messages.confirm)}
        </Button>
      </Box>
    </form>
  )
}
