import { Box, ActionCard } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  CardLoader,
  HUGVERKASTOFAN_SLUG,
  IntroWrapper,
  m,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { isDefined } from '@island.is/shared/utils'
import { ipMessages } from '../../lib/messages'
import { AssetsPaths } from '../../lib/paths'
import { useGetIntellectualPropertiesQuery } from './IntellectualPropertiesOverview.generated'
import { useNavigate } from 'react-router-dom'

const IntellectualPropertiesOverview = () => {
  useNamespaces('sp.intellectual-property')
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const { loading, data, error } = useGetIntellectualPropertiesQuery()

  const generateActionCard = (
    index: number,
    heading?: string | null,
    ipId?: string | null,
    description?: string | null,
    url?: string | null,
    tag?: string | null,
  ) => (
    <Box marginBottom={3} key={index}>
      <ActionCard
        text={`${ipId}${description ? ' - ' + description : ''}`}
        heading={heading ?? ''}
        cta={{
          label: formatMessage(m.view),
          variant: 'text',
          onClick: () => navigate(url ?? ''),
        }}
        tag={{
          variant: 'blue',
          outlined: false,
          label: tag ?? '',
        }}
      />
    </Box>
  )

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroWrapper
        title={ipMessages.title}
        intro={ipMessages.description}
        serviceProviderSlug={HUGVERKASTOFAN_SLUG}
        serviceProviderTooltip={formatMessage(m.intellectualPropertiesTooltip)}
      >
        {loading && (
          <Box marginBottom={2}>
            <CardLoader />
          </Box>
        )}
        {error && !loading && <Problem error={error} noBorder={false} />}
        {!loading &&
          !error &&
          (data?.intellectualProperties?.totalCount ?? 0) < 1 && (
            <Problem
              type="no_data"
              noBorder={false}
              title={formatMessage(m.noDataFoundVariable, {
                arg: formatMessage(m.intellectualProperties).toLowerCase(),
              })}
              message={formatMessage(m.noDataFoundVariableDetailVariation, {
                arg: formatMessage(m.intellectualProperties).toLowerCase(),
              })}
              imgSrc="./assets/images/sofa.svg"
            />
          )}
        {!loading &&
          !error &&
          data?.intellectualProperties?.items
            ?.map((ip, index) => {
              switch (ip.__typename) {
                case 'IntellectualPropertiesDesign':
                  if (!ip.id) {
                    return null
                  }
                  return generateActionCard(
                    index,
                    ip.specification?.description,
                    ip.id,
                    undefined,
                    AssetsPaths.AssetsIntellectualPropertiesDesign.replace(
                      ':id',
                      ip.id,
                    ),
                    ip.status,
                  )
                case 'IntellectualPropertiesPatentEP':
                case 'IntellectualPropertiesPatentIS':
                case 'IntellectualPropertiesSPC':
                  return generateActionCard(
                    index,
                    ip.name,
                    ip.applicationNumber,
                    undefined,
                    AssetsPaths.AssetsIntellectualPropertiesPatent.replace(
                      ':id',
                      ip.applicationNumber ?? '',
                    ),
                    ip.statusText,
                  )
                case 'IntellectualPropertiesTrademark':
                  return generateActionCard(
                    index,
                    ip.text,
                    ip.id,
                    ip.typeReadable,
                    AssetsPaths.AssetsIntellectualPropertiesTrademark.replace(
                      ':id',
                      ip.id ?? '',
                    ),
                    ip.status,
                  )
                default:
                  return null
              }
            })
            .filter(isDefined)}
      </IntroWrapper>
    </Box>
  )
}

export default IntellectualPropertiesOverview
