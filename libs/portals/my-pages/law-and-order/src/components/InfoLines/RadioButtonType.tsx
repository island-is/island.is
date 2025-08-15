import { LawAndOrderGroup, LawAndOrderItemType } from '@island.is/api/schema'
import { Button, RadioButton, Text, Box } from '@island.is/island-ui/core'
import { Controller, useForm } from 'react-hook-form'
import { RenderItem } from './RenderItem'
import { useLocale } from '@island.is/localization'
import { messages } from '../../lib/messages'

type RadioFormValues = {
  [key: string]: string
  itemIndex: string
}

export const RadioFormGroup = ({ group }: { group: LawAndOrderGroup }) => {
  const { formatMessage } = useLocale()
  const { control, handleSubmit } = useForm<RadioFormValues>({
    defaultValues: {},
  })

  const onSubmit = (data: RadioFormValues) => {
    console.log('Selected radio:', data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Text variant="eyebrow" color="purple400" marginBottom={2}>
        {group.label}
      </Text>
      {group.items?.map((item, i) => {
        if (item.type !== LawAndOrderItemType.RadioButton) {
          return <RenderItem key={i} item={item} />
        }

        return (
          <Controller
            name={group.label ?? `radio-button-${i}`} // field name can be group.label or group.id
            control={control}
            render={({ field }) => {
              if (!item.value) {
                return <></>
              }
              return (
                <Box marginBottom={1}>
                  <RadioButton
                    name={field.name}
                    label={item.label ?? ''}
                    value={item.value}
                    checked={field.value === item.value}
                    onChange={field.onChange}
                  />
                </Box>
              )
            }}
          />
        )
      })}
      <Box marginY={3}>
        <Button size="small" type="submit">
          {formatMessage(messages.confirm)}
        </Button>
      </Box>
    </form>
  )
}
