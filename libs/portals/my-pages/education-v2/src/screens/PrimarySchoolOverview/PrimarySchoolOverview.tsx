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
import { usePrimarySchoolCareerLazyQuery } from './PrimarySchoolOverview.generated'
import { Problem } from '@island.is/react-spa/shared'
import { useUserInfo } from '@island.is/react-spa/bff'
import { maskString } from '@island.is/shared/utils'
import { useEffect, useState } from 'react'

export const PrimarySchoolOverview = () => {
  const { formatMessage } = useLocale()
  const user = useUserInfo()

  const [maskedUserId, setMaskedUserId] = useState<{
    status: 'initial' | 'noId' | 'masked'
    value?: string
  }>({
    status: 'initial',
  })

  const [primarySchoolCareerQuery, { data, loading, error }] =
    usePrimarySchoolCareerLazyQuery()

  useEffect(() => {
    if (maskedUserId?.status === 'masked' && maskedUserId.value) {
      primarySchoolCareerQuery({
        variables: {
          input: {
            studentId: maskedUserId.value,
          },
        },
      })
    } else if (maskedUserId?.status === 'noId') {
      primarySchoolCareerQuery()
    }
  }, [maskedUserId, primarySchoolCareerQuery])

  useEffect(() => {
    const parseUserId = async () => {
      const maskedString = user.profile.actor
        ? await maskString(
            user.profile.nationalId,
            user.profile.actor.nationalId,
          )
        : undefined

      if (!maskedString) {
        setMaskedUserId({
          status: 'noId',
        })
      } else {
        setMaskedUserId({
          status: 'masked',
          value: maskedString,
        })
      }
    }

    parseUserId()
  }, [primarySchoolCareerQuery, user.profile])

  const studentCareer = data?.educationV3StudentCareer ?? null

  return (
    <IntroWrapper
      title={formatMessage(pm.title)}
      intro={formatMessage(pm.intro)}
      serviceProviderSlug={MMS_SLUG}
      serviceProviderTooltip={formatMessage(cm.mmsTooltipSecondary)}
    >
      {error && <Problem error={error} noBorder={false} />}
      {!studentCareer && !loading && !error && (
        <Problem type="no_data" noBorder={false} />
      )}
      {!error && (loading || studentCareer) && (
        <InfoLineStack
          dividerOnBottom={false}
          label={formatMessage(cm.baseInfo)}
        >
          <InfoLine
            loading={loading}
            label={formatMessage(gm.student)}
            content="bing"
          />
          <InfoLine
            loading={loading}
            label={formatMessage(pm.primarySchool)}
            content={'Háteigsskóli'}
            button={
              !loading
                ? {
                    type: 'link',
                    to: '/education/primary-school',
                    label: formatMessage(gm.changeSchools),
                    icon: 'arrowForward',
                  }
                : undefined
            }
          />
          <InfoLine
            loading={loading}
            label={formatMessage(pm.teacher)}
            content={'Stuttli Maacker'}
          />
          <InfoLine
            loading={loading}
            label={formatMessage(pm.grade)}
            content={'7. bekkur'}
          />
        </InfoLineStack>
      )}
    </IntroWrapper>
  )
}

export default PrimarySchoolOverview
