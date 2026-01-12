import {
  LawAndOrderAppealDecision,
  LawAndOrderItemType,
} from '@island.is/api/schema'
import { Divider, toast } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  DOMSMALARADUNEYTID_SLUG,
  InfoLine,
  IntroWrapper,
  m,
  Modal,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppealForm } from '../../components/VerdictInfoLines/AppealForm'
import VerdictInfoLines from '../../components/VerdictInfoLines/VerdictInfoLines'
import { messages } from '../../lib/messages'
import {
  useGetCourtCaseVerdictQuery,
  useSubmitVerdictAppealDecisionMutation,
} from './Verdict.generated'

type UseParams = {
  id: string
}

const CourtCaseDetail = () => {
  useNamespaces('sp.law-and-order')
  const { formatMessage, lang } = useLocale()
  const { id } = useParams() as UseParams
  const [verdictPopUp, setVerdictPopUp] = useState(false)

  const { data, loading, error } = useGetCourtCaseVerdictQuery({
    variables: {
      input: {
        caseId: id,
      },
      locale: lang,
    },
    skip: !id,
  })
  const verdict = data?.lawAndOrderVerdict
  const radioButtonGroup = verdict?.groups?.find((g) =>
    g.items?.some((item) => item.type === LawAndOrderItemType.RadioButton),
  )
  const [
    submitVerdictAppealDecision,
    { loading: postLoading, data: postData },
  ] = useSubmitVerdictAppealDecisionMutation()

  // Use postData if available (after submission), otherwise fall back to verdict data.
  const currentAppealDecision = useMemo(() => {
    return (
      postData?.lawAndOrderVerdictPost?.appealDecision ??
      verdict?.appealDecision
    )
  }, [
    postData?.lawAndOrderVerdictPost?.appealDecision,
    verdict?.appealDecision,
  ])

  const currentCanAppeal = useMemo(() => {
    return postData?.lawAndOrderVerdictPost?.canAppeal ?? verdict?.canAppeal
  }, [postData?.lawAndOrderVerdictPost?.canAppeal, verdict?.canAppeal])

  const handleSubmit = async (
    data: Record<string, unknown>,
  ): Promise<boolean> => {
    const choice = Object.values(data)[0] as LawAndOrderAppealDecision

    return await submitVerdictAppealDecision({
      variables: {
        locale: lang,
        input: { caseId: id, choice },
      },
    })
      .then((response) => {
        if (response.data?.lawAndOrderVerdictPost?.appealDecision) {
          toast.success(formatMessage(messages.registrationCompleted))
          setVerdictPopUp(false)
          return true
        } else {
          toast.error(formatMessage(messages.registrationError))
          return false
        }
      })
      .catch(() => {
        toast.error(formatMessage(messages.registrationError))
        return false
      })
  }

  return (
    <IntroWrapper
      loading={loading}
      title={
        verdict?.title ?? formatMessage(messages.courtCaseNumberNotRegistered)
      }
      intro={messages.verdictDescription}
      serviceProviderSlug={DOMSMALARADUNEYTID_SLUG}
      serviceProviderTooltip={formatMessage(m.domsmalaraduneytidTooltip)}
    >
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error && verdict && verdict?.groups && (
        <VerdictInfoLines
          groups={verdict?.groups}
          appealDecision={
            currentCanAppeal
              ? currentAppealDecision ?? LawAndOrderAppealDecision.POSTPONE // Default should be postpone
              : undefined
          }
          loading={loading}
          onFormSubmit={handleSubmit}
          formSubmitMessage={formatMessage(messages.verdictAppealDecisionInfo)}
          formLoading={postLoading}
          modalOpen={verdictPopUp}
          extraInfoLine={
            currentCanAppeal &&
            currentAppealDecision !== LawAndOrderAppealDecision.NO_ANSWER ? (
              <>
                <InfoLine
                  loading={loading}
                  label={messages.verdictAppealDecision}
                  content={
                    currentAppealDecision === LawAndOrderAppealDecision.POSTPONE
                      ? formatMessage(messages.postpone)
                      : formatMessage(messages.appeal)
                  }
                  button={{
                    type: 'action',
                    variant: 'text',
                    label: messages.change,
                    icon: 'pencil',
                    action: () => {
                      setVerdictPopUp(true)
                    },
                    disabled: postLoading,
                    tooltip: formatMessage(messages.verdictAppealDecisionInfo),
                  }}
                />
                <Divider />
              </>
            ) : null
          }
        />
      )}

      {verdictPopUp && radioButtonGroup && (
        <Modal id="verdict-pop-up" onCloseModal={() => setVerdictPopUp(false)}>
          <AppealForm
            popUp
            group={radioButtonGroup}
            appealDecision={currentAppealDecision}
            loading={postLoading}
            onFormSubmit={handleSubmit}
          />
        </Modal>
      )}
      {!loading && !error && verdict && verdict?.groups?.length === 0 && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noData)}
          message={formatMessage(m.noDataFoundDetail)}
          imgSrc="./assets/images/sofa.svg"
        />
      )}
    </IntroWrapper>
  )
}
export default CourtCaseDetail
