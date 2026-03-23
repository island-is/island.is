import {
  LawAndOrderAppealDecision,
  LawAndOrderGroup,
  LawAndOrderItemType,
} from '@island.is/api/schema'
import { Box, Button, RadioButton, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
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
  appealDecision?: LawAndOrderAppealDecision
  loading?: boolean
  popUp?: boolean
}

export const AppealForm = ({
  group,
  onFormSubmit,
  appealDecision,
  loading,
  popUp = false,
}: Props) => {
  const { formatMessage } = useLocale()
  // Use group.label or group.id as the field name
  const radioFieldName = group.label ?? 'radio-button-group'

  // Set default value: use POSTPONE if appealDecision is NO_ANSWER, otherwise use existing appealDecision
  const getDefaultValue = () => {
    if (appealDecision === LawAndOrderAppealDecision.NO_ANSWER) {
      return LawAndOrderAppealDecision.POSTPONE
    }
    return appealDecision || ''
  }

  const { control, handleSubmit, formState } = useForm<RadioFormValues>({
    defaultValues: {
      [radioFieldName]: getDefaultValue(),
    },
  })

  const onSubmit = async (data: RadioFormValues) => {
    await onFormSubmit?.(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {popUp ? (
        <Text variant="h3" marginBottom={1}>
          {group.label}
        </Text>
      ) : (
        <Text variant="eyebrow" color="purple400" marginBottom={2}>
          {group.label}
        </Text>
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
                    name={`${radioFieldName}.${item.value}`}
                    label={item.label ?? ''}
                    value={item.value}
                    checked={field.value === item.value}
                    disabled={loading}
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
