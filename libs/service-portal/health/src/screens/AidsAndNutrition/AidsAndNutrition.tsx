import { Box, SkeletonLoader, Tabs, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  IntroHeader,
  SJUKRATRYGGINGAR_SLUG,
  m,
} from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'
import { useGetAidsAndNutritionQuery } from './AidsAndNutrition.generated'
import AidsTable from './AidsTable'
import NutritionTable from './NutritionTable'
import { RightsPortalAidOrNutritionType } from '@island.is/api/schema'
import { Problem } from '@island.is/react-spa/shared'

const AidsAndNutrition = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  const { loading, error, data } = useGetAidsAndNutritionQuery()

  const aidsAndNutrition = data?.rightsPortalPaginatedAidOrNutrition?.data

  const aids = aidsAndNutrition?.filter(
    (ann) => ann.type === RightsPortalAidOrNutritionType.AID,
  )

  const nutrition = aidsAndNutrition?.filter(
    (ann) => ann.type === RightsPortalAidOrNutritionType.NUTRITION,
  )

  const tabs = [
    aids &&
      aids.length > 0 && {
        label: formatMessage(messages.aids),
        content: (
          <AidsTable
            data={aids}
            footnote={formatMessage(messages['aidsDisclaimer'])}
            link={formatMessage(messages['aidsDescriptionLink'])}
            linkText={formatMessage(messages.aidsDescriptionInfo)}
          />
        ),
      },
    nutrition &&
      nutrition.length > 0 && {
        label: formatMessage(messages.nutrition),
        content: (
          <NutritionTable
            data={nutrition}
            footnote={formatMessage(messages['nutritionDisclaimer'])}
            link={formatMessage(messages['nutritionDescriptionLink'])}
            linkText={formatMessage(messages.nutritionDescriptionInfo)}
          />
        ),
      },
  ].filter((x) => x !== false) as Array<{ label: string; content: JSX.Element }>

  if (error && !loading) {
    return <Problem type="internal_service_error" error={error} />
  }
  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={formatMessage(messages.aidsAndNutritionTitle)}
        intro={formatMessage(messages.aidsAndNutritionDescription)}
        serviceProviderSlug={SJUKRATRYGGINGAR_SLUG}
        serviceProviderTooltip={formatMessage(messages.healthTooltip)}
      />
      {loading && <SkeletonLoader space={1} height={30} repeat={4} />}

      {!loading && !aids?.length && !nutrition?.length && (
        <Problem type="no_data" />
      )}

      {!loading && !error && tabs.length > 0 && (
        <Box>
          {tabs.length === 1 ? (
            <>
              <Text variant="h5">{tabs[0].label}</Text>
              {tabs[0].content}
            </>
          ) : (
            <Tabs
              label={formatMessage(messages.chooseAidsOrNutrition)}
              tabs={tabs}
              contentBackground="transparent"
              selected="0"
              size="xs"
            />
          )}
        </Box>
      )}
    </Box>
  )
}

export default AidsAndNutrition
