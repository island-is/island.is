import React, { useMemo, useState } from 'react'
import {
  Box,
  Button,
  DatePicker,
  Divider,
  Inline,
  Option,
  Select,
  Text,
} from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { StepComponent } from '../state/useDraftingState'
import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { editorMsgs as msg } from '../messages'
import {
  emptyOption,
  findAffectedRegulationsInText,
  findValueOption,
} from '../utils'
import { RegName } from '@island.is/regulations'

import { mockRegulationOptions, useMockQuery } from '../_mockData'

// const RegulationListQuery = gql`
//   query RegulationListQuery {
//     getRegulationList
//   }
// `

// ---------------------------------------------------------------------------

export const EditImpacts: StepComponent = (props) => {
  const { draft, actions } = props
  // const { ... } = actions
  const t = useIntl().formatMessage
  // const textRef = useRef(() => draft.text)

  const regTitle = draft.title.value
  const regText = draft.text.value

  const mentionRegNames = useMemo(
    () => findAffectedRegulationsInText(regTitle, regText),
    [regTitle, regText],
  )

  // FIXME: Remove the any typing on these...
  const mentionedQuery = useMockQuery(
    mockRegulationOptions.filter(({ name }) => mentionRegNames.includes(name)),
  )
  const mentionedRegs = mentionedQuery.data

  const [selReg, setSelReg] = useState<RegName>()
  const [effectiveDate, setEffectiveDate] = useState<Date>()

  const mentionedOptions = useMemo(
    (): ReadonlyArray<Option> =>
      (mentionedRegs || []).map((r) => ({
        value: r.name,
        label: r.name + ' – ' + r.title,
      })),
    [mentionedRegs],
  )

  if (mentionedQuery.loading) {
    return null
  }

  return (
    <>
      {JSON.stringify(mentionRegNames)}

      <Box marginBottom={3}>
        <Select
          size="sm"
          label={t(msg.impactRegSelect)}
          name="reg"
          placeholder={t(msg.impactRegSelect_placeholder)}
          value={findValueOption(mentionedOptions, selReg)}
          options={mentionedOptions}
          onChange={(option) => setSelReg((option as Option).value as RegName)}
        />
      </Box>

      <Box marginBottom={4} width="half">
        <DatePicker
          size="sm"
          label={t(msg.effectiveDate)}
          placeholderText={t(msg.effectiveDate_default)}
          minDate={draft.effectiveDate.value || draft.idealPublishDate.value}
          selected={effectiveDate}
          handleChange={setEffectiveDate}
          hasError={!!draft.effectiveDate.error}
          errorMessage={t(msg.requiredFieldError)}
        />
        {!!draft.effectiveDate.value && (
          <Button
            size="small"
            variant="text"
            preTextIcon="close"
            onClick={() => setEffectiveDate(undefined)}
          >
            {t(msg.effectiveDate_default)}
          </Button>
        )}
      </Box>
      <Box marginBottom={[4, 4, 8]}>
        <Box marginBottom={4}>
          <Divider />
        </Box>
        <p>&nbsp;</p>
        <Text variant="h4" as="h4" marginBottom={[2, 2, 3, 4]}>
          {t(msg.chooseImpactType)}
        </Text>
        <Inline space={[2, 2, 3, 4]} align="center" alignY="center">
          <Button variant="ghost" icon="fileTrayFull" iconType="outline">
            {t(msg.chooseImpactType_cancel)}
          </Button>
          <span> {t(msg.chooseImpactType_or)} </span>
          <Button variant="ghost" icon="document" iconType="outline">
            {t(msg.chooseImpactType_change)}
          </Button>
        </Inline>
        <Box marginTop={[4, 4, 8]}>
          <Divider />
        </Box>
      </Box>
    </>
  )
}
