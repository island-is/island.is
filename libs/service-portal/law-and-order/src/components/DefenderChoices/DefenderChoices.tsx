import {
  Box,
  Text,
  Button,
  Stack,
  RadioButton,
  toast,
  Select,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { messages } from '../../lib/messages'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { DefenseDecision } from '../../lib/const'
import { getLawyers } from '../../helpers/mockData'
import { useLawAndOrderContext } from '../../helpers/LawAndOrderContext'

interface Props {
  popUp?: {
    setPopUp: Dispatch<SetStateAction<boolean>>
  }
}

const DefenderChoices: FC<React.PropsWithChildren<Props>> = ({ popUp }) => {
  useNamespaces('sp.law-and-order')
  const { formatMessage } = useLocale()
  const [lawyer, setLawyer] = useState<string | null>()
  const [choice, setChoice] = useState<DefenseDecision>()
  const { data } = getLawyers()
  const { defenseChoice, setDefenseChoice } = useLawAndOrderContext()
  const submitDisabled =
    !choice || (choice === DefenseDecision.CHOOSING_LAWYER && !lawyer)

  useEffect(() => {
    if (defenseChoice) setChoice(defenseChoice)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (defenseChoice !== DefenseDecision.CHOOSING_LAWYER) setLawyer(null)
  }, [defenseChoice])

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
        <Select
          isClearable
          required={choice === DefenseDecision.CHOOSING_LAWYER}
          label={formatMessage(messages.defenderList)}
          size="xs"
          name="lawyer-choice"
          onChange={(e) => {
            setLawyer(e?.value.toString())
            setChoice(DefenseDecision.CHOOSING_LAWYER)
          }}
          options={data.items.map((x) => {
            return { label: x.name, value: x.name }
          })}
          value={lawyer ? { label: lawyer, value: lawyer } : null}
          placeholder={formatMessage(messages.chooseDefender)}
        />
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
            size="small"
            onClick={() => {
              toast.success(
                [formatMessage(messages.registrationCompleted), lawyer]
                  .filter(Boolean)
                  .join(' '),
              )
              setTimeout(() => setDefenseChoice(choice), 500)
            }}
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
                onClick={() => {
                  toast.success(
                    [formatMessage(messages.registrationCompleted), lawyer]
                      .filter(Boolean)
                      .join(' '),
                  )
                  popUp.setPopUp(false)
                  setDefenseChoice(choice)
                }}
              >
                {formatMessage(messages.confirm)}
              </Button>
            </Box>
          </Box>
        )}
      </Stack>
    </Box>
  )
}

export default DefenderChoices
