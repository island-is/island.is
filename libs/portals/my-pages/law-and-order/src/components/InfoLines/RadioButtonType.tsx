import { LawAndOrderGroup, LawAndOrderItemType } from '@island.is/api/schema'
import { Button, RadioButton, Text, Box } from '@island.is/island-ui/core'
import { Controller, useForm } from 'react-hook-form'
import { RenderItem } from './RenderItem'
import { useLocale } from '@island.is/localization'
import { messages } from '../../lib/messages'
import { SubmitHandler } from '../../utils/types'

type RadioFormValues = {
  [key: string]: string
  itemIndex: string
}

interface Props {
  group: LawAndOrderGroup
  onFormSubmit?: SubmitHandler
}

export const RadioFormGroup = ({ group, onFormSubmit }: Props) => {
  const { formatMessage } = useLocale()
  const { control, handleSubmit, formState } = useForm<RadioFormValues>({
    defaultValues: {
      [(group.label ?? 'radio-button-group') as string]: '',
    },
  })

  const { isDirty } = formState

  console.log(formState)
  const onSubmit = (data: RadioFormValues) => {
    console.log('Selected radio:', data)
    onFormSubmit?.(data)
    control._reset()
  }

  // Use group.label or group.id as the field name
  const radioFieldName = group.label ?? 'radio-button-group'

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
        <Button
          size="small"
          type="submit"
          disabled={!isDirty || formState.isSubmitting}
        >
          {formatMessage(messages.confirm)}
        </Button>
      </Box>
    </form>
  )
}
