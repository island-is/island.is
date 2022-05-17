import React from 'react'
import { defineMessage } from 'react-intl'

import { ActionCard, AlertBanner, Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  IntroHeader,
  ServicePortalModuleComponent,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import LicenseCards from '../../components/LicenseCards/LicenseCards'
import { LicenseLoader } from '../../components/LicenseLoader/LicenseLoader'
import { m } from '../../lib/messages'
import {
  GenericUserLicense,
  GenericUserLicenseFetchStatus,
} from '@island.is/api/schema'
import { useHistory } from 'react-router-dom'

export const LicensesOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.license')
  const { formatMessage } = useLocale()
  const { data, loading, error } = useLicenses()
  const history = useHistory()

  const isError = data?.every(
    (item) => item.fetch.status === GenericUserLicenseFetchStatus.Error,
  )

  const getGenericFieldByName = (item: GenericUserLicense, name: string) => {
    return (
      item.payload?.data.find((field) => field.name === name.toString())
        ?.value ?? undefined
    )
  }

  return (
    <>
      <Box marginBottom={[3, 4, 5]}>
        <IntroHeader
          title={defineMessage(m.title)}
          intro={defineMessage(m.intro)}
        />
      </Box>
      {loading && <LicenseLoader />}
      {data && (
        <LicenseCards>
          {data.map((item, i) => {
            if (item.license.status !== 'HasLicense') {
              return null
            }
            const text = getGenericFieldByName(item, 'skirteinisNumer')
            const expireDate =
              getGenericFieldByName(item, 'gildirTil') ?? undefined

            const tag =
              new Date() > new Date(expireDate ?? 0)
                ? m.isExpired.defaultMessage
                : 'í Gildi'

            return (
              <ActionCard
                key={i}
                heading={
                  item.license.type === 'DriversLicense'
                    ? m.drivingLicense.defaultMessage
                    : m.adrLicense.defaultMessage
                }
                text={`${m.licenseNumber.defaultMessage} - ${text}`}
                tag={{ label: tag }}
                cta={{
                  label: 'click me',
                  onClick: () =>
                    history.push(
                      ServicePortalPath.LicensesDrivingDetail.replace(
                        ':id',
                        text as string,
                      ),
                    ),
                }}
              />
            )
          })}
        </LicenseCards>
      )}
      {error && (
        <Box>
          <AlertBanner
            description={formatMessage(m.errorFetch)}
            variant="error"
          />
        </Box>
      )}
    </>
  )
}

export default LicensesOverview
