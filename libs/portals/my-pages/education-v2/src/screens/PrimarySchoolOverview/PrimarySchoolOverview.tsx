import {
  InfoLineStack,
  IntroWrapper,
  InfoLine,
  MMS_SLUG,
  m as cm,
} from '@island.is/portals/my-pages/core'
import {
  primarySchoolMessages as pm,
  generalEducationMessages as gm,
} from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { Box } from '@island.is/island-ui/core'

export const Overview = () => {
  const { formatMessage } = useLocale()

  return (
    <IntroWrapper
      title={formatMessage(pm.title)}
      intro={formatMessage(pm.intro)}
      serviceProviderSlug={MMS_SLUG}
      serviceProviderTooltip={formatMessage(cm.mmsTooltipSecondary)}
    >
      <InfoLineStack dividerOnBottom={false} label={formatMessage(cm.baseInfo)}>
        <InfoLine label={formatMessage(gm.student)} content={'Stubba Maack'} />
        <InfoLine
          label={formatMessage(pm.primarySchool)}
          content={'Háteigsskóli'}
          button={{
            type: 'link',
            to: '/education/primary-school',
            label: formatMessage(gm.changeSchools),
            icon: 'arrowForward',
          }}
        />
        <InfoLine
          label={formatMessage(pm.teacher)}
          content={'Stuttli Maacker'}
        />
        <InfoLine label={formatMessage(pm.grade)} content={'7. bekkur'} />
      </InfoLineStack>
    </IntroWrapper>
  )
}

export default Overview
