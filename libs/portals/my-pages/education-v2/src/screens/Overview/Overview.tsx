import {
  InfoLine,
  InfoLineStack,
  IntroWrapper,
  MENNTAMALASTOFNUN_SLUG,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { Box } from '@island.is/island-ui/core'
import { useStudentInfoQuery } from './Overview.generated'

export const Overview = () => {
  const { formatMessage } = useLocale()

  const { data, loading, error } = useStudentInfoQuery()

  return (
    <IntroWrapper
      title={formatMessage(m.myEducation)}
      intro={formatMessage(m.myEducationIntro)}
      serviceProviderSlug={MENNTAMALASTOFNUN_SLUG}
      serviceProviderTooltip={formatMessage(coreMessages.mmsTooltipSecondary)}
    >
      <Box>
        <InfoLineStack label={formatMessage(coreMessages.baseInfo)}>
          <InfoLine
            label={formatMessage(m.primarySchool)}
            content={
              data?.educationV3StudentCareer.primarySchoolCareer?.primarySchool
                .name ?? undefined
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
        </InfoLineStack>
      </Box>
    </IntroWrapper>
  )
}

export default Overview
