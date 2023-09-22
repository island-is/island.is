import {
  DynamicColorIOS,
  Image,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {createNavigationOptionHooks} from '../../hooks/create-navigation-option-hooks';
import {
  Button,
  FinanceStatusCard,
  Heading,
  Skeleton,
  TableViewCell,
  Typography,
  blue400,
  dynamicColor,
  font,
} from '@ui';
import {FormattedMessage, useIntl} from 'react-intl';
import styled, {useTheme} from 'styled-components/native';
import {useState} from 'react';
import externalOpen from '../../assets/icons/external-open.png';
import chevronDown from '../../assets/icons/chevron-down.png';
import {navigateTo} from '../../lib/deep-linking';
import {openBrowser} from '../../lib/rn-island';
import {getConfig} from '../../config';
import {useLazyQuery, useQuery} from '@apollo/client';
import {
  GET_FINANCE_STATUS,
  GetDebtStatus,
  GetFinanceStatus,
} from '../../graphql/queries/get-finance-status.query';
import {
  GET_FINANCE_STATUS_DETAILS,
  GetFinanceStatusDetails,
} from '../../graphql/queries/get-finance-detail-status.query';
import {client} from '../../graphql/client';
import {showPicker} from '../../lib/show-picker';

const Row = styled.View<{border?: boolean}>`
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: -8px;
  margin-right: -8px;

  border-bottom-color: ${dynamicColor(({theme}) => ({
    light: theme.color.blue100,
    dark: theme.shades.dark.shade300,
  }))};
  border-bottom-width: ${({border}) => (border ? 1 : 0)}px;
`;

const Cell = styled.View`
  margin-right: 8px;
  margin-left: 8px;
  margin-top: 4px;
  margin-bottom: 4px;
`;

const TouchableRow = styled.TouchableHighlight`
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: -8px;
  margin-right: -8px;
  padding-top: 8px;
  padding-bottom: 8px;
  border-bottom-color: ${dynamicColor(({theme}) => ({
    light: theme.color.blue100,
    dark: theme.shades.dark.shade300,
  }))};
  border-bottom-width: 1px;
`;

const AboutBox = styled.View`
  padding: 16px;
  border-top-color: ${dynamicColor(({theme}) => ({
    light: theme.color.blueberry200,
    dark: theme.shades.dark.shade300,
  }))};
  border-top-width: 1px;
  margin-top: 0px;
`;

const LightButton = (props: any) => {
  const theme = useTheme();
  return (
    <Button
      {...props}
      isOutlined
      iconStyle={{
        tintColor: props.disabled ? '#999' : blue400,
      }}
      style={{
        borderColor: props.disabled
          ? 'rgba(128,128,128,0.25)'
          : Platform.OS === 'ios'
          ? DynamicColorIOS({
              dark: theme.shades.dark.shade300,
              light: theme.color.blue200,
            })
          : theme.colorScheme === 'dark'
          ? theme.shades.dark.shade300
          : theme.color.blue200,
        paddingTop: 8,
        paddingBottom: 8,
        minWidth: 0,
        minHeight: 40,
      }}
      textProps={{
        lineBreakMode: 'tail',
        numberOfLines: 1,
      }}
      textStyle={{
        textAlign: 'left',
        fontSize: 12,
        fontWeight: '500',
        color: props.disabled
          ? '#999'
          : Platform.OS === 'ios'
          ? DynamicColorIOS({
              dark: theme.shades.dark.foreground,
              light: theme.shades.light.foreground,
            })
          : theme.colorScheme === 'dark'
          ? theme.shades.dark.foreground
          : theme.shades.light.foreground,
        ...props.textStyle,
      }}
    />
  );
};

const Text = styled.Text<{size?: number; weight?: string; color?: string}>`
  ${props => {
    const result = font({
      fontSize: props.size ?? 13,
      fontWeight: props.weight as any,
    });
    return result;
  }}
`;

function FinanceStatusCardContainer(props: any) {
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const {chargeType, org} = props;

  const input = {
    orgID: org.id,
    chargeTypeID: chargeType.id,
  };
  const {loading, error, ...detailsQuery} = useQuery<{
    getFinanceStatusDetails: GetFinanceStatusDetails;
  }>(GET_FINANCE_STATUS_DETAILS, {
    variables: {
      input,
    },
    client,
    skip: !open,
  });
  const financeStatusDetails: GetFinanceStatusDetails = detailsQuery.data
    ?.getFinanceStatusDetails || {
    chargeItemSubjects: [],
    timestamp: '',
  };

  const chargeItemSubjects = [
    ...new Set(
      financeStatusDetails.chargeItemSubjects.map(i => i.chargeItemSubject),
    ),
  ];
  const [selectedChargeItemSubject, setSelectedChargeItemSubject] = useState(0);

  return (
    <FinanceStatusCard
      title={chargeType.name}
      message={
        <FormattedMessage
          id="finance.statusCard.status"
          defaultMessage="Staða"
        />
      }
      value={`${intl.formatNumber(chargeType.totals)} kr.`}
      onPress={() => {
        setOpen(p => !p);
      }}
      open={open}>
      <View style={{width: '100%', padding: 16}}>
        <Text weight="500" style={{color: blue400, marginBottom: 8}}>
          <FormattedMessage
            id="finance.statusCard.paymentBase"
            defaultMessage="Gjaldgrunnur"
          />
        </Text>
        <LightButton
          title={
            loading
              ? intl.formatMessage({
                  id: 'settings.about.codePushLoading',
                  defaultMessage: 'Hleð...',
                })
              : chargeItemSubjects[selectedChargeItemSubject]
          }
          icon={chevronDown}
          textStyle={{flex: 1}}
          onPress={() => {
            showPicker({
              title: intl.formatMessage({
                id: 'finance.statusCard.paymentBase',
                defaultMessage: 'Gjaldgrunnur',
              }),
              items: chargeItemSubjects.map((label, value) => ({
                label,
                value,
                id: String(value),
              })),
              selectedId: String(selectedChargeItemSubject),
              cancel: true,
            }).then(value => {
              if (value.selectedItem) {
                setSelectedChargeItemSubject(Number(value.selectedItem.id));
              }
            });
            // void
          }}
        />
        <Row style={{marginTop: 12}}>
          <Cell style={{flex: 1}}>
            <Text weight="600">
              <FormattedMessage
                id="finance.statusCard.deadline"
                defaultMessage="Eindagi"
              />
            </Text>
          </Cell>
          <Cell style={{flex: 1}}>
            <Text style={{fontWeight: '600', textAlign: 'right'}}>
              <FormattedMessage
                id="finance.statusCard.amount"
                defaultMessage="Upphæð"
              />
            </Text>
          </Cell>
        </Row>
        {loading
          ? Array.from({length: 3}).map((_, index) => (
              <Row key={index}>
                <Cell style={{flex: 1}}>
                  <Skeleton height={18} />
                </Cell>
              </Row>
            ))
          : financeStatusDetails?.chargeItemSubjects?.map((charge, index) => {
              if (
                charge.chargeItemSubject !==
                chargeItemSubjects[selectedChargeItemSubject]
              ) {
                return null;
              }
              return (
                <TouchableRow
                  key={index}
                  underlayColor="rgba(128,128,128,0.1)"
                  onPress={() => {
                    navigateTo(
                      `/finance/status/${org.id}/${chargeType.id}/${index}`,
                    );
                  }}>
                  <>
                    <Cell style={{flex: 1}}>
                      <Text>{charge.finalDueDate}</Text>
                    </Cell>
                    <Cell style={{flex: 1}}>
                      <Text style={{textAlign: 'right'}}>
                        {intl.formatNumber(charge.totals)} kr.
                      </Text>
                    </Cell>
                    <Image
                      source={chevronDown}
                      style={{
                        tintColor: 'rgba(128,128,128,0.6)',
                        transform: [
                          {rotate: '-90deg'},
                          {
                            translateY: -1,
                          },
                          {
                            translateX: -6,
                          },
                        ],
                      }}
                    />
                  </>
                </TouchableRow>
              );
            })}
        <Row>
          <Cell style={{flex: 1, alignItems: 'flex-end'}}>
            <Text weight="600" style={{marginBottom: 4}}>
              <FormattedMessage
                id="finance.statusCard.total"
                defaultMessage="Samtals"
              />
            </Text>
            {loading ? (
              <Skeleton height={18} />
            ) : (
              <Text>{intl.formatNumber(chargeType.totals)} kr.</Text>
            )}
          </Cell>
        </Row>
      </View>
      <AboutBox>
        <Text weight="600">
          <FormattedMessage
            id="finance.statusCard.organization"
            defaultMessage="Þjónustuaðili"
          />
        </Text>
        {loading ? (
          <>
            <Skeleton height={18} style={{marginTop: 8}} />
            <Skeleton height={18} style={{marginTop: 8}} />
          </>
        ) : (
          <Text style={{paddingTop: 4}}>{org.name}</Text>
        )}
        <Row>
          {org.homepage ? (
            <Cell>
              <Text weight="600">
                <FormattedMessage
                  id="finance.statusCard.organizationWebsite"
                  defaultMessage="Vefur"
                />
                :
              </Text>
              <Pressable
                onPress={() =>
                  Linking.openURL(
                    `https://${org.email.replace(/https?:\/\//, '')}`,
                  )
                }>
                <Text style={{paddingTop: 4, color: blue400}}>
                  {org.homepage}
                </Text>
              </Pressable>
            </Cell>
          ) : null}
          {org.email ? (
            <Cell>
              <Text weight="600">
                <FormattedMessage
                  id="finance.statusCard.organizationEmail"
                  defaultMessage="Netfang"
                />
                :
              </Text>
              <Pressable onPress={() => Linking.openURL(`mailto:${org.email}`)}>
                <Text style={{paddingTop: 4, color: blue400}}>{org.email}</Text>
              </Pressable>
            </Cell>
          ) : null}
          {org.phone ? (
            <Cell>
              <Text weight="600">
                <FormattedMessage
                  id="finance.statusCard.organizationPhone"
                  defaultMessage="Sími"
                />
                :
              </Text>
              <Pressable onPress={() => Linking.openURL(`tel:${org.phone}`)}>
                <Text style={{paddingTop: 4, color: blue400}}>{org.phone}</Text>
              </Pressable>
            </Cell>
          ) : null}
        </Row>
      </AboutBox>
    </FinanceStatusCard>
  );
}

const {useNavigationOptions, getNavigationOptions} =
  createNavigationOptionHooks(
    (theme, intl, initialized) => ({
      topBar: {
        title: {
          text: intl.formatMessage({id: 'finance.screenTitle'}),
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
  );

export const FinanceScreen: NavigationFunctionComponent = ({componentId}) => {
  useNavigationOptions(componentId);
  const theme = useTheme();
  const intl = useIntl();
  const {loading, error, data} = useQuery<{
    getFinanceStatus: GetFinanceStatus;
    getDebtStatus: GetDebtStatus;
  }>(GET_FINANCE_STATUS, {client, errorPolicy: 'ignore'});

  const debtStatus = data?.getDebtStatus?.myDebtStatus;
  let scheduleButtonVisible = false;
  if (debtStatus && debtStatus.length > 0 && !loading) {
    scheduleButtonVisible =
      debtStatus[0]?.approvedSchedule > 0 ||
      debtStatus[0]?.possibleToSchedule > 0;
  }

  const financeStatusData = data?.getFinanceStatus ?? {
    organizations: [],
    statusTotals: 0,
  };

  // Can we not use this instead financeStatusData.statusTotals ?
  function getChargeTypeTotal() {
    const organizationChargeTypes = financeStatusData?.organizations?.map(
      org => org.chargeTypes,
    );
    const allChargeTypes = organizationChargeTypes?.flat() ?? [];

    const chargeTypeTotal =
      allChargeTypes.length > 0
        ? allChargeTypes.reduce((a, b) => a + b.totals, 0)
        : 0;

    return chargeTypeTotal; // @todo amountFormat
  }

  // const endOfYearMessage = defineMessage({
  //   id: 'sp.finance-status:end-of-year',
  //   defaultMessage: 'Staða í lok árs {year}',
  //   description: 'A welcome message',
  // })

  // const previousYear = subYears(new Date(), 1).getFullYear().toString();
  // const twoYearsAgo = subYears(new Date(), 2).getFullYear().toString();
  const financeStatusZero = financeStatusData?.statusTotals === 0;

  const skeletonItems = Array.from({length: 5}).map((_, id) => (
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
  ));

  return (
    <ScrollView style={{flex: 1}}>
      <SafeAreaView style={{marginHorizontal: 16}}>
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
          <Text size={13} style={{marginBottom: 4}}>
            <FormattedMessage
              id="finance.statusCard.total"
              defaultMessage="Samtals"
            />
            :
          </Text>
        }
        subtitle={
          loading ? (
            <Skeleton
              active
              style={{borderRadius: 4, width: 150}}
              height={26}
            />
          ) : (
            <Text size={20} weight="600">{`${intl.formatNumber(
              getChargeTypeTotal(),
            )} kr.`}</Text>
          )
        }
      />
      <SafeAreaView
        style={{
          marginHorizontal: 16,
          marginBottom: 24,
          alignItems: 'flex-start',
        }}>
        <LightButton
          title={
            <FormattedMessage
              id="finance.statusCard.schedulePaymentPlan"
              defaultMessage="Gera greiðsluáætlun"
            />
          }
          disabled={!scheduleButtonVisible}
          icon={externalOpen}
          onPress={() => {
            openBrowser(
              `${getConfig().apiUrl.replace(
                /\/api/,
                '',
              )}/umsoknir/greidsluaaetlun`,
              componentId,
            );
          }}
        />
      </SafeAreaView>
      <SafeAreaView style={{marginHorizontal: 16}}>
        {loading
          ? skeletonItems
          : financeStatusData?.organizations?.length > 0 || financeStatusZero
          ? financeStatusData?.organizations?.map((org: any, i) =>
              org.chargeTypes.map((chargeType: any, ii: number) => (
                <FinanceStatusCardContainer
                  key={`${org.id}-${chargeType.id}-${i}-${ii}`}
                  chargeType={chargeType}
                  org={org}
                />
              )),
            )
          : null}
      </SafeAreaView>
    </ScrollView>
  );
};

FinanceScreen.options = getNavigationOptions;
