import { useLocale, useNamespaces } from '@island.is/localization'
import {
  DOMSMALARADUNEYTID_SLUG,
  InfoLine,
  IntroWrapper,
  m,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import InfoLines from '../../components/InfoLines/InfoLines'
import { messages } from '../../lib/messages'
import {
  useGetCourtCaseVerdictQuery,
  useSubmitVerdictAppealDecisionMutation,
} from './Verdict.generated'
import { LawAndOrderAppealDecision } from '@island.is/api/schema'
import { Box, Divider, toast } from '@island.is/island-ui/core'

type UseParams = {
  id: string
}

const CourtCaseDetail = () => {
  useNamespaces('sp.law-and-order')
  const { formatMessage, lang } = useLocale()
  const [appealDecision, setAppealDecision] =
    useState<LawAndOrderAppealDecision>()
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

  const [
    submitVerdictAppealDecision,
    { loading: postLoading, data: postData, error: postError },
  ] = useSubmitVerdictAppealDecisionMutation()

  const handleSubmit = async (data: Record<string, unknown>) => {
    const choice = Object.values(data)[0] as LawAndOrderAppealDecision

    await submitVerdictAppealDecision({
      variables: {
        locale: lang,
        input: { caseId: id, choice },
      },
    })
      .then((response) => {
        if (response.data?.lawAndOrderVerdictPost?.appealDecision) {
          setAppealDecision(
            response.data?.lawAndOrderVerdictPost?.appealDecision,
          )
          toast.success(formatMessage(messages.registrationCompleted))
        } else {
          // catch null response or missing appealDecision
          toast.error(formatMessage(messages.registrationError))
        }
      })
      .catch(() => {
        toast.error(formatMessage(messages.registrationError))
      })
  }

  return (
    <IntroWrapper
      loading={loading}
      title={
        verdict?.title ?? formatMessage(messages.courtCaseNumberNotRegistered)
      }
      intro={messages.courtCasesDescription}
      serviceProviderSlug={DOMSMALARADUNEYTID_SLUG}
      serviceProviderTooltip={formatMessage(m.domsmalaraduneytidTooltip)}
    >
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error && verdict && verdict?.groups && (
        <InfoLines
          groups={verdict?.groups}
          appealDecision={
            verdict.canAppeal ? verdict.appealDecision : undefined
          }
          loading={loading}
          onFormSubmit={handleSubmit}
          formSubmitMessage={formatMessage(messages.verdictAppealDecisionInfo)}
          formLoading={postLoading}
          extraInfoLine={
            verdict.canAppeal &&
            (verdict.appealDecision !== LawAndOrderAppealDecision.NO_ANSWER ||
              postData?.lawAndOrderVerdictPost?.appealDecision !==
                LawAndOrderAppealDecision.NO_ANSWER) ? (
              <>
                <InfoLine
                  loading={loading}
                  label={messages.verdictAppealDecision}
                  content={
                    verdict?.appealDecision ===
                    LawAndOrderAppealDecision.POSTPONE
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
