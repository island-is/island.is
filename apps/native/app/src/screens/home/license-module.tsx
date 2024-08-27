import { Typography, Heading, ChevronRight, ViewPager } from '@ui'

import React from 'react'
import { FormattedMessage } from 'react-intl'
import { SafeAreaView, TouchableOpacity } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { navigateTo } from '../../lib/deep-linking'
import {
  GenericLicenseType,
  useGetIdentityDocumentQuery,
  useListLicensesQuery,
} from '../../graphql/types/schema'
import { WalletItem } from '../wallet/components/wallet-item'
import { screenWidth } from '../../utils/dimensions'

const Host = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`

export const LicenseModule = React.memo(() => {
  const theme = useTheme()

  // Query list of licenses
  const res = useListLicensesQuery({
    variables: {
      input: {
        includedTypes: [
          GenericLicenseType.DriversLicense,
          GenericLicenseType.AdrLicense,
          GenericLicenseType.MachineLicense,
          GenericLicenseType.FirearmLicense,
          GenericLicenseType.DisabilityLicense,
          GenericLicenseType.PCard,
          GenericLicenseType.Ehic,
          GenericLicenseType.HuntingLicense,
        ],
      },
    },
  })

  // Additional licenses
  const resPassport = useGetIdentityDocumentQuery()

  const licenses = res.data?.genericLicenses
  const passport = resPassport.data?.getIdentityDocument

  if (!licenses || res.error || resPassport.error) {
    return null
  }

  const count = licenses?.length ?? 0 + (passport ? 1 : 0)

  if (count === 0) {
    return null
  }

  const allLicenses = [...licenses, ...(passport ?? [])]

  const children = allLicenses
    .filter(
      (license) =>
        license.__typename === 'GenericUserLicense' ||
        license.__typename === 'IdentityDocumentModel',
    )
    ?.slice(0, 3)
    .map((item, index) => (
      <WalletItem
        key={index}
        item={item}
        style={
          count > 1
            ? {
                width: screenWidth - theme.spacing[2] * 3,
                paddingLeft: theme.spacing[2],
                paddingRight: 0,
              }
            : {
                width: '100%',
              }
        }
        noPadding
      />
    ))

  return (
    <SafeAreaView
      style={{
        marginHorizontal: theme.spacing[2],
      }}
    >
      <Host>
        <TouchableOpacity onPress={() => navigateTo(`/wallet`)}>
          <Heading
            button={
              count === 0 ? null : (
                <TouchableOpacity
                  onPress={() => navigateTo('/wallet')}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Typography weight="400" color={theme.color.blue400}>
                    <FormattedMessage id="button.seeAll" />
                  </Typography>
                  <ChevronRight />
                </TouchableOpacity>
              )
            }
          >
            <FormattedMessage id="home.licenses" />
          </Heading>
        </TouchableOpacity>
        {count === 1 && children.slice(0, 1)}
        {count >= 2 && <ViewPager>{children}</ViewPager>}
      </Host>
    </SafeAreaView>
  )
})
