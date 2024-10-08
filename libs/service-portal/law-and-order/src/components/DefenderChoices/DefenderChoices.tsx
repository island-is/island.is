import {
  Box,
  Text,
  Button,
  Stack,
  RadioButton,
  toast,
  GridColumn,
  LoadingDots,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { Problem } from '@island.is/react-spa/shared'
import { SelectController } from '@island.is/shared/form-fields'
import { messages } from '../../lib/messages'
import { Dispatch, FC, SetStateAction, useEffect } from 'react'
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
  const { data, loading, error } = useGetLawyersQuery({
    variables: { locale: lang },
  })

  const lawyers = data?.lawAndOrderLawyers?.lawyers
  const choices = data?.lawAndOrderLawyers?.choices

  const methods = useForm<FormData>()

  const NATIONAL_ID = 'lawyersNationalId'
  const CHOICE = 'choice'

  // Choice should default to "delay" if no choice is present in the data
  // We want to set the value in order to not have the form data undefined if user doesnt change from pre-selected value
  useEffect(() => {
    if (methods.formState.isSubmitting || methods.formState.isSubmitted) return
    methods.setValue(CHOICE, choice ?? LawAndOrderDefenseChoiceEnum.DELAY)
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
        popUp && popUp.setPopUp(false)
        toast.success(formatMessage(messages.registrationCompleted))
        refetch && refetch()
      },
    })

  const handleSubmitForm = (data: FormData) => {
    postAction({
      variables: {
        input: {
          caseId: id,
          choice: data.choice ?? LawAndOrderDefenseChoiceEnum.DELAY,
          lawyersNationalId: data.lawyersNationalId,
        },
        locale: lang,
      },
    })
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
      {!loading && error && <Problem size="small" />}
      {loading ? (
        <SkeletonLoader height={24} repeat={4} space={4} />
      ) : (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmitForm)}>
            <Controller
              name={CHOICE}
              control={methods.control}
              render={({
                field: {
                  value = choice ?? LawAndOrderDefenseChoiceEnum.DELAY,
                  onChange,
                },
              }) => (
                <Stack space={3}>
                  {choices?.map((item) => (
                    <>
                      <RadioButton
                        name={CHOICE}
                        id={item.id ?? ''}
                        value={item.id ?? ''}
                        label={item.label ?? ''}
                        checked={item.id === value}
                        onChange={({ target }) => {
                          onChange(target.value)
                          clearLawyersNationalId()
                        }}
                      />
                      {item.id === LawAndOrderDefenseChoiceEnum.CHOOSE &&
                        value === LawAndOrderDefenseChoiceEnum.CHOOSE &&
                        loading &&
                        !lawyers && <LoadingDots />}
                      {lawyers &&
                        item.id === LawAndOrderDefenseChoiceEnum.CHOOSE &&
                        value === LawAndOrderDefenseChoiceEnum.CHOOSE && (
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
                              placeholder={formatMessage(
                                messages.chooseDefender,
                              )}
                              options={lawyers.map((x) => {
                                return {
                                  label: x.title ?? '',
                                  value: x.nationalId,
                                }
                              })}
                              onSelect={(selected) => {
                                methods.setValue(
                                  CHOICE,
                                  LawAndOrderDefenseChoiceEnum.CHOOSE,
                                )
                                selected.value &&
                                  methods.setValue(NATIONAL_ID, selected?.value)
                              }}
                              error={
                                methods.getValues().lawyersNationalId ===
                                undefined
                                  ? formatMessage(messages.pleaseChooseALawyer)
                                  : undefined
                              }
                              required
                            />
                          </GridColumn>
                        )}
                    </>
                  ))}

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
