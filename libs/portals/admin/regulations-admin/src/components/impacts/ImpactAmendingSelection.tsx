import { useEffect, useState } from 'react'

import { impactMsgs } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { RegulationOptionList, RegulationType } from '@island.is/regulations'
import { DraftImpactName } from '@island.is/regulations/admin'

import { AsyncSearch, Option } from '@island.is/island-ui/core'
import { RegulationSearchListQuery } from '../../utils/dataHooks'
import { formatSelRegOptions } from '../../utils/formatSelRegOptions'
import { useLazyQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { useDebounce } from 'react-use'
import * as s from './Impacts.css'

export type SelRegOption = Option<DraftImpactName | ''> & {
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
  const [results, setResults] = useState<RegulationOptionList | undefined>()
  const [value, setValue] = useState<string | undefined>()
  const t = useLocale().formatMessage

  const [getRegulationList, { loading, error }] = useLazyQuery<Query>(
    RegulationSearchListQuery,
    {
      onCompleted: (data) => {
        setResults(
          (data.getRegulationsOptionSearch as RegulationOptionList) ||
            undefined,
        )
      },
      fetchPolicy: 'no-cache',
    },
  )

  const handleOptionSelect = (selected: SelRegOption) => {
    setImpactRegOption(selected)
  }

  useDebounce(
    () => {
      if (value && value.length > 0) {
        getRegulationList({
          /**
           * Exclude these from the search.
           * iA: amending
           * iR: repealed
           * */
          variables: { input: { q: value, iA: false, iR: false } },
        })
      }
      setIsLoading(false)
    },
    600,
    [value],
  )

  useEffect(() => {
    const regulationListRes =
      (results && results.length > 0 && (results as RegulationOptionList)) || []

    const optionNames = regulationListRes.map((reg) => reg.name)

    let selRegOptionsArray: SelRegOption[] = []

    if (optionNames.length) {
      selRegOptionsArray = formatSelRegOptions(
        optionNames,
        t(impactMsgs.regSelect_mentionedNotFound),
        t(impactMsgs.regSelect_mentionedRepealed),
        regulationListRes,
      )
    } else {
      selRegOptionsArray = [
        {
          type: '',
          disabled: true,
          value: '',
          label:
            results && results.length > 0
              ? t(impactMsgs.regSelect_baseNotFound) + ' ' + value
              : 'Nafn reglugerðar ekki rétt slegið inn',
        },
      ]
    }

    setSelRegOptions(selRegOptionsArray)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results, value])

  const updateValue = (val: string) => {
    setIsLoading(val !== value)
    setValue(val)
  }

  return (
    <div className={s.amendingSelectionOption}>
      <AsyncSearch
        placeholder={t(impactMsgs.regSelectAmmending_placeholder)}
        onInputValueChange={(newValue) => updateValue(newValue)}
        loading={loading || isLoading}
        onSubmit={(newValue) => {
          updateValue(newValue)
        }}
        options={selRegOptions || []}
        inputValue={value}
        initialInputValue={undefined}
        label={t(impactMsgs.regSelect)}
        onChange={(option) => {
          return option?.disabled
            ? false
            : handleOptionSelect(option as SelRegOption)
        }}
      />
    </div>
  )
}
