import * as s from './EditImpacts.css'

import React, { useCallback, useMemo, useState } from 'react'
import {
  Box,
  Button,
  DatePicker,
  Divider,
  Inline,
  Link,
  Option,
  Select,
  Text,
} from '@island.is/island-ui/core'
import { StepComponent } from '../state/useDraftingState'
import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { editorMsgs as msg } from '../messages'
import {
  emptyOption,
  findAffectedRegulationsInText,
  findValueOption,
  useLocale,
} from '../utils'
import { RegName } from '@island.is/regulations'

import { mockRegulationOptions, useMockQuery } from '../_mockData'
import { MessageDescriptor } from '@formatjs/intl'
import { generatePath } from 'react-router'
import { ServicePortalPath } from '@island.is/service-portal/core'

// const RegulationListQuery = gql`
//   query RegulationListQuery {
//     getRegulationList
//   }
// `

// ---------------------------------------------------------------------------

export const EditImpacts: StepComponent = (props) => {
  const { draft, actions } = props
  // const { ... } = actions
  const t = useLocale().formatMessage
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

  const minEffectiveDate =
    draft.effectiveDate.value || draft.idealPublishDate.value

  const [selReg, setSelReg] = useState<RegName>()
  const [effectiveDate, setRawEffectiveDate] = useState<{
    value?: Date | undefined
    error?: string | MessageDescriptor
  }>({})

  const setEffectiveDate = useCallback(
    (value: Date | undefined) => {
      if (value && minEffectiveDate && value < minEffectiveDate) {
        setRawEffectiveDate({ value, error: msg.impactEffectiveDate_toosoon })
        return
      }
      setRawEffectiveDate({ value, error: undefined })
    },
    [minEffectiveDate],
  )

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
      {/* <pre>{JSON.stringify(mentionRegNames, null, 2)}</pre> */}

      <Box marginBottom={3} className={s.explainerText}>
        {t(msg.impactRegExplainer)}{' '}
        <Link
          href="."
          // href={generatePath(ServicePortalPath.RegulationsAdminEdit, {
          //   id: draft.id,
          //   step: 'basics',
          // })}
        >
          {t(msg.impactRegExplainer_editLink)}
        </Link>
      </Box>

      <Box marginBottom={3}>
        <Select
          size="sm"
          label={t(msg.impactRegSelect)}
          name="reg"
          placeholder={t(msg.impactRegSelect_placeholder)}
          value={findValueOption(mentionedOptions, selReg)}
          options={mentionedOptions}
          onChange={(option) => setSelReg((option as Option).value as RegName)}
          backgroundColor="blue"
        />
      </Box>

      <Box marginBottom={4} width="half">
        <DatePicker
          size="sm"
          label={t(msg.impactEffectiveDate)}
          placeholderText={t(msg.impactEffectiveDate_default)}
          minDate={minEffectiveDate}
          selected={effectiveDate.value}
          handleChange={setEffectiveDate}
          hasError={!!effectiveDate.error}
          errorMessage={t(effectiveDate.error)}
          backgroundColor="blue"
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
        <Box marginBottom={2}>
          <Divider weight="regular" />
          {' '}
        </Box>
        <Text variant="h4" as="h4" marginBottom={[2, 2, 3, 4]}>
          {t(msg.chooseImpactType)}
        </Text>
        <Inline space={[2, 2, 3, 4]} align="center" alignY="center">
          <Button variant="ghost" icon="document" iconType="outline">
            {t(msg.chooseImpactType_change)}
          </Button>
          <span> {t(msg.chooseImpactType_or)} </span>
          <Button variant="ghost" icon="fileTrayFull" iconType="outline">
            {t(msg.chooseImpactType_cancel)}
          </Button>
        </Inline>
        <Box marginTop={[2, 2, 6]}>
          <Divider />
          {' '}
        </Box>
      </Box>
    </>
  )
}
