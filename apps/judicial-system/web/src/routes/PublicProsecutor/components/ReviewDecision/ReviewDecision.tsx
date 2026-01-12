import { Dispatch, FC, SetStateAction, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { RadioButton, Text } from '@island.is/island-ui/core'
import { getStandardUserDashboardRoute } from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  isPublicProsecutionOfficeUser,
  isPublicProsecutionUser,
} from '@island.is/judicial-system/types'
import {
  BlueBox,
  Modal,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { IndictmentCaseReviewDecision } from '@island.is/judicial-system-web/src/graphql/schema'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

import { ConfirmationModal, isConfirmProsecutorDecisionModal } from '../utils'
import { strings } from './ReviewDecision.strings'
import * as styles from './ReviewDecision.css'

interface Props {
  caseId: string
  currentDecision?: IndictmentCaseReviewDecision
  indictmentAppealDeadline?: string
  indictmentAppealDeadlineIsInThePast?: boolean
  modalVisible?: ConfirmationModal
  setModalVisible: Dispatch<SetStateAction<ConfirmationModal | undefined>>
  isFine: boolean
  onSelect?: (decision?: IndictmentCaseReviewDecision) => void
}

export const ReviewDecision: FC<Props> = (props) => {
  const {
    caseId,
    currentDecision,
    indictmentAppealDeadline,
    indictmentAppealDeadlineIsInThePast,
    modalVisible,
    setModalVisible,
    isFine,
    onSelect,
  } = props

  const { user } = useContext(UserContext)
  const router = useRouter()
  const { formatMessage: fm } = useIntl()
  const { updateCase } = useCase()
  const [indictmentReviewDecision, setIndictmentReviewDecision] = useState<
    IndictmentCaseReviewDecision | undefined
  >(currentDecision)

  const handleReviewDecision = async () => {
    if (!indictmentReviewDecision) {
      return
    }
    const updateSuccess = await updateCase(caseId, {
      indictmentReviewDecision: indictmentReviewDecision,
    })
    if (updateSuccess) {
      router.push(getStandardUserDashboardRoute(user))
    }
  }

  const options = [
    {
      label: fm(
        isFine
          ? strings.appealFineToCourtOfAppeals
          : strings.appealToCourtOfAppeals,
      ),
      value: IndictmentCaseReviewDecision.APPEAL,
    },
    {
      label: fm(isFine ? strings.acceptFineDecision : strings.acceptDecision),
      value: IndictmentCaseReviewDecision.ACCEPT,
    },
  ]

  if (!(isPublicProsecutionUser(user) || isPublicProsecutionOfficeUser(user))) {
    return null
  }

  return (
    <>
      <SectionHeading
        title={fm(strings.title, { isFine })}
        description={
          <Text variant="eyebrow" as="span">
            {fm(strings.subtitle, {
              isFine,
              indictmentAppealDeadline: formatDate(indictmentAppealDeadline),
              appealDeadlineIsInThePast: indictmentAppealDeadlineIsInThePast,
            })}
          </Text>
        }
      />
      <BlueBox>
        <div className={styles.gridRow}>
          {options.map((item, index) => {
            return (
              <RadioButton
                key={item.label}
                name={`reviewOption-${index}`}
                label={item.label}
                value={item.value}
                checked={indictmentReviewDecision === item.value}
                onChange={() => {
                  onSelect && onSelect(item.value)
                  setIndictmentReviewDecision(item.value)
                }}
                backgroundColor="white"
                large
              />
            )
          })}
        </div>
      </BlueBox>
      {isConfirmProsecutorDecisionModal(modalVisible) && (
        <Modal
          title={fm(strings.reviewModalTitle)}
          text={fm(
            isFine ? strings.reviewModalTextFine : strings.reviewModalText,
            {
              reviewerDecision: indictmentReviewDecision,
            },
          )}
          primaryButton={{
            text: fm(strings.reviewModalPrimaryButtonText),
            onClick: handleReviewDecision,
          }}
          secondaryButton={{
            text: fm(strings.reviewModalSecondaryButtonText),
            onClick: () => setModalVisible(undefined),
          }}
          onClose={() => setModalVisible(undefined)}
        />
      )}
    </>
  )
}
