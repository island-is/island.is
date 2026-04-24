import { FC, useState } from 'react'
import { IntlShape, useIntl } from 'react-intl'
import flatMap from 'lodash/flatMap'

import { AnimatePresence } from 'motion/react'

import { Box, Tag, Text } from '@island.is/island-ui/core'
import {
  capitalize,
  enumerate,
  formatDate,
} from '@island.is/judicial-system/formatters'
import {
  isCompletedCase,
  isIndictmentCase,
} from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'
import {
  Case,
  CaseType,
  Defendant,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { getAppealActorText } from '@island.is/judicial-system-web/src/utils/utils'

import { strings } from './CaseInfo.strings'
import IconButton from '../IconButton/IconButton'
import Modal from '../Modals/Modal/Modal'

const PoliceCaseNumbersTags: FC<{
  policeCaseNumbers?: string[] | null
}> = ({ policeCaseNumbers }) => (
  <Box display="flex" flexWrap="wrap" columnGap={1} rowGap={1}>
    {policeCaseNumbers?.map((policeCaseNumber, index) => (
      <Tag disabled key={`${policeCaseNumber}-${index}`}>
        {policeCaseNumber}
      </Tag>
    ))}
  </Box>
)

const Entry: FC<{ label: string; value: string }> = ({ label, value }) => {
  return (
    <Text color="dark400" fontWeight="semiBold">
      {`${label}: ${value}`}
    </Text>
  )
}

export const getDefendantLabel = (
  formatMessage: IntlShape['formatMessage'],
  defendants: Defendant[],
  type?: CaseType | null,
) => {
  if (!isIndictmentCase(type)) {
    return formatMessage(core.defendant, {
      suffix: defendants.length > 1 ? 'ar' : 'i',
    })
  }

  if (defendants.length === 1) {
    return formatMessage(core.indictmentDefendant, {
      gender: defendants[0].gender,
    })
  }

  return formatMessage(core.indictmentDefendants)
}

interface Props {
  workingCase: Case
}

const Defendants: FC<Props> = ({ workingCase }) => {
  const { defendants, type } = workingCase
  const { formatMessage } = useIntl()

  if (!defendants) return null

  return (
    <Entry
      label={capitalize(getDefendantLabel(formatMessage, defendants, type))}
      value={enumerate(
        flatMap(defendants, (d) => (d.name ? [d.name] : [])),
        formatMessage(core.and),
      )}
    />
  )
}

const Prosecutor: FC<Props> = ({ workingCase }) => {
  const { formatMessage } = useIntl()
  if (!workingCase.prosecutorsOffice?.name) {
    return null
  }

  return (
    <Entry
      label={formatMessage(core.prosecutor)}
      value={workingCase.prosecutorsOffice.name}
    />
  )
}

export const ProsecutorCaseInfo: FC<
  Props & { hideCourt?: boolean; hideDefendants?: boolean }
> = ({ workingCase, hideCourt = false, hideDefendants = false }) => {
  const { policeCaseNumbers, court } = workingCase
  const { formatMessage } = useIntl()

  return (
    <Box component="section" display="flex" flexDirection="column" rowGap={1}>
      <PoliceCaseNumbersTags policeCaseNumbers={policeCaseNumbers} />
      {!hideCourt && court?.name && (
        <Entry label={formatMessage(core.court)} value={court?.name} />
      )}
      {!hideDefendants && <Defendants workingCase={workingCase} />}
    </Box>
  )
}

export const ProsecutorAndDefendantsEntries: FC<Props> = ({
  workingCase,
}: {
  workingCase: Case
}) => (
  <Box display="flex" flexDirection="column" rowGap={1}>
    <Prosecutor workingCase={workingCase} />
    <Defendants workingCase={workingCase} />
  </Box>
)

export const CourtCaseInfo: FC<Props> = ({ workingCase }) => {
  const { formatMessage } = useIntl()
  const [modalVisible, setModalVisible] = useState<'REOPEN'>()

  return (
    <>
      <Box component="section" marginBottom={5}>
        {workingCase.courtCaseNumber && (
          <Box marginBottom={1}>
            <Text variant="h2" as="h2">
              {formatMessage(core.caseNumber, {
                caseNumber: workingCase.courtCaseNumber,
              })}
            </Text>
          </Box>
        )}
        {isIndictmentCase(workingCase.type) &&
        isCompletedCase(workingCase.state) ? (
          <Box marginTop={1}>
            <Box display="flex" columnGap={1} alignItems="center">
              <Text as="h5" variant="h5">
                {formatMessage(strings.rulingDate, {
                  rulingDate: `${formatDate(workingCase.rulingDate, 'PPP')}`,
                })}
              </Text>
              <IconButton
                icon="undo"
                colorScheme="blue"
                tooltipText="Enduropna mál"
                size="small"
                onClick={() => setModalVisible('REOPEN')}
              />
            </Box>
            {workingCase.appealedDate && (
              <Box marginBottom={1}>
                <Text as="h5" variant="h5">
                  {getAppealActorText(workingCase)}
                </Text>
              </Box>
            )}
          </Box>
        ) : (
          <ProsecutorAndDefendantsEntries workingCase={workingCase} />
        )}
      </Box>
      <AnimatePresence>
        {modalVisible === 'REOPEN' && (
          <Modal
            title="Viltu opna mál aftur?"
            text={
              <ul style={{ listStyle: 'outside', paddingLeft: '24px' }}>
                {[
                  'Málið verður opnað að nýju, fyrri lyktum verður eytt og ljúka þarf málinu að nýju með nýrri dómsúrlausn.',
                  'Aðilar máls fá tilkynningu um að málið hafi verið opnað að nýju, eftir atvikum ríkissaksóknari og Fangelsismálastofnun einnig.',
                  'Ástæða enduropnunar verður sýnileg aðilum máls.',
                  'Athugið - aðgerðin er óafturkræf',
                ].map((item, i) => (
                  <li key={item}>
                    <Text color={i === 3 ? 'red400' : 'dark400'}>{item}</Text>
                  </li>
                ))}
              </ul>
            }
            secondaryButton={{
              text: 'Hætta við',
              onClick: () => setModalVisible(undefined),
            }}
            primaryButton={{
              text: 'Halda áfram',
              colorScheme: 'destructive',
              onClick: () => setModalVisible(undefined),
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
