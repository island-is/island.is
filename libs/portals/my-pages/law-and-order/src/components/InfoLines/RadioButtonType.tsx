import { LawAndOrderGroup, LawAndOrderItemType } from '@island.is/api/schema'
import { Button, RadioButton, Text, Box } from '@island.is/island-ui/core'
import { Controller, useForm } from 'react-hook-form'
import { RenderItem } from './RenderItem'
import { useLocale } from '@island.is/localization'
import { messages } from '../../lib/messages'
import { SubmitHandler } from '../../utils/types'
import { useEffect } from 'react'

type RadioFormValues = {
  [key: string]: string
  itemIndex: string
}

interface Props {
  group: LawAndOrderGroup
  onFormSubmit?: SubmitHandler
  appealDecision?: string
}

export const RadioFormGroup = ({
  group,
  onFormSubmit,
  appealDecision,
}: Props) => {
  const { formatMessage } = useLocale()

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

  const onSubmit = (data: RadioFormValues) => {
    onFormSubmit?.(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Text variant="eyebrow" color="purple400" marginBottom={2}>
        {group.label}
      </Text>
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
        <Button size="small" type="submit" disabled={formState.isSubmitting}>
          {formatMessage(messages.confirm)}
        </Button>
      </Box>
    </form>
  )
}
