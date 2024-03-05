import { Box, SkeletonLoader, Tabs, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  IntroHeader,
  SJUKRATRYGGINGAR_SLUG,
} from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'
import { useGetAidsAndNutritionQuery } from './AidsAndNutrition.generated'
import { RightsPortalAidOrNutritionType } from '@island.is/api/schema'
import { Problem } from '@island.is/react-spa/shared'
import Aids from './Aids'
import Nutrition from './Nutrition'
import { isDefined } from '@island.is/shared/utils'

const AidsAndNutrition = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  const { loading, error, data } = useGetAidsAndNutritionQuery()

  const aidsAndNutrition = data?.rightsPortalPaginatedAidOrNutrition?.data

  const aids =
    aidsAndNutrition?.filter(
      (ann) => ann.type === RightsPortalAidOrNutritionType.AID,
    ) ?? []

  const nutrition =
    aidsAndNutrition?.filter(
      (ann) => ann.type === RightsPortalAidOrNutritionType.NUTRITION,
    ) ?? []

  const tabs = [
    aids.length > 0
      ? {
          label: formatMessage(messages.aids),
          content: <Aids data={aids} />,
        }
      : null,
    nutrition.length > 0
      ? {
          label: formatMessage(messages.nutrition),
          content: <Nutrition data={nutrition} />,
        }
      : null,
  ].filter(isDefined)

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={formatMessage(messages.aidsAndNutritionTitle)}
        intro={formatMessage(messages.aidsAndNutritionDescription)}
        serviceProviderSlug={SJUKRATRYGGINGAR_SLUG}
        serviceProviderTooltip={formatMessage(messages.healthTooltip)}
      />

      {error && (
        <Problem
          size="small"
          noBorder={false}
          type="internal_service_error"
          error={error}
        />
      )}

      {loading && !error && <SkeletonLoader space={1} height={30} repeat={4} />}

      {!loading && !error && !aids?.length && !nutrition?.length && (
        <Problem
          type="no_data"
          title={formatMessage(messages.noDataFound, {
            arg: formatMessage(messages.aidsOrNutrition).toLowerCase(),
          })}
          message={formatMessage(messages.noDataFoundDetailVariation, {
            arg: formatMessage(messages.aidsOrNutritionVariation).toLowerCase(),
          })}
          imgSrc="./assets/images/coffee.svg"
          titleSize="h3"
          noBorder={false}
        />
      )}

      {!loading && !error && tabs?.length > 0 && (
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
