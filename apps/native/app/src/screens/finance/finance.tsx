import { FormattedMessage, useIntl } from 'react-intl'
import { SafeAreaView, ScrollView } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { useTheme } from 'styled-components/native'

import { Button, Heading, Skeleton, TableViewCell, Typography } from '../../ui'
import externalLink from '../../assets/icons/external-link.png'
import { getConfig } from '../../config'
import { GetFinanceStatus } from '../../graphql/types/finance.types'
import { useGetFinanceStatusQuery } from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { useBrowser } from '../../lib/use-browser'
import { FinanceStatusCard } from './components/finance-status-card'
import { testIDs } from '../../utils/test-ids'

const { useNavigationOptions, getNavigationOptions } =
  createNavigationOptionHooks(
    (theme, intl) => ({
      topBar: {
        title: {
          text: intl.formatMessage({ id: 'finance.screenTitle' }),
        },
      },
    }),
    {
      topBar: {
        largeTitle: {
          visible: true,
        },
        scrollEdgeAppearance: {
          active: true,
          noBorder: true,
        },
      },
    },
  )

export const FinanceScreen: NavigationFunctionComponent = ({ componentId }) => {
  useNavigationOptions(componentId)

  const { openBrowser } = useBrowser()
  const theme = useTheme()
  const intl = useIntl()
  const res = useGetFinanceStatusQuery({
    errorPolicy: 'ignore',
  })

  useConnectivityIndicator({ componentId, queryResult: res })

  // Convert JSON scalars to types
  const financeStatusData: GetFinanceStatus = res.data?.getFinanceStatus ?? {
    organizations: [],
    statusTotals: 0,
  }

  const debtStatus = res.data?.getDebtStatus?.myDebtStatus
  let scheduleButtonVisible = false
  if (debtStatus && debtStatus.length > 0 && !res.loading) {
    scheduleButtonVisible =
      debtStatus[0]?.approvedSchedule > 0 ||
      debtStatus[0]?.possibleToSchedule > 0
  }

  const organizations = financeStatusData?.organizations ?? []

  // Can we not use this instead financeStatusData.statusTotals ?
  function getChargeTypeTotal() {
    const organizationChargeTypes = organizations.map((org) => org.chargeTypes)
    const allChargeTypes = (organizationChargeTypes?.flat() ?? []) as Array<{
      totals: number
    }>

    const chargeTypeTotal =
      allChargeTypes.length > 0
        ? allChargeTypes.reduce((a, b) => a + b.totals, 0)
        : 0

    return chargeTypeTotal
  }

  const financeStatusZero = financeStatusData?.statusTotals === 0

  const skeletonItems = Array.from({ length: 5 }).map((_, id) => (
    <Skeleton
      key={id}
      active
      backgroundColor={{
        dark: theme.shades.dark.shade300,
        light: theme.color.blue100,
      }}
      overlayColor={{
        dark: theme.shades.dark.shade200,
        light: theme.color.blue200,
      }}
      overlayOpacity={1}
      height={80}
      style={{
        borderRadius: 8,
        marginBottom: 16,
      }}
    />
  ))

  const showLoading = res.loading && !res.data

  return (
    <ScrollView style={{ flex: 1 }} testID={testIDs.SCREEN_FINANCE}>
      <SafeAreaView style={{ marginHorizontal: 16 }}>
        <Heading>
          <FormattedMessage
            id="finance.heading.title"
            defaultMessage="Staða við ríkissjóð og stofnanir"
          />
        </Heading>
        <Typography>
          <FormattedMessage
            id="finance.heading.subtitle"
            defaultMessage="Hér sérð þú sundurliðun skulda og/eða inneigna hjá ríkissjóði og stofnunum."
          />
        </Typography>
      </SafeAreaView>
      <TableViewCell
        style={{
          marginTop: 16,
          marginBottom: 24,
        }}
        title={
          <Typography size={13} style={{ marginBottom: 4 }}>
            <FormattedMessage
              id="finance.statusCard.total"
              defaultMessage="Samtals"
            />
            :
          </Typography>
        }
        subtitle={
          showLoading ? (
            <Skeleton
              active
              style={{ borderRadius: 4, width: 150 }}
              height={26}
            />
          ) : (
            <Typography size={20} weight="600">{`${intl.formatNumber(
              getChargeTypeTotal(),
            )} kr.`}</Typography>
          )
        }
      />
      <SafeAreaView
        style={{
          marginHorizontal: 16,
          marginBottom: 24,
          alignItems: 'flex-start',
        }}
      >
        <Button
          title={intl.formatMessage({
            id: 'finance.statusCard.schedulePaymentPlan',
          })}
          isOutlined
          isUtilityButton
          icon={externalLink}
          disabled={!scheduleButtonVisible}
          iconStyle={{ tintColor: theme.color.dark300 }}
          style={{ flex: 1 }}
          onPress={() =>
            openBrowser(
              `${getConfig().apiUrl.replace(
                /\/api/,
                '',
              )}/umsoknir/greidsluaaetlun`,
              componentId,
            )
          }
        />
      </SafeAreaView>
      <SafeAreaView style={{ marginHorizontal: 16 }}>
        {showLoading
          ? skeletonItems
          : organizations.length > 0 || financeStatusZero
          ? organizations.map((org, i) =>
              (org.chargeTypes ?? []).map((chargeType, ii: number) => (
                <FinanceStatusCard
                  key={`${org.id}-${chargeType.id}-${i}-${ii}`}
                  chargeType={chargeType}
                  org={org}
                  componentId={componentId}
                />
              )),
            )
          : null}
      </SafeAreaView>
    </ScrollView>
  )
}

FinanceScreen.options = getNavigationOptions
