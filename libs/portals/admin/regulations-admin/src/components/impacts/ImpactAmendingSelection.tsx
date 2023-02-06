import { useEffect, useState } from 'react'

import { impactMsgs } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import {
  ensureRegName,
  RegName,
  RegulationOptionList,
  RegulationType,
} from '@island.is/regulations'
import { DraftImpactName } from '@island.is/regulations/admin'

import { AsyncSearch, Option } from '@island.is/island-ui/core'
import { RegulationOptionListQuery } from '../../utils/dataHooks'
import { formatSelRegOptions } from '../../utils/formatSelRegOptions'
import { useLazyQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { useDebounce } from 'react-use'

export type SelRegOption = Option & {
  value?: DraftImpactName | ''
  type: RegulationType | ''
  migrated?: boolean
}

type ImpactAmendingSelectionProps = {
  setImpactRegOption: (option: SelRegOption) => void
}

// ---------------------------------------------------------------------------

export const ImpactAmendingSelection = ({
  setImpactRegOption,
}: ImpactAmendingSelectionProps) => {
  const [selRegOptions, setSelRegOptions] = useState<
    SelRegOption[] | undefined
  >()
  const [isLoading, setIsLoading] = useState(false)
  const [value, setValue] = useState<string | undefined>()
  const t = useLocale().formatMessage

  const [
    getRegulationList,
    { data: regulationList, loading, error },
  ] = useLazyQuery<Query>(RegulationOptionListQuery, {
    fetchPolicy: 'no-cache',
  })

  const handleOptionSelect = (selected: SelRegOption) => {
    setImpactRegOption(selected)
  }

  useDebounce(
    () => {
      if (ensureRegName(value)) {
        getRegulationList({
          variables: { input: { names: [value] } },
        })
      }
      setIsLoading(false)
    },
    500,
    [value],
  )

  useEffect(() => {
    const regulationListRes =
      (regulationList?.getRegulationOptionList as RegulationOptionList) || []

    const optionNames = regulationListRes
      .filter((reg) => reg.type === 'base')
      .map((reg) => reg.name)

    let selRegOptionsArray: SelRegOption[] = []

    if (optionNames.length) {
      selRegOptionsArray = formatSelRegOptions(
        optionNames,
        t(impactMsgs.regSelect_mentionedNotFound),
        t(impactMsgs.regSelect_mentionedRepealed),
        regulationListRes,
      )
    } else if (ensureRegName(value)) {
      selRegOptionsArray = [
        {
          type: '',
          disabled: true,
          value: '',
          label: t(impactMsgs.regSelect_baseNotFound) + ' ' + value,
        },
      ]
    }

    setSelRegOptions(selRegOptionsArray)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regulationList, value])

  const updateValue = (val: string) => {
    setIsLoading(val !== value)
    setValue(val)
  }

  return (
    <AsyncSearch
      placeholder={t(impactMsgs.regSelectAmmending_placeholder)}
      onInputValueChange={(newValue) => updateValue(newValue)}
      loading={loading || isLoading}
      onSubmit={(newValue) => updateValue(newValue)}
      options={selRegOptions || []}
      inputValue={value}
      initialInputValue={undefined}
      label={t(impactMsgs.regSelect)}
      onChange={(i, option) => {
        handleOptionSelect(option.selectedItem as SelRegOption)
      }}
    />
  )
}
