import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ActionCard,
  CardLoader,
  HUGVERKASTOFAN_SLUG,
  IntroHeader,
  m,
} from '@island.is/portals/my-pages/core'
import { Box } from '@island.is/island-ui/core'
import { ipMessages } from '../../lib/messages'
import { useGetIntellectualPropertiesQuery } from './IntellectualPropertiesOverview.generated'
import { isDefined } from '@island.is/shared/utils'
import { AssetsPaths } from '../../lib/paths'
import { Problem } from '@island.is/react-spa/shared'

const IntellectualPropertiesOverview = () => {
  useNamespaces('sp.intellectual-property')
  const { formatMessage } = useLocale()

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
          url: url ?? '',
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
      <IntroHeader
        title={ipMessages.title}
        intro={ipMessages.description}
        serviceProviderSlug={HUGVERKASTOFAN_SLUG}
        serviceProviderTooltip={formatMessage(m.intellectualPropertiesTooltip)}
      />
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
    </Box>
  )
}

export default IntellectualPropertiesOverview
