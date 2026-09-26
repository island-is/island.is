import { QuestionnaireQuestionnairesStatusEnum as QuestionnairesStatusEnum } from '@island.is/api/schema'
import { Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  IntroWrapper,
  LinkButton,
  STAFRAEN_HEILSA_SLUG,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { useParams } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { useHealthPlausibleSwap } from '../../utils/useHealthPlausibleSwap'
import QuestionnaireCard from '../Questionnaires/components/QuestionnaireCard'
import { useGetTreatmentQuestionnairesQuery } from './TreatmentQuestionnaires.generated'

type UseParams = {
  treatmentId: string
}

const TreatmentQuestionnaires = () => {
  useNamespaces('sp.health')
  useHealthPlausibleSwap()
  const { formatMessage, lang } = useLocale()
  const { treatmentId } = useParams() as UseParams

  const { data, loading, error } = useGetTreatmentQuestionnairesQuery({
    variables: { input: { treatmentId }, locale: lang },
    fetchPolicy: 'network-only',
  })

  // Expired questionnaires are only shown on the main questionnaires page
  const questionnaires = (
    data?.questionnairesTreatmentList?.questionnaires ?? []
  ).filter((item) => item.status !== QuestionnairesStatusEnum.expired)

  return (
    <IntroWrapper
      title={formatMessage(messages.treatmentQuestionnaires)}
      intro={formatMessage(messages.treatmentQuestionnairesIntro)}
      serviceProvider={{
        slug: STAFRAEN_HEILSA_SLUG,
        tooltip: formatMessage(messages.stafraenHeilsaTreatmentTooltip),
      }}
      buttonGroup={{
        actions: [
          <LinkButton
            key="all-questionnaires"
            to={HealthPaths.HealthQuestionnaires}
            text={formatMessage(messages.allQuestionnaires)}
            icon="arrowForward"
            variant="utility"
          />,
        ],
      }}
      desktopContentSpan="10/12"
    >
      {error && !loading ? (
        <Problem type="internal_service_error" noBorder={false} error={error} />
      ) : loading ? (
        <CardLoader />
      ) : questionnaires.length === 0 ? (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(messages.noData)}
          message={formatMessage(messages.noTreatmentQuestionnaires)}
          imgSrc="./assets/images/empty_flower.svg"
          imgAlt=""
        />
      ) : (
        <Stack space={3}>
          {questionnaires.map((questionnaire) => (
            <QuestionnaireCard
              key={questionnaire.id}
              questionnaire={questionnaire}
            />
          ))}
        </Stack>
      )}
    </IntroWrapper>
  )
}

export default TreatmentQuestionnaires
