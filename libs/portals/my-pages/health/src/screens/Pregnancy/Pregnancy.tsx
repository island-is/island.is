import { useLocale } from '@island.is/localization'
import {
  InfoCard,
  InfoCardGrid,
  IntroWrapper,
} from '@island.is/portals/my-pages/core'
import { messages } from '../../lib/messages'
import { Button } from '@island.is/island-ui/core'
import { HealthPaths } from '../../lib/paths'

const Pregnancy = () => {
  const { formatMessage } = useLocale()

  return (
    <IntroWrapper
      title={messages.myPregnancy}
      intro={messages.myPregnancyIntro}
      childrenWidthFull
      buttonGroup={[
        <Button
          variant="utility"
          size="small"
          key="button1"
          as="span"
          iconType="outline"
          icon="open"
        >
          <a
            href={formatMessage(messages.readingMaterialPregnancyLink)}
            target="_blank"
            rel="noreferrer"
          >
            {formatMessage(messages.readingMaterialPregnancy)}
          </a>
        </Button>,
      ]}
    >
      <InfoCardGrid
        cards={[
          {
            id: 'pregnancy-questionnaire-card',
            title: formatMessage(messages.questionnaires),
            description: formatMessage(messages.changedLast, {
              arg: '12. mars 2024',
            }),
            to: HealthPaths.HealthQuestionnaires,
          },
          {
            id: 'pregnancy-info-card',
            title: formatMessage(messages.labResults),
            description: formatMessage(messages.changedLast, {
              arg: '22. febrúar 2024',
            }),
            to: HealthPaths.HealthQuestionnaires,
          },
          {
            id: 'pregnancy-info-card',
            title: formatMessage(messages.infoMaterial),
            description: formatMessage(messages.changedLast, {
              arg: '10. janúar 2024',
            }),
            to: HealthPaths.HealthQuestionnaires,
          },
          {
            id: 'pregnancy-measurements-card',
            title: formatMessage(messages.measurements),
            description: formatMessage(messages.changedLast, {
              arg: '29. desember 2023',
            }),
            to: HealthPaths.HealthPregnancyMeasurements,
          },
        ]}
      />
      <InfoCard
        size="large"
        variant="detail"
        fontSize="medium"
        detail={[
          {
            label: formatMessage(messages.pregnancyLength),
            value: '19 vikur + 2 dagar',
          },
          {
            label: formatMessage(messages.dueDatePregnancy),
            value: '08.07.2026',
          },
          {
            label: formatMessage(messages.midwife),
            value: 'Sigríður Gunnardsóttir',
          },
          {
            label: formatMessage(messages.partner),
            value: 'Sighvatur Guðbjartsson',
          },
        ]}
        img="./assets/images/baby.svg"
      />
    </IntroWrapper>
  )
}

export default Pregnancy
