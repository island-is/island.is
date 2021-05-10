import React from 'react'
import { LicenceCard } from '@island.is/island-ui-native'
import { SafeAreaView, Text, View } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import { gql, useQuery } from '@apollo/client'
import { client } from '../../graphql/client'
import isVerifiedLogo from '../../assets/icons/is-verified.png'
import agencyLogo from '../../assets/temp/agency-logo.png'
import { LicenseType } from '../../types/license-type'
import { ComponentRegistry } from '../../utils/navigation-registry'
import { useTranslatedTitle } from '../../utils/use-translated-title'
import styled from 'styled-components/native'
import { Skeleton } from '../../components/skeleton/skeleton'
import PassKit, { AddPassButton } from 'react-native-passkit-wallet';

function mapLicenseColor(type: LicenseType) {
  let backgroundColor = '#eeeeee'
  if (type === LicenseType.DRIVERS_LICENSE) {
    backgroundColor = '#f5e4ec'
  }
  if (type === LicenseType.IDENTIDY_CARD) {
    backgroundColor = '#fff7e7'
  }
  if (type === LicenseType.PASSPORT) {
    backgroundColor = '#ddefff'
  }
  if (type === LicenseType.WEAPON_LICENSE) {
    backgroundColor = '#fffce0'
  }
  return backgroundColor
}

const FieldHost = styled.View<{ compact?: boolean }>`
  ${props => props.compact ? '' : 'flex: 1;'}
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.color.blue100};
  /* margin-left: ${props => props.compact ? 8 : 16}px;
  margin-right: ${props => props.compact ? 8 : 16}px; */
`

const FieldContent = styled.View`
  padding-bottom: 20px;
`

const FieldLabel = styled.Text`
  font-family: 'IBMPlexSans';
  font-size: 13px;
  line-height: 17px;
  color: ${(props) => props.theme.color.dark400};
  margin-bottom: 8px;
`

const FieldValue = styled.Text<{ size?: 'large' | 'small'}>`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: ${props => props.size === 'large' ? 20 : 16}px;
  line-height: ${props => props.size === 'large' ? 26 : 20}px;
  color: ${(props) => props.theme.color.dark400};
`

const FieldRow = styled.View<{ alignLeft?: boolean }>`
  flex-direction: row;
  /* justify-content: flex-start;
  align-items: flex-start; */
`

const FieldGroup = styled.View`
  margin-top: 24px;
  padding-bottom: 4px;
  border-bottom-color: ${props => props.theme.color.blue200};
  border-bottom-width: 1px;
`;

interface FieldCardProps {
  code?: string;
  title: string;
  children: React.ReactNode;
}

const FieldCardHost = styled.View`
  border-width: 1px;
  border-color: ${props => props.theme.color.blue200};
  border-radius: 16px;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const FieldCardHeader = styled.View`
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.color.blue200};
  padding: 16px;
`;

const FieldCardHeaderText = styled.Text`
  font-family: 'IBMPlexSans';
  font-size: 16px;
  line-height: 20px;
  color: ${(props) => props.theme.color.dark400};
  padding-right: 4px;
`;

function FieldCard(props: FieldCardProps) {
  return (
    <FieldCardHost>
      <FieldCardHeader>
        <FieldCardHeaderText style={{ fontFamily: 'IBMPlexSans-Bold' }}>{props.code}</FieldCardHeaderText>
        <FieldCardHeaderText>{props.title}</FieldCardHeaderText>
      </FieldCardHeader>
      <View style={{ padding: 16, paddingBottom: 0 }}>{props.children}</View>
    </FieldCardHost>
  );
}

const Information = styled.ScrollView`
  flex: 1;
  background-color: ${props => props.theme.color.blue100};
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  margin-top: -70px;
  padding-top: 70px;
`;

function Field({
  label,
  value,
  loading,
  compact,
  size = 'small',
  style,
}: {
  label: string
  value?: string
  loading?: boolean
  compact?: boolean
  size?: 'large' | 'small';
  style?: any,
}) {
  return (
    <FieldHost compact={compact} style={style}>
      <FieldContent>
        <FieldLabel>{label}</FieldLabel>
        {loading ? (
          <Skeleton active />
        ) : (
          <FieldValue size={size}>{value ?? ''}</FieldValue>
        )}
      </FieldContent>
    </FieldHost>
  )
}

export const WalletPassScreen: NavigationFunctionComponent<{ id: string; item?: any }> = ({
  id,
  item,
}) => {
  useTranslatedTitle('WALLET_PASS_NAV_TITLE', 'wallet.screenTitle')

  const res = useQuery(
    gql`
      query getLicense($id: ID!) {
        License(id: $id) @client {
          id
          title
          serviceProvider
          type
        }
      }
    `,
    {
      client,
      variables: {
        id,
      },
    },
  );

  const data = res.data?.License ?? item;

  return (
    <>
      <SafeAreaView
        style={{
          marginTop: 16,
          marginHorizontal: 16,
          zIndex: 10,
        }}
      >
        <LicenceCard
          nativeID={`license-${id}_destination`}
          title={data?.title}
          icon={isVerifiedLogo}
          backgroundColor={mapLicenseColor(data?.type)}
          agencyLogo={agencyLogo}
        />
      </SafeAreaView>
      <Information contentInset={{ bottom: 162 }}>
        <SafeAreaView style={{ marginHorizontal: 16 }}>
          <FieldGroup>
            <FieldRow>
              <Field compact size="large" label="2. Eiginnafn" value="Svanur" style={{ marginRight: 8 }} />
              <Field compact size="large" label="1. Kenninafn" value="Örn Svanberg" />
            </FieldRow>
            <Field label="4d. Kennitala" value="010171-3389" />
          </FieldGroup>
          <FieldGroup>
            <FieldRow>
              <Field label="4a. Útgáfudagur" value="12.03.1990" />
              <Field label="4b. Gildir til" value="01.01.2041" />
              <Field label="5. Númer" value="36001475" />
            </FieldRow>
          </FieldGroup>
          <View style={{ marginTop: 24, paddingBottom: 4 }}>
            <FieldLabel>9. Réttindaflokkar</FieldLabel>
            <FieldCard code="B" title="Fólksbíll">
              <FieldRow>
                <Field label="Útgáfudagur" value="12.03.1990" />
                <Field label="Gildir til" value="01.01.2041" />
              </FieldRow>
            </FieldCard>
            <FieldCard code="BE" title="Kerra">
              <FieldRow>
                <Field label="Útgáfudagur" value="12.03.1990" />
                <Field label="Gildir til" value="01.01.2041" />
              </FieldRow>
            </FieldCard>
          </View>
        </SafeAreaView>
      </Information>
      <AddPassButton
        style={{ position: 'absolute', bottom: 24, left: 32, right: 32, zIndex: 100, height: 52 }}
        addPassButtonStyle={PassKit.AddPassButtonStyle.black}
        onPress={() => { console.log('onPress') }}
      />
    </>
  )
}

WalletPassScreen.options = {
  topBar: {
    title: {
      component: {
        id: 'WALLET_PASS_NAV_TITLE',
        name: ComponentRegistry.NavigationBarTitle,
        passProps: {
          title: 'Wallet Pass',
        },
      },
      alignment: 'fill',
    },
  },
}
