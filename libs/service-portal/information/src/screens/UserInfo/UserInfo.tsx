import React from 'react'
import { defineMessage } from 'react-intl'
import { checkDelegation } from '@island.is/shared/utils'

import { useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { Box, Divider, Stack } from '@island.is/island-ui/core'
import { useLocale, withClientLocale } from '@island.is/localization'
import {
  formatNationalId,
  IntroHeader,
  m,
  ServicePortalModuleComponent,
  UserInfoLine,
} from '@island.is/service-portal/core'

import {
  natRegGenderMessageDescriptorRecord,
  natRegMaritalStatusMessageDescriptorRecord,
} from '../../helpers/localizationHelpers'
import { spmm } from '../../lib/messages'
import { NATIONAL_REGISTRY_FAMILY } from '../../lib/queries/getNationalRegistryFamily'
import { NATIONAL_REGISTRY_USER } from '../../lib/queries/getNationalRegistryUser'

const dataNotFoundMessage = defineMessage({
  id: 'sp.family:data-not-found',
  defaultMessage: 'Gögn fundust ekki',
})

const changeInNationalReg = defineMessage({
  id: 'sp.family:change-in-national-registry',
  defaultMessage: 'Breyta hjá Þjóðskrá',
})

const SubjectInfo: ServicePortalModuleComponent = ({ userInfo }) => {
  const { formatMessage } = useLocale()
  const { data, loading, error } = useQuery<Query>(NATIONAL_REGISTRY_USER)
  const { nationalRegistryUser } = data || {}
  const isDelegation = userInfo && checkDelegation(userInfo)

  // User's Family members
  const { data: famData, loading: familyLoading } = useQuery<Query>(
    NATIONAL_REGISTRY_FAMILY,
    {
      skip: isDelegation,
    },
  )
  const { nationalRegistryFamily } = famData || {}
  return (
    <>
      <IntroHeader title={userInfo.profile.name} intro={spmm.userInfoDesc} />
      <Stack space={2}>
        <UserInfoLine
          title={formatMessage(m.myRegistration)}
          label={m.fullName}
          loading={loading}
          content={nationalRegistryUser?.fullName}
          editLink={{
            external: true,
            title: changeInNationalReg,
            url:
              'https://www.skra.is/umsoknir/eydublod-umsoknir-og-vottord/stok-vara/?productid=5c55d7a6-089b-11e6-943d-005056851dd2',
          }}
        />
        <Divider />
        <UserInfoLine
          label={m.natreg}
          loading={loading}
          content={formatNationalId(userInfo.profile.nationalId)}
        />
        <Divider />

        <UserInfoLine
          label={m.legalResidence}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : nationalRegistryUser?.legalResidence || ''
          }
          loading={loading}
          editLink={{
            external: true,
            title: changeInNationalReg,
            url:
              'https://www.skra.is/umsoknir/rafraen-skil/flutningstilkynning/',
          }}
        />
        <Divider />
        <Box marginY={3} />
        <UserInfoLine
          title={formatMessage(m.baseInfo)}
          label={m.birthPlace}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : nationalRegistryUser?.birthPlace || ''
          }
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={m.familyNumber}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : nationalRegistryUser?.familyNr || ''
          }
          loading={loading}
          tooltip={formatMessage({
            id: 'sp.family:family-number-tooltip',
            defaultMessage:
              'Fjölskyldunúmer er samtenging á milli einstaklinga á lögheimili, en veitir ekki upplýsingar um hverjir eru foreldrar barns eða forsjáraðilar.',
          })}
        />
        <Divider />
        <UserInfoLine
          label={m.maritalStatus}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : nationalRegistryUser?.maritalStatus
              ? formatMessage(
                  natRegMaritalStatusMessageDescriptorRecord[
                    nationalRegistryUser?.maritalStatus
                  ],
                )
              : ''
          }
          loading={loading}
        />

        <Divider />
        <UserInfoLine
          label={defineMessage(m.religion)}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : nationalRegistryUser?.religion || ''
          }
          loading={loading}
          editLink={{
            external: true,
            title: changeInNationalReg,
            url:
              'https://www.skra.is/umsoknir/rafraen-skil/tru-og-lifsskodunarfelag',
          }}
        />
        <Divider />
        <UserInfoLine
          label={m.banMarking}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : nationalRegistryUser?.banMarking?.banMarked
              ? formatMessage({
                  id: 'sp.family:yes',
                  defaultMessage: 'Já',
                })
              : formatMessage({
                  id: 'sp.family:no',
                  defaultMessage: 'Nei',
                })
          }
          tooltip={formatMessage({
            id: 'sp.family:ban-marking-tooltip',
            defaultMessage:
              'Bannmerktir einstaklingar koma t.d. ekki fram á úrtakslistum úr þjóðskrá og öðrum úrtökum í markaðssetningarskyni.',
          })}
          loading={loading}
          editLink={{
            external: true,
            title: changeInNationalReg,
            url: 'https://www.skra.is/umsoknir/rafraen-skil/bannmerking/',
          }}
        />
        <Divider />
        <UserInfoLine
          label={m.gender}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : nationalRegistryUser?.gender
              ? formatMessage(
                  natRegGenderMessageDescriptorRecord[
                    nationalRegistryUser.gender
                  ],
                )
              : ''
          }
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={m.citizenship}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : nationalRegistryUser?.citizenship?.name || ''
          }
          loading={loading}
        />
        {!isDelegation && (
          <>
            <Divider />
            <Box marginY={3} />
            <UserInfoLine
              title={formatMessage(spmm.userFamilyMembersOnNumber)}
              label={userInfo.profile.name}
              content={formatNationalId(userInfo.profile.nationalId)}
              loading={loading || familyLoading}
            />
            <Divider />
            {nationalRegistryFamily && nationalRegistryFamily.length > 0
              ? nationalRegistryFamily?.map((item) => (
                  <React.Fragment key={item.nationalId}>
                    <UserInfoLine
                      label={item.fullName}
                      content={formatNationalId(item.nationalId)}
                      loading={loading}
                    />
                    <Divider />
                  </React.Fragment>
                ))
              : null}
          </>
        )}
      </Stack>
    </>
  )
}

export default withClientLocale('sp.family')(SubjectInfo)
