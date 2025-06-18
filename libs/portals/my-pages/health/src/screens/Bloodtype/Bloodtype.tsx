import { useLocale, useNamespaces } from '@island.is/localization'
import {
  InfoLine,
  InfoLineStack,
  IntroWrapper,
  LANDLAEKNIR_SLUG,
  LinkButton,
  formatDate,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import React from 'react'
import { messages } from '../../lib/messages'
import { useBloodTypeQuery } from './Bloodtype.generated'

const Bloodtype: React.FC = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useBloodTypeQuery()

  const bloodType = data?.rightsPortalBloodType

  return (
    <IntroWrapper
      title={formatMessage(messages.bloodtype)}
      intro={bloodType?.description ?? formatMessage(messages.bloodtypeDesc)}
      serviceProviderSlug={LANDLAEKNIR_SLUG}
      marginBottom={6}
      buttonGroup={[
        <LinkButton
          key={'bloodtype-link'}
          to={bloodType?.link ?? formatMessage(messages.bloodtypeLink)}
          text={formatMessage(messages.readAboutBloodtypes)}
          variant="utility"
          icon="open"
        />,
      ]}
    >
      {!loading && !bloodType && !error && (
        <Problem type="no_data" noBorder={false} />
      )}
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error && (
        <InfoLineStack space={1}>
          <InfoLine
            label={formatMessage(messages.bloodtype)}
            content={bloodType?.type}
            loading={loading}
          />
          <InfoLine
            label={formatMessage(messages.registered)}
            content={
              bloodType?.registered
                ? formatDate(bloodType.registered)
                : formatMessage(messages.notRegistered)
            }
            loading={loading}
          />
          <InfoLine
            label={formatMessage(messages.organization)}
            content={'Landspítalinn'}
            loading={loading}
          />
        </InfoLineStack>
      )}
    </IntroWrapper>
  )
}

export default Bloodtype
