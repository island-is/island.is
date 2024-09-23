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
import { Dispatch, FC, SetStateAction, useEffect } from 'react'
import { DefenseChoices } from '../../lib/const'
import {
  useGetLawyersQuery,
  usePostDefenseChoiceMutation,
} from './Lawyers.generated'
import { LawAndOrderDefenseChoiceEnum } from '@island.is/api/schema'
import { isDefined } from '@island.is/shared/utils'

interface Props {
  id: string
  popUp?: {
    setPopUp: Dispatch<SetStateAction<boolean>>
  }
  refetch?: () => void
  choice?: LawAndOrderDefenseChoiceEnum | null
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
  choice,
}) => {
  useNamespaces('sp.law-and-order')
  const { formatMessage, lang } = useLocale()
  const { data, loading, error } = useGetLawyersQuery()

  const lawyers = data?.lawAndOrderLawyers?.items

  const methods = useForm<FormData>()

  const NATIONAL_ID = 'lawyersNationalId'
  const CHOICE = 'choice'

  // Choice should default to "delay" if no choice is present in the data
  // We want to set the value in order to not have the form data undefined if user doesnt change from pre-selected value
  useEffect(() => {
    methods.setValue(CHOICE, choice ?? DefenseChoices.DELAY.code)
  })

  const [postAction, { loading: postActionLoading }] =
    usePostDefenseChoiceMutation({
      onError: () => {
        toast.error(formatMessage(messages.registrationError))
        methods.setError(CHOICE, {
          message: formatMessage(messages.registrationError),
        })
      },
      onCompleted: () => {
        refetch && refetch()
        popUp && popUp.setPopUp(false)
        toast.success(formatMessage(messages.registrationCompleted))
      },
    })

  const handleSubmitForm = (data: FormData) => {
    postAction({
      variables: {
        input: {
          caseId: id,
          choice: data.choice ?? DefenseChoices.DELAY.code,
          lawyersNationalId: data.lawyersNationalId,
        },
        locale: lang,
      },
    })
  }

  const getLocalizedMessage = (choiceCode: keyof typeof DefenseChoices) => {
    const messageDescriptor = DefenseChoices[choiceCode].message
    if (!isDefined(messageDescriptor)) {
      return ''
    }
    return formatMessage(messageDescriptor)
  }

  const clearLawyersNationalId = () => {
    methods.setValue(NATIONAL_ID, undefined)
  }

  return (
    <Box marginTop={popUp ? 0 : 5}>
      {popUp ? (
        <Text variant="h3" marginBottom={1}>
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
              name={CHOICE}
              control={methods.control}
              render={({
                field: {
                  value = choice ?? DefenseChoices.DELAY.code,
                  onChange,
                },
              }) => (
                <Stack space={3}>
                  <RadioButton
                    name={CHOICE}
                    id={DefenseChoices.WAIVE.code}
                    value={DefenseChoices.WAIVE.code}
                    label={getLocalizedMessage(DefenseChoices.WAIVE.code)}
                    checked={DefenseChoices.WAIVE.code === value}
                    onChange={({ target }) => {
                      onChange(target.value)
                      clearLawyersNationalId()
                    }}
                  />
                  <RadioButton
                    name={CHOICE}
                    id={DefenseChoices.CHOOSE.code}
                    value={DefenseChoices.CHOOSE.code}
                    label={getLocalizedMessage(DefenseChoices.CHOOSE.code)}
                    checked={DefenseChoices.CHOOSE.code === value}
                    onChange={({ target }) => {
                      onChange(target.value)
                      clearLawyersNationalId()
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
                        name={NATIONAL_ID}
                        isClearable
                        size="xs"
                        isSearchable
                        label={formatMessage(messages.defenderList)}
                        placeholder={formatMessage(messages.chooseDefender)}
                        options={lawyers.map((x) => {
                          return {
                            label: x.title ?? '',
                            value: x.nationalId,
                          }
                        })}
                        onSelect={(selected) => {
                          methods.setValue(CHOICE, DefenseChoices.CHOOSE.code)
                          selected.value &&
                            methods.setValue(NATIONAL_ID, selected?.value)
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
                    name={CHOICE}
                    id={DefenseChoices.DELAY.code}
                    value={DefenseChoices.DELAY.code}
                    label={getLocalizedMessage(DefenseChoices.DELAY.code)}
                    checked={DefenseChoices.DELAY.code === value}
                    onChange={({ target }) => {
                      onChange(target.value)
                      clearLawyersNationalId()
                    }}
                  />
                  <RadioButton
                    name={CHOICE}
                    id={DefenseChoices.DELEGATE.code}
                    value={DefenseChoices.DELEGATE.code}
                    label={getLocalizedMessage(DefenseChoices.DELEGATE.code)}
                    checked={DefenseChoices.DELEGATE.code === value}
                    onChange={({ target }) => {
                      onChange(target.value)
                      clearLawyersNationalId()
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
