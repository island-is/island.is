import { RightsPortalAidOrNutritionType } from '@island.is/api/schema'
import { Box, SkeletonLoader, Tabs, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  IntroWrapper,
  SJUKRATRYGGINGAR_SLUG,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { isDefined } from '@island.is/shared/utils'
import { messages } from '../../lib/messages'
import { CONTENT_GAP_SM } from '../../utils/constants'
import { useGetAidsAndNutritionQuery } from './AidsAndNutrition.generated'
import AidsAndNutritionWrapper from './AidsAndNutritionWrapper'

const AidsAndNutrition = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  const { loading, error, data, refetch } = useGetAidsAndNutritionQuery()

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
          content: (
            <AidsAndNutritionWrapper type="AID" data={aids} refetch={refetch} />
          ),
        }
      : null,
    nutrition.length > 0
      ? {
          label: formatMessage(messages.nutrition),
          content: (
            <AidsAndNutritionWrapper
              type="NUTRITION"
              data={nutrition}
              refetch={refetch}
            />
          ),
        }
      : null,
  ].filter(isDefined)

  return (
    <IntroWrapper
      marginBottom={[6, 6, 10]}
      title={formatMessage(messages.aidsAndNutritionTitle)}
      intro={formatMessage(messages.aidsAndNutritionDescription)}
      serviceProviderSlug={SJUKRATRYGGINGAR_SLUG}
      serviceProviderTooltip={formatMessage(messages.healthTooltip)}
    >
      {error && <Problem error={error} noBorder={false} />}

      {loading && !error && (
        <SkeletonLoader space={CONTENT_GAP_SM} height={30} repeat={4} />
      )}

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
    </IntroWrapper>
  )
}

export default AidsAndNutrition
