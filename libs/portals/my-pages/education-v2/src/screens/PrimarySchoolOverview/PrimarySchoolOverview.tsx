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

export const Overview = () => {
  const { formatMessage } = useLocale()

  return (
    <IntroWrapper
      title={formatMessage(pm.title)}
      intro={formatMessage(pm.intro)}
      serviceProviderSlug={'midstod-menntunar-og-skolathjonustu'}
      serviceProviderTooltip={formatMessage(cm.mmsTooltipSecondary)}
    >
      <InfoLineStack label={formatMessage(cm.baseInfo)}>
        <InfoLine label={formatMessage(gm.student)} content={'Stubba Maack'} />
        <InfoLine
          label={formatMessage(pm.email)}
          content={'stubbamaacks@skoli.is'}
        />
        <InfoLine
          label={formatMessage(pm.primarySchool)}
          content={'Háteigsskóli'}
        />
        <InfoLine
          label={formatMessage(pm.teacher)}
          content={'Stuttli Maacker'}
        />
        <InfoLine label={formatMessage(pm.grade)} content={'7. bekkur'} />
        <InfoLine
          label={formatMessage(pm.meal)}
          content={'Ekki í mataráskrift'}
        />
      </InfoLineStack>
    </IntroWrapper>
  )
}

export default Overview
