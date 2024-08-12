import { useContext } from 'react'
import { useIntl } from 'react-intl'

import { Text } from '@island.is/island-ui/core'
import {
  capitalize,
  formatDate,
  readableIndictmentSubtypes,
} from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages'
import { Case } from '@island.is/judicial-system-web/src/graphql/schema'

import { FormContext } from '../../FormProvider/FormProvider'
import { DefendantInfo } from '../DefendantInfo/DefendantInfo'
import { NameAndEmail } from '../InfoCard'
import { Item } from '../InfoCard__new'
import { strings } from '../InfoCardIndictment.strings'

const useInfoCardItems = () => {
  const { formatMessage } = useIntl()
  const { workingCase } = useContext(FormContext)

  const defendants: Item = {
    id: 'defendant-item',
    title: capitalize(
      workingCase.defendants && workingCase.defendants.length > 1
        ? formatMessage(core.indictmentDefendants)
        : formatMessage(core.indictmentDefendant, {
            gender: workingCase.defendants && workingCase.defendants[0].gender,
          }),
    ),
    values: workingCase.defendants
      ? workingCase.defendants.map((defendant) => (
          <DefendantInfo defendant={defendant} displayDefenderInfo />
        ))
      : [],
  }

  const indictmentCreated: Item = {
    id: 'indictment-created-item',
    title: formatMessage(strings.indictmentCreated),
    values: [formatDate(workingCase.created, 'PP')],
  }

  const prosecutor: Item = {
    id: 'prosecutor-item',
    title: formatMessage(strings.prosecutor),
    values: [
      NameAndEmail(workingCase.prosecutor?.name, workingCase.prosecutor?.email),
    ],
  }

  const policeCaseNumbers: Item = {
    id: 'police-case-number-item',
    title: formatMessage(core.policeCaseNumber),
    values:
      workingCase.policeCaseNumbers?.map((n) => <Text key={n}>{n}</Text>) || [],
  }

  const court: Item = {
    id: 'court-item',
    title: formatMessage(core.court),
    values: [workingCase.court?.name || ''],
  }

  const offences: Item = {
    id: 'offences-item',
    title: formatMessage(strings.offence),
    values: [
      <>
        {readableIndictmentSubtypes(
          workingCase.policeCaseNumbers,
          workingCase.indictmentSubtypes,
        ).map((subtype, index) => (
          <Text key={`${subtype}-${index}`}>{capitalize(subtype)}</Text>
        ))}
      </>,
    ],
  }

  const mergedCasePoliceCaseNumbers = (mergedCase: Case): Item => ({
    id: 'merged-case-police-case-number-item',
    title: formatMessage(core.policeCaseNumber),
    values:
      mergedCase.policeCaseNumbers?.map((n) => <Text key={n}>{n}</Text>) || [],
  })

  const mergedCaseCourtCaseNumber = (mergedCase: Case): Item => ({
    id: 'merged-case-court-case-number-item',
    title: formatMessage(strings.mergedFromTitle),
    values: [<Text>{mergedCase.courtCaseNumber}</Text>],
  })

  const mergedCaseProsecutor = (mergedCase: Case): Item => ({
    id: 'merged-case-prosecutor-item',
    title: formatMessage(core.prosecutor),
    values: [mergedCase.prosecutorsOffice?.name || ''],
  })

  const mergedCaseJudge = (mergedCase: Case): Item => ({
    id: 'merged-case-judge-item',
    title: formatMessage(core.judge),
    values: [mergedCase.judge?.name || ''],
  })

  const mergedCaseCourt = (mergedCase: Case): Item => ({
    id: 'merged-case-court-item',
    title: formatMessage(core.court),
    values: [mergedCase.court?.name || ''],
  })

  return {
    defendants,
    indictmentCreated,
    prosecutor,
    policeCaseNumbers,
    court,
    offences,
    mergedCasePoliceCaseNumbers,
    mergedCaseCourtCaseNumber,
    mergedCaseProsecutor,
    mergedCaseJudge,
    mergedCaseCourt,
  }
}

export default useInfoCardItems
