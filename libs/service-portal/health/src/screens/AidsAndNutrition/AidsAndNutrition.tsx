import { Box, SkeletonLoader, Tabs } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  EmptyState,
  ErrorScreen,
  IntroHeader,
  SJUKRATRYGGINGAR_ID,
  m,
} from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'
import { useGetAidsAndNutritionQuery } from './AidsAndNutrition.generated'
import AidsTable from './AidsTable'
import NutritionTable from './NutritionTable'

const AidsAndNutrition = () => {
  useNamespaces('sp.health')
  const { formatMessage } = useLocale()

  const { loading, error, data } = useGetAidsAndNutritionQuery()

  const supportData = {
    aids: data?.rightsPortalAidsAndNutrition?.aids ?? [],
    nutrition: data?.rightsPortalAidsAndNutrition?.nutrition ?? [],
  }

  const tabs = [
    supportData.aids.length > 0 && {
      label: formatMessage(messages.aids),
      content: (
        <AidsTable
          data={supportData.aids}
          footnote={formatMessage(messages['aidsDisclaimer'])}
          link={formatMessage(messages['aidsDescriptionLink'])}
          linkText={formatMessage(messages.aidsDescriptionInfo)}
        />
      ),
    },
    supportData.nutrition.length > 0 && {
      label: formatMessage(messages.nutrition),
      content: (
        <NutritionTable
          data={supportData.nutrition}
          footnote={formatMessage(messages['nutritionDisclaimer'])}
          link={formatMessage(messages['nutritionDescriptionLink'])}
          linkText={formatMessage(messages.nutritionDescriptionInfo)}
        />
      ),
    },
  ].filter((x) => x !== false) as Array<{ label: string; content: JSX.Element }>

  if (error && !loading) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag={formatMessage(m.errorTitle)}
        title={formatMessage(m.somethingWrong)}
        children={formatMessage(m.errorFetchModule, {
          module: formatMessage(m.aidsAndNutrition).toLowerCase(),
        })}
      />
    )
  }
  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={formatMessage(messages.aidsAndNutritionTitle)}
        intro={formatMessage(messages.aidsAndNutritionDescription)}
        serviceProviderID={SJUKRATRYGGINGAR_ID}
        serviceProviderTooltip={formatMessage(m.healthTooltip)}
      />
      {loading && <SkeletonLoader space={1} height={30} repeat={4} />}

      {!loading && !supportData.aids.length && !supportData.nutrition.length && (
        <Box width="full" marginTop={4} display="flex" justifyContent="center">
          <Box marginTop={8}>
            <EmptyState />
          </Box>
        </Box>
      )}

      {!loading && !error && tabs.length > 0 && (
        <Box>
          <Tabs
            label={formatMessage(messages.chooseAidsOrNutrition)}
            tabs={tabs}
            contentBackground="transparent"
            selected="0"
            size="xs"
          />
        </Box>
      )}
    </Box>
  )
}

export default AidsAndNutrition
