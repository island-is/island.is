import {
  Box,
  Text,
  Button,
  Stack,
  RadioButton,
  toast,
  Select,
  GridColumn,
  LoadingDots,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useForm } from 'react-hook-form'
import { messages } from '../../lib/messages'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { DefenseDecision } from '../../lib/const'
import { useLawAndOrderContext } from '../../helpers/LawAndOrderContext'
import {
  useGetLawyersQuery,
  usePostDefenseChoiceMutation,
} from './Lawyers.generated'
import { Problem } from '@island.is/react-spa/shared'

interface Props {
  id: string
  popUp?: {
    setPopUp: Dispatch<SetStateAction<boolean>>
  }
}

interface FormData {
  caseId: string
  choice: string
  lawyersNationalId?: string
}

const DefenderChoices: FC<React.PropsWithChildren<Props>> = ({ popUp, id }) => {
  useNamespaces('sp.law-and-order')
  const { formatMessage, lang } = useLocale()
  const [lawyer, setLawyer] = useState<
    { label: string; value: string } | undefined
  >()
  const [choice, setChoice] = useState<DefenseDecision>()
  const { data, loading, error, refetch } = useGetLawyersQuery({
    variables: {
      input: {
        locale: lang,
      },
    },
  })
  const lawyers = data?.lawAndOrderLawyers?.items
  const { defenseChoice, setDefenseChoice, setLawyerSelected } =
    useLawAndOrderContext()
  const submitDisabled =
    !choice || (choice === DefenseDecision.CHOOSING_LAWYER && !lawyer)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>()

  const [postAction, { loading: postActionLoading, data: updateData }] =
    usePostDefenseChoiceMutation({
      onError: () => {
        toast.error(formatMessage(messages.registrationError))
      },
      onCompleted: () => {
        toast.success(
          [formatMessage(messages.registrationCompleted), lawyer?.label]
            .filter(Boolean)
            .join(' '),
        )
      },
    })

  // TODO: How to handle error
  const handleSubmitForm = async () => {
    popUp && popUp.setPopUp(false)
    setDefenseChoice(choice)
    setLawyerSelected(lawyer?.label)

    postAction({
      variables: {
        input: {
          caseId: id,
          choice: choice ?? '',
          lawyersNationalId: lawyer?.value,
        },
      },
    })
  }

  useEffect(() => {
    if (defenseChoice) setChoice(defenseChoice)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (defenseChoice !== DefenseDecision.CHOOSING_LAWYER) setLawyer(undefined)
  }, [defenseChoice])

  if (error) {
    return <Problem type="not_found" />
  }

  if (loading) {
    return <LoadingDots />
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

      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <Stack space={3}>
          <RadioButton
            name="defender-choices"
            id={DefenseDecision.NO_DEFENDER}
            label={formatMessage(messages.firstChoiceNoDefender)}
            checked={choice === DefenseDecision.NO_DEFENDER}
            onChange={() => {
              setChoice(DefenseDecision.NO_DEFENDER)
            }}
          />
          <RadioButton
            name="defender-choices"
            id={DefenseDecision.CHOOSING_LAWYER}
            label={formatMessage(messages.secondChoiceChoosingLawyer)}
            checked={choice === DefenseDecision.CHOOSING_LAWYER}
            onChange={() => {
              setChoice(DefenseDecision.CHOOSING_LAWYER)
            }}
          />
          {lawyers && (
            <GridColumn
              span={popUp ? '12/12' : ['12/12', '12/12', '10/12', '6/8', '4/8']}
            >
              <Select
                isClearable
                required={choice === DefenseDecision.CHOOSING_LAWYER}
                label={formatMessage(messages.defenderList)}
                size="xs"
                name="lawyer-choice"
                isLoading={loading}
                onChange={(e) => {
                  if (e && e.value) {
                    setLawyer({
                      label: e.label.toString(),
                      value: e.value?.toString(),
                    })
                    setChoice(DefenseDecision.CHOOSING_LAWYER)
                  }
                }}
                options={lawyers.map((x) => {
                  return {
                    label: x.name + ', ' + x.practice,
                    value: x.nationalId,
                  }
                })}
                value={
                  lawyer ? { label: lawyer.label, value: lawyer.value } : null
                }
                placeholder={formatMessage(messages.chooseDefender)}
              />
            </GridColumn>
          )}
          <RadioButton
            name="defender-choices"
            id={DefenseDecision.DELAY_CHOICE}
            label={formatMessage(messages.thirdChoiceDelayChoice)}
            checked={choice === DefenseDecision.DELAY_CHOICE}
            onChange={() => {
              setChoice(DefenseDecision.DELAY_CHOICE)
            }}
          />
          <RadioButton
            name="defender-choices"
            id={DefenseDecision.CHOOSE_FOR_ME}
            label={formatMessage(messages.fourthChoiceChooseForMe)}
            checked={choice === DefenseDecision.CHOOSE_FOR_ME}
            onChange={() => setChoice(DefenseDecision.CHOOSE_FOR_ME)}
          />
          {!popUp && (
            <Button
              type="submit"
              size="small"
              onClick={handleSubmitForm}
              disabled={submitDisabled}
            >
              {formatMessage(messages.confirm)}
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
                  type="submit"
                  size="small"
                  variant="ghost"
                  onClick={() => popUp.setPopUp(false)}
                >
                  {formatMessage(messages.cancel)}
                </Button>
              </Box>
              <Box>
                <Button
                  size="small"
                  disabled={submitDisabled}
                  onClick={handleSubmitForm}
                >
                  {formatMessage(messages.confirm)}
                </Button>
              </Box>
            </Box>
          )}
        </Stack>
      </form>
    </Box>
  )
}

export default DefenderChoices
