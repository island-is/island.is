import {
  Box,
  Text,
  Button,
  Stack,
  RadioButton,
  toast,
  GridColumn,
  LoadingDots,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { Problem } from '@island.is/react-spa/shared'
import { SelectController } from '@island.is/shared/form-fields'
import { messages } from '../../lib/messages'
import { Dispatch, FC, SetStateAction } from 'react'
import { DefenseChoices } from '../../lib/const'
import {
  useGetLawyersQuery,
  usePostDefenseChoiceMutation,
} from './Lawyers.generated'
import { LawAndOrderDefenseChoiceEnum } from '@island.is/api/schema'

interface Props {
  id: string
  popUp?: {
    setPopUp: Dispatch<SetStateAction<boolean>>
  }
  refetch?: () => void
}

interface FormData {
  caseId: string
  choice: LawAndOrderDefenseChoiceEnum
  lawyersNationalId?: string
}

const DefenderChoices: FC<React.PropsWithChildren<Props>> = ({
  popUp,
  id,
  refetch,
}) => {
  useNamespaces('sp.law-and-order')
  const { formatMessage, lang } = useLocale()
  const { data, loading, error } = useGetLawyersQuery({
    variables: {
      input: {
        locale: lang,
      },
    },
  })

  const lawyers = data?.lawAndOrderLawyers?.items

  const methods = useForm<FormData>()

  const [postAction, { loading: postActionLoading }] =
    usePostDefenseChoiceMutation({
      onError: () => {
        toast.error(formatMessage(messages.registrationError))
      },
      onCompleted: () => {
        refetch && refetch()
        popUp && popUp.setPopUp(false)
        toast.success(formatMessage(messages.registrationCompleted))
      },
    })

  // TODO: How to handle error
  const handleSubmitForm = (data: FormData) => {
    if (data.choice) {
      postAction({
        variables: {
          input: {
            caseId: id,
            choice: data.choice,
            lawyersNationalId: data.lawyersNationalId,
            locale: lang,
          },
        },
      })
    }
  }

  const getLocalizedMessage = (choiceCode: keyof typeof DefenseChoices) => {
    const messageDescriptor = DefenseChoices[choiceCode].message
    if (!messageDescriptor) {
      return ''
    }
    return formatMessage(messageDescriptor)
  }

  return (
    <Box marginTop={popUp ? 0 : 5}>
      {popUp ? (
        <Text variant="h3" marginBottom={5}>
          {formatMessage(messages.chooseDefenderTitle)}
        </Text>
      ) : (
        <Text variant="eyebrow" color="purple400" marginBottom={3}>
          {formatMessage(messages.chooseDefenderTitle)}
        </Text>
      )}
      {!popUp && loading && !error && <LoadingDots />}
      {!loading && error && <Problem size="small" />}
      {lawyers === null ? (
        <Problem size="small" />
      ) : (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmitForm)}>
            <Controller
              name="choice"
              control={methods.control}
              render={({ field: { value, onChange } }) => (
                <Stack space={3}>
                  <RadioButton
                    name="choice"
                    id={DefenseChoices.WAIVE.code}
                    value={DefenseChoices.WAIVE.code}
                    label={getLocalizedMessage(DefenseChoices.WAIVE.code)}
                    checked={DefenseChoices.WAIVE.code === value}
                    onChange={({ target }) => {
                      onChange(target.value)
                      methods.setValue('lawyersNationalId', undefined)
                    }}
                  />
                  <RadioButton
                    name="choice"
                    id={DefenseChoices.CHOOSE.code}
                    value={DefenseChoices.CHOOSE.code}
                    label={getLocalizedMessage(DefenseChoices.CHOOSE.code)}
                    checked={DefenseChoices.CHOOSE.code === value}
                    onChange={({ target }) => {
                      onChange(target.value)
                      methods.setValue('lawyersNationalId', undefined)
                    }}
                  />
                  {value === DefenseChoices.CHOOSE.code &&
                    loading &&
                    !lawyers && <LoadingDots />}
                  {lawyers && value === DefenseChoices.CHOOSE.code && (
                    <GridColumn
                      span={
                        popUp
                          ? '12/12'
                          : ['12/12', '12/12', '10/12', '6/8', '4/8']
                      }
                    >
                      <SelectController
                        id="lawyer-choice"
                        name="lawyersNationalId"
                        isClearable
                        size="xs"
                        isSearchable
                        label={formatMessage(messages.defenderList)}
                        placeholder={formatMessage(messages.chooseDefender)}
                        options={lawyers.map((x) => {
                          return {
                            label: x.name + ', ' + x.practice,
                            value: x.nationalId,
                          }
                        })}
                        onSelect={(selected) => {
                          methods.setValue('choice', DefenseChoices.CHOOSE.code)
                          selected.value &&
                            methods.setValue(
                              'lawyersNationalId',
                              selected?.value,
                            )
                        }}
                        error={
                          methods.getValues().lawyersNationalId === undefined
                            ? formatMessage(messages.pleaseChooseALawyer)
                            : undefined
                        }
                        required
                      />
                    </GridColumn>
                  )}
                  <RadioButton
                    name="choice"
                    id={DefenseChoices.DELAY.code}
                    value={DefenseChoices.DELAY.code}
                    label={getLocalizedMessage(DefenseChoices.DELAY.code)}
                    checked={DefenseChoices.DELAY.code === value}
                    onChange={({ target }) => {
                      onChange(target.value)
                      methods.setValue('lawyersNationalId', undefined)
                    }}
                  />
                  <RadioButton
                    name="choice"
                    id={DefenseChoices.DELEGATE.code}
                    value={DefenseChoices.DELEGATE.code}
                    label={getLocalizedMessage(DefenseChoices.DELEGATE.code)}
                    checked={DefenseChoices.DELEGATE.code === value}
                    onChange={({ target }) => {
                      onChange(target.value)
                      methods.setValue('lawyersNationalId', undefined)
                    }}
                  />
                  {!popUp && (
                    <Button
                      type="submit"
                      size="small"
                      disabled={
                        methods.formState.isSubmitting || postActionLoading
                      }
                    >
                      {postActionLoading ? (
                        <LoadingDots />
                      ) : (
                        formatMessage(messages.confirm)
                      )}
                    </Button>
                  )}
                  {popUp && (
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="spaceBetween"
                      marginTop={2}
                    >
                      <Box>
                        <Button
                          type="button"
                          size="small"
                          variant="ghost"
                          onClick={() => popUp.setPopUp(false)}
                        >
                          {formatMessage(messages.cancel)}
                        </Button>
                      </Box>
                      <Box>
                        <Button
                          type="submit"
                          size="small"
                          disabled={
                            methods.formState.isSubmitting || postActionLoading
                          }
                        >
                          {postActionLoading ? (
                            <LoadingDots />
                          ) : (
                            formatMessage(messages.confirm)
                          )}
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Stack>
              )}
            />
          </form>
        </FormProvider>
      )}
    </Box>
  )
}

export default DefenderChoices
