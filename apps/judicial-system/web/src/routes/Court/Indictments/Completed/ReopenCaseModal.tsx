import { FC, useState } from 'react'
import { useRouter } from 'next/router'

import { Box, Input, Text } from '@island.is/island-ui/core'
import { DISTRICT_COURT_INDICTMENT_CASE_COURT_OVERVIEW_ROUTE } from '@island.is/judicial-system/consts'
import {
  isCompletedCase,
  isDistrictCourtUser,
  isIndictmentCase,
} from '@island.is/judicial-system/types'
import { Modal } from '@island.is/judicial-system-web/src/components'
import {
  AppealCaseState,
  Case,
  CaseIndictmentRulingDecision,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { isSentToPublicProsecutor } from '@island.is/judicial-system-web/src/utils/utils'

export const canReopenCase = (workingCase: Case, user?: User) => {
  if (
    !isIndictmentCase(workingCase.type) ||
    !isCompletedCase(workingCase.state)
  ) {
    return false
  }

  // Rulings and fines go through a public prosecutor review step after completion
  // ("Sakamál í frágangi"). They can only be reopened once they have actually been
  // sent to the public prosecutor. Other completed decisions (e.g. dismissal or
  // cancellation) have no such step and can be reopened as soon as they are completed.
  const requiresPublicProsecutorReview =
    workingCase.indictmentRulingDecision ===
      CaseIndictmentRulingDecision.RULING ||
    workingCase.indictmentRulingDecision === CaseIndictmentRulingDecision.FINE

  return (
    isDistrictCourtUser(user) &&
    !workingCase.mergeCase &&
    workingCase.indictmentRulingDecision !==
      CaseIndictmentRulingDecision.WITHDRAWAL &&
    (!requiresPublicProsecutorReview ||
      isSentToPublicProsecutor(workingCase)) &&
    (!workingCase.appealCase ||
      workingCase.appealCase.appealState === AppealCaseState.COMPLETED ||
      workingCase.appealCase.appealState === AppealCaseState.WITHDRAWN)
  )
}

interface Props {
  workingCase: Case
  onClose: () => void
}

const ReopenCaseModal: FC<Props> = ({ workingCase, onClose }) => {
  const { updateCase } = useCase()
  const router = useRouter()

  const [reopenReason, setReopenReason] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  return (
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
              <Text variant={i === 3 ? 'h5' : 'default'}>{item}</Text>
            </li>
          ))}
        </ul>
      }
      secondaryButton={{
        text: 'Hætta við',
        onClick: onClose,
      }}
      primaryButton={{
        text: 'Halda áfram',
        colorScheme: 'destructive',
        isDisabled: !reopenReason.trim() || isSubmitting,
        onClick: async () => {
          if (!reopenReason.trim()) {
            return
          }
          setIsSubmitting(true)
          try {
            const updated = await updateCase(workingCase.id, {
              reopenReason,
            })
            if (updated) {
              router.push(
                `${DISTRICT_COURT_INDICTMENT_CASE_COURT_OVERVIEW_ROUTE}/${workingCase.id}`,
              )
            }
          } finally {
            setIsSubmitting(false)
          }
        },
      }}
    >
      <Box marginBottom={4}>
        <Input
          name="reopenReason"
          label="Ástæða enduropnunar máls"
          placeholder="Skráðu ástæðu enduropnunar máls, t.d. vegna endurupptöku eða niðurstöðu Landsréttar."
          textarea
          rows={6}
          value={reopenReason}
          onChange={(e) => setReopenReason(e.target.value)}
          required
        />
      </Box>
    </Modal>
  )
}

export default ReopenCaseModal
