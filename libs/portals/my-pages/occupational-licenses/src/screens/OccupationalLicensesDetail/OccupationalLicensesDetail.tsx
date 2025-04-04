import { useParams } from 'react-router-dom'
import {
  AlertMessage,
  Box,
  Button,
  Icon,
  Text,
} from '@island.is/island-ui/core'
import {
  formSubmit,
  LinkButton,
  IntroWrapper,
  InfoLineStack,
  InfoLine,
} from '@island.is/portals/my-pages/core'
import { DocumentsPaths } from '@island.is/portals/my-pages/documents'
import { useLocale, useNamespaces } from '@island.is/localization'
import { olMessage as om } from '../../lib/messages'
import { Problem } from '@island.is/react-spa/shared'
import { OrganizationSlugType } from '@island.is/shared/constants'
import { useOrganization } from '@island.is/portals/my-pages/graphql'
import {
  OccupationalLicenseLicenseType,
  OccupationalLicensesLinkType,
} from '@island.is/api/schema'
import { useGetOccupationalLicenseByIdQuery } from './OccupationalLicensesDetail.generated'

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
    data?.occupationalLicense?.license.issuer ?? undefined,
  )

  const res = data?.occupationalLicense
  const license = res?.license

  const isOldEducationLicense =
    license?.type === OccupationalLicenseLicenseType.EDUCATION &&
    license.validFrom &&
    new Date(license.validFrom) < EDUCATION_LICENSE_SIGNED_CERTIFICATE_CUTOFF

  return (
    <IntroWrapper
      marginBottom={2}
      title={license?.title ?? formatMessage(om.occupationalLicense)}
      intro={res?.headerText ?? ''}
      serviceProviderSlug={license?.issuer as OrganizationSlugType}
      buttonGroup={
        !isOldEducationLicense && res?.actions
          ? res.actions.map((a, index) => {
              if (!a) {
                return null
              }
              if (a.type === OccupationalLicensesLinkType.FILE) {
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
                    a.type === OccupationalLicensesLinkType.DOCUMENT
                      ? DocumentsPaths.ElectronicDocumentSingle.replace(
                          ':id',
                          a.url,
                        )
                      : a.url
                  }
                  text={a.text}
                  icon={
                    a.type === OccupationalLicensesLinkType.DOCUMENT
                      ? 'mailOpen'
                      : 'open'
                  }
                />
              )
            })
          : undefined
      }
    >
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
      {!error && (loading || data?.occupationalLicense) && (
        <InfoLineStack space={2}>
          <InfoLine
            loading={loading}
            label={formatMessage(om.nameOfIndividual)}
            content={license?.licenseHolderName ?? ''}
          />
          {license?.licenseNumber && (
            <InfoLine
              loading={loading}
              label={formatMessage(om.licenseNumber)}
              content={license?.licenseNumber ?? ''}
            />
          )}
          {license?.dateOfBirth && (
            <InfoLine
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
            <InfoLine
              loading={loading}
              label={formatMessage(om.profession)}
              content={license?.profession ?? ''}
            />
          )}
          {(license?.permit || loading) && (
            <InfoLine
              loading={loading}
              label={formatMessage(om.typeofLicense)}
              content={license?.permit ?? ''}
            />
          )}
          {(license?.issuerTitle || organization?.title || loading) && (
            <InfoLine
              loading={loading}
              label={formatMessage(om.publisher)}
              content={license?.issuerTitle ?? organization?.title ?? ''}
            />
          )}
          {(license?.validFrom || loading) && (
            <InfoLine
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
            <InfoLine
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
              <InfoLine
                key={index}
                loading={loading}
                label={g.title}
                content={g.value}
              />
            ))}
        </InfoLineStack>
      )}
      {res?.footerText && (
        <Box paddingTop={4}>
          <Text variant="small" paddingBottom={2}>
            {res.footerText}
          </Text>
        </Box>
      )}
    </IntroWrapper>
  )
}

export default OccupationalLicenseDetail
