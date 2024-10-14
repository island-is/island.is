import { useParams } from 'react-router-dom'
import {
  AlertMessage,
  Box,
  Button,
  Icon,
  Inline,
  Text,
} from '@island.is/island-ui/core'
import {
  FootNote,
  IntroHeader,
  UserInfoLine,
  StackWithBottomDivider,
  formSubmit,
  LinkButton,
} from '@island.is/portals/my-pages/core'
import { DocumentsPaths } from '@island.is/portals/my-pages/documents'
import { useLocale, useNamespaces } from '@island.is/localization'
import { olMessage as om } from '../../../lib/messages'
import { useGetOccupationalLicenseByIdQuery } from './OccupationalLicensesDetail.generated'
import { Problem } from '@island.is/react-spa/shared'
import { OrganizationSlugType } from '@island.is/shared/constants'
import { useOrganization } from '@island.is/portals/my-pages/graphql'
import {
  OccupationalLicenseV2LicenseType,
  OccupationalLicensesV2LinkType,
} from '@island.is/api/schema'

type UseParams = {
  id: string
}

const EDUCATION_LICENSE_SIGNED_CERTIFICATE_CUTOFF = new Date(2020, 0, 1)

const OccupationalLicenseDetail = () => {
  const { id } = useParams() as UseParams
  useNamespaces('sp.occupational-licenses')
  const { formatDateFns, formatMessage, locale } = useLocale()

  const { data, loading, error } = useGetOccupationalLicenseByIdQuery({
    variables: {
      input: { id, locale },
    },
  })

  const { data: organization } = useOrganization(
    data?.occupationalLicenseV2?.license.issuer ?? undefined,
  )

  const res = data?.occupationalLicenseV2
  const license = res?.license

  const isOldEducationLicense =
    license?.type === OccupationalLicenseV2LicenseType.EDUCATION &&
    license.validFrom &&
    new Date(license.validFrom) < EDUCATION_LICENSE_SIGNED_CERTIFICATE_CUTOFF

  return (
    <>
      <IntroHeader
        marginBottom={2}
        title={license?.title ?? formatMessage(om.occupationalLicense)}
        intro={res?.headerText ?? ''}
        serviceProviderSlug={license?.issuer as OrganizationSlugType}
      >
        {!isOldEducationLicense && res?.actions && (
          <Box paddingTop={3}>
            {
              <Inline space={1} collapseBelow="sm">
                {res.actions.map((a, index) => {
                  if (!a) {
                    return null
                  }
                  if (a.type === OccupationalLicensesV2LinkType.FILE) {
                    return (
                      <Button
                        key={`button-file-${index}`}
                        variant="utility"
                        iconType="outline"
                        onClick={() => {
                          if (a.url) {
                            formSubmit(a.url)
                          }
                        }}
                        icon={'download'}
                      >
                        {a.text}
                      </Button>
                    )
                  }

                  return (
                    <LinkButton
                      key={`button-link-${index}`}
                      variant="utility"
                      to={
                        a.type === OccupationalLicensesV2LinkType.DOCUMENT
                          ? DocumentsPaths.ElectronicDocumentSingle.replace(
                              ':id',
                              a.url,
                            )
                          : a.url
                      }
                      text={a.text}
                      icon={
                        a.type === OccupationalLicensesV2LinkType.DOCUMENT
                          ? 'mailOpen'
                          : 'open'
                      }
                    />
                  )
                })}
              </Inline>
            }
          </Box>
        )}
      </IntroHeader>
      {error && !loading && <Problem noBorder={false} error={error} />}
      {!error && !loading && isOldEducationLicense && (
        <AlertMessage
          type="warning"
          title={formatMessage(om.educationLicenseDigitalUnavailable)}
          message={formatMessage(
            om.educationLicenseDigitalUnavailableDescription,
          )}
        />
      )}
      {!error && (loading || data?.occupationalLicenseV2) && (
        <StackWithBottomDivider space={2} box={{ marginTop: [2, 3, 6] }}>
          <UserInfoLine
            loading={loading}
            label={formatMessage(om.nameOfIndividual)}
            content={license?.licenseHolderName ?? ''}
          />
          {license?.licenseNumber && (
            <UserInfoLine
              loading={loading}
              label={formatMessage(om.licenseNumber)}
              content={license?.licenseNumber ?? ''}
            />
          )}
          {license?.dateOfBirth && (
            <UserInfoLine
              loading={loading}
              label={formatMessage(om.dateOfBirth)}
              content={
                license?.dateOfBirth
                  ? formatDateFns(license.dateOfBirth, 'dd.MM.yyyy')
                  : undefined
              }
            />
          )}
          {(license?.profession || loading) && (
            <UserInfoLine
              loading={loading}
              label={formatMessage(om.profession)}
              content={license?.profession ?? ''}
            />
          )}
          {(license?.permit || loading) && (
            <UserInfoLine
              loading={loading}
              label={formatMessage(om.typeofLicense)}
              content={license?.permit ?? ''}
            />
          )}
          {(license?.issuerTitle || organization?.title || loading) && (
            <UserInfoLine
              loading={loading}
              label={formatMessage(om.publisher)}
              content={license?.issuerTitle ?? organization?.title ?? ''}
            />
          )}
          {(license?.validFrom || loading) && (
            <UserInfoLine
              loading={loading}
              label={formatMessage(om.dateOfIssue)}
              content={
                license?.validFrom
                  ? formatDateFns(license.validFrom, 'dd.MM.yyyy')
                  : undefined
              }
            />
          )}
          {(license?.status || loading) && !isOldEducationLicense && (
            <UserInfoLine
              loading={loading}
              label={formatMessage(om.licenseStatus)}
              content={
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  columnGap="p1"
                >
                  <Text>
                    {formatMessage(
                      license?.status === 'VALID'
                        ? om.validLicense
                        : license?.status === 'LIMITED'
                        ? om.validWithLimitationsLicense
                        : om.invalidLicense,
                    )}
                  </Text>
                  <Icon
                    icon={
                      license?.status === 'VALID'
                        ? 'checkmarkCircle'
                        : license?.status === 'LIMITED'
                        ? 'warning'
                        : 'closeCircle'
                    }
                    color={
                      license?.status === 'VALID'
                        ? 'mint600'
                        : license?.status === 'LIMITED'
                        ? 'yellow600'
                        : 'red600'
                    }
                    type="filled"
                  />
                </Box>
              }
            />
          )}
          {license?.genericFields?.length &&
            license.genericFields.map((g, index) => (
              <UserInfoLine
                key={index}
                loading={loading}
                label={g.title}
                content={g.value}
              />
            ))}
        </StackWithBottomDivider>
      )}
      {res?.footerText && (
        <Box paddingTop={4}>
          <Text variant="small" paddingBottom={2}>
            {res.footerText}
          </Text>
        </Box>
      )}
      <FootNote
        serviceProviderSlug={
          license?.issuer ? (license.issuer as OrganizationSlugType) : undefined
        }
      />
    </>
  )
}

export default OccupationalLicenseDetail
