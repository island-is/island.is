import {
  InfoLine,
  InfoLineStack,
  IntroWrapper,
  MMS_SLUG,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { generalEducationMessages as m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { Box } from '@island.is/island-ui/core'
import { useStudentInfoQuery } from './MyEducation.generated'

export const Overview = () => {
  const { formatMessage } = useLocale()

  const { data, loading, error } = useStudentInfoQuery()

  return (
    <IntroWrapper
      title={formatMessage(m.myEducation)}
      intro={formatMessage(m.myEducationIntro)}
      serviceProviderSlug={MMS_SLUG}
      serviceProviderTooltip={formatMessage(coreMessages.mmsTooltipSecondary)}
    >
      <Box>
        <InfoLineStack
          space={1}
          label={formatMessage(coreMessages.baseInfo)}
          dividerOnBottom={false}
        >
          <InfoLine
            label={formatMessage(m.primarySchool)}
            content={
              data?.educationV3StudentCareer.primarySchoolCareer?.primarySchool
                .name ?? formatMessage(coreMessages.noData)
            }
          />
          <InfoLine
            label={formatMessage(m.secondarySchool)}
            content="Menntaskólinn í Reykjavík"
          />
          <InfoLine
            label={formatMessage(m.university)}
            content="Háskóli Íslands"
          />
          <InfoLine
            label={formatMessage(m.drivingEducation)}
            content="Engin gögn fundust"
          />
        </InfoLineStack>
      </Box>
    </IntroWrapper>
  )
}

export default Overview
