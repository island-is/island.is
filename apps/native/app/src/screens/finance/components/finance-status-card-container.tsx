import {
  FinanceStatusCard,
  Skeleton,
  Typography,
  blue400,
  dynamicColor,
} from '@ui';
import {useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {Image, Linking, Pressable, View} from 'react-native';
import styled from 'styled-components/native';
import {useGetFinanceStatusDetailsQuery} from '../../../graphql/types/schema';
import {navigateTo} from '../../../lib/deep-linking';
import {showPicker} from '../../../lib/show-picker';
import chevronDown from '../../../assets/icons/chevron-down.png';
import {LightButton} from './light-button';
import {
  ChargeType,
  GetFinanceStatusDetails,
  Organization,
} from '../../../graphql/types/finance.types';

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

export function FinanceStatusCardContainer({
  chargeType,
  org,
}: {
  chargeType: ChargeType;
  org: Organization;
}) {
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const res = useGetFinanceStatusDetailsQuery({
    variables: {
      input: {
        orgID: org.id,
        chargeTypeID: chargeType.id,
      },
    },
    skip: !open,
  });
  const financeStatusDetails: GetFinanceStatusDetails =
    res.data?.getFinanceStatusDetails;

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
        <Typography
          weight="500"
          size={13}
          style={{color: blue400, marginBottom: 8}}>
          <FormattedMessage
            id="finance.statusCard.paymentBase"
            defaultMessage="Gjaldgrunnur"
          />
        </Typography>
        <LightButton
          title={
            res.loading
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
            <Typography size={13} weight="600">
              <FormattedMessage
                id="finance.statusCard.deadline"
                defaultMessage="Eindagi"
              />
            </Typography>
          </Cell>
          <Cell style={{flex: 1}}>
            <Typography style={{fontWeight: '600', textAlign: 'right'}}>
              <FormattedMessage
                id="finance.statusCard.amount"
                defaultMessage="Upphæð"
              />
            </Typography>
          </Cell>
        </Row>
        {res.loading
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
                      <Typography>{charge.finalDueDate}</Typography>
                    </Cell>
                    <Cell style={{flex: 1}}>
                      <Typography style={{textAlign: 'right'}}>
                        {intl.formatNumber(charge.totals)} kr.
                      </Typography>
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
            <Typography size={13} weight="600" style={{marginBottom: 4}}>
              <FormattedMessage
                id="finance.statusCard.total"
                defaultMessage="Samtals"
              />
            </Typography>
            {res.loading ? (
              <Skeleton height={18} />
            ) : (
              <Typography>
                {intl.formatNumber(chargeType.totals)} kr.
              </Typography>
            )}
          </Cell>
        </Row>
      </View>
      <AboutBox>
        <Typography size={13} weight="600">
          <FormattedMessage
            id="finance.statusCard.organization"
            defaultMessage="Þjónustuaðili"
          />
        </Typography>
        {res.loading ? (
          <>
            <Skeleton height={18} style={{marginTop: 8}} />
            <Skeleton height={18} style={{marginTop: 8}} />
          </>
        ) : (
          <Typography style={{paddingTop: 4}}>{org.name}</Typography>
        )}
        <Row>
          {org.homepage ? (
            <Cell>
              <Typography size={13} weight="600">
                <FormattedMessage
                  id="finance.statusCard.organizationWebsite"
                  defaultMessage="Vefur"
                />
                :
              </Typography>
              <Pressable
                onPress={() =>
                  Linking.openURL(
                    `https://${org.email.replace(/https?:\/\//, '')}`,
                  )
                }>
                <Typography style={{paddingTop: 4, color: blue400}}>
                  {org.homepage}
                </Typography>
              </Pressable>
            </Cell>
          ) : null}
          {org.email ? (
            <Cell>
              <Typography size={13} weight="600">
                <FormattedMessage
                  id="finance.statusCard.organizationEmail"
                  defaultMessage="Netfang"
                />
                :
              </Typography>
              <Pressable onPress={() => Linking.openURL(`mailto:${org.email}`)}>
                <Typography style={{paddingTop: 4, color: blue400}}>
                  {org.email}
                </Typography>
              </Pressable>
            </Cell>
          ) : null}
          {org.phone ? (
            <Cell>
              <Typography weight="600">
                <FormattedMessage
                  id="finance.statusCard.organizationPhone"
                  defaultMessage="Sími"
                />
                :
              </Typography>
              <Pressable onPress={() => Linking.openURL(`tel:${org.phone}`)}>
                <Typography style={{paddingTop: 4, color: blue400}}>
                  {org.phone}
                </Typography>
              </Pressable>
            </Cell>
          ) : null}
        </Row>
      </AboutBox>
    </FinanceStatusCard>
  );
}
