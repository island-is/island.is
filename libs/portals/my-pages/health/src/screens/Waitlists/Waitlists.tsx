import { HealthDirectorateWaitlistStatusTagColorEnum } from '@island.is/api/schema'
import {
  ActionCard,
  Box,
  Button,
  Stack,
  TagVariant,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  formatDate,
  HEALTH_DIRECTORATE_SLUG,
  IntroWrapper,
  LinkButton,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { isDefined } from '@island.is/shared/utils'
import React, { useState } from 'react'
import * as styles from './Waitlists.css'
import { useNavigate } from 'react-router-dom'
import { messages } from '../../lib/messages'
import { HealthPaths } from '../../lib/paths'
import { useGetWaitlistsQuery } from './Waitlists.generated'
import { WaitlistsInfoModal } from './WaitlistsInfoModal'

const Waitlists: React.FC = () => {
  useNamespaces('sp.health')
  const { formatMessage, lang } = useLocale()
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, loading, error } = useGetWaitlistsQuery({
    variables: { locale: lang },
  })

  const waitlists = data?.healthDirectorateWaitlists.waitlists

  const mapStatusToColor = (
    statusId?: HealthDirectorateWaitlistStatusTagColorEnum | null,
  ): TagVariant => {
    switch (statusId) {
      case HealthDirectorateWaitlistStatusTagColorEnum.blue:
        return 'blue'
      case HealthDirectorateWaitlistStatusTagColorEnum.red:
        return 'red'
      case HealthDirectorateWaitlistStatusTagColorEnum.mint:
        return 'mint'
      case HealthDirectorateWaitlistStatusTagColorEnum.purple:
        return 'purple'
      default:
        return 'blue'
    }
  }

  return (
    <IntroWrapper
      title={formatMessage(messages.waitlists)}
      introComponent={
        <Box className={styles.linkText}>
          <Text>
            {formatMessage(messages.waitlistsIntroWithLink, {
              link: (str: React.ReactNode) => (
                <Button
                  variant="text"
                  size="medium"
                  onClick={() => setIsModalOpen(true)}
                  aria-haspopup="dialog"
                >
                  {str}
                </Button>
              ),
            })}
          </Text>
        </Box>
      }
      serviceProviderSlug={HEALTH_DIRECTORATE_SLUG}
      serviceProviderTooltip={formatMessage(
        messages.landlaeknirWaitlistTooltip,
      )}
      buttonGroup={[
        <LinkButton
          key="waitlists-link"
          to={formatMessage(messages.waitlistsDescriptionLink)}
          text={formatMessage(messages.waitlistsDescriptionInfo)}
          variant="utility"
          icon="open"
        />,
      ]}
    >
      <WaitlistsInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      {!loading && !error && waitlists?.length === 0 && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(messages.noWaitListsTitle)}
          message={formatMessage(messages.noWaitlists)}
          imgSrc="./assets/images/nodata.svg"
        />
      )}
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error && loading && <CardLoader />}

      <Stack space={2}>
        {waitlists?.map((waitlist, index) => {
          return (
            <ActionCard
              key={`waitlist-${index}`}
              heading={waitlist?.name ?? ''}
              headingVariant="h4"
              text={[
                formatMessage(messages.statusLastUpdated),
                formatDate(waitlist.lastUpdated),
              ]
                .filter((item) => isDefined(item))
                .join(' ')}
              eyebrow={waitlist?.organization}
              tag={{
                label: waitlist.status,
                outlined: false,
                variant: mapStatusToColor(waitlist.statusId),
              }}
              cta={{
                onClick: () =>
                  navigate(
                    HealthPaths.HealthWaitlistsDetail.replace(
                      ':id',
                      waitlist.id,
                    ),
                  ),
                label: formatMessage(messages.seeMore),
                variant: 'text',
              }}
            />
          )
        })}
      </Stack>
    </IntroWrapper>
  )
}

export default Waitlists
