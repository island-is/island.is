import {
  GenericLicenseType,
  GenericUserLicenseMetaLinksType,
  GenericUserLicensePkPassStatus,
} from '@island.is/api/schema'
import {
  AlertMessage,
  Blockquote,
  Box,
  GridColumn,
  GridRow,
  Inline,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'
import {
  CardLoader,
  IntroWrapper,
  LinkButton,
  m as coreMessages,
} from '@island.is/portals/my-pages/core'
import { isDefined } from '@island.is/shared/utils'
import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { getTypeFromPath, isLicenseTypePath } from '../../../utils/mapPaths'
import { m } from '../../../lib/messages'
import { useGenericLicenseLazyQuery } from './LicenseDetail.generated'
import { LicenseDataFields } from '../../../components/LicenseDataFields/LicenseDataFields'

type UseParams = {
  type: string | undefined
  provider: string
  id: string
}

const LicenseDetail = () => {
  useNamespaces('sp.license')
  const { formatMessage, lang } = useLocale()
  const { type, id } = useParams() as UseParams

  const [genericLicenseQuery, { data, loading, error }] =
    useGenericLicenseLazyQuery()

  const licenseType: GenericLicenseType | undefined = useMemo(() => {
    if (type && isLicenseTypePath(type)) {
      return getTypeFromPath(type)
    }
    return
  }, [type])

  useEffect(() => {
    if (licenseType) {
      genericLicenseQuery({
        variables: {
          locale: lang,
          input: {
            licenseId: id,
            licenseType,
          },
        },
      })
    }
  }, [genericLicenseQuery, id, lang, licenseType])

  const genericLicense = data?.genericLicense ?? null

  return (
    <IntroWrapper
      title={
        genericLicense?.payload?.metadata?.title ??
        formatMessage(coreMessages.licenseNavTitle)
      }
      introComponent={genericLicense?.payload?.metadata?.description
        ?.map((message, index) => {
          if (!message.linkInText) {
            return (
              <Text key={`intro-header-text-${index}`}>
                {message.text}
                <br />
              </Text>
            )
          }
          if (message.linkInText && message.linkIconType) {
            return (
              <LinkButton
                key={`intro-header-button-${index}`}
                variant="text"
                to={message.linkInText}
                text={message.text}
              />
            )
          }
          return null
        })
        .filter(isDefined)}
      marginBottom={4}
    >
      <GridRow marginBottom={2}>
        <GridColumn span={['12/12', '10/12']}>
          <Blockquote>
            <Text>
              {formatMessage(m.pkpassRemoved, {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                link: (str: any) => (
                  <LinkButton
                    to="https://island.is/app"
                    text={str}
                    variant="text"
                    size="small"
                  />
                ),
              })}
            </Text>
          </Blockquote>
        </GridColumn>
      </GridRow>
      {genericLicense?.payload?.metadata.alert ? (
        <Box paddingTop={3}>
          <AlertMessage
            type={
              genericLicense.payload.metadata.alert.type === 'WARNING'
                ? 'warning'
                : genericLicense.payload.metadata.alert.type === 'ERROR'
                ? 'error'
                : 'info'
            }
            title={genericLicense.payload.metadata.alert.title}
            message={genericLicense.payload.metadata.alert.message}
          />
        </Box>
      ) : undefined}
      {genericLicense?.payload?.metadata?.links ||
      (genericLicense?.license.pkpassStatus ===
        GenericUserLicensePkPassStatus.Available &&
        licenseType) ? (
        <Box paddingTop={3}>
          <Inline space={1}>
            {genericLicense?.payload?.metadata.links
              ?.map((link, index) => {
                if (link.label && link.value && link.type) {
                  return (
                    <LinkButton
                      variant="utility"
                      key={`${type}-license-button-${index}`}
                      to={link.value}
                      text={link.label}
                      icon={
                        link.type === GenericUserLicenseMetaLinksType.Download
                          ? 'download'
                          : 'open'
                      }
                    />
                  )
                }
                return null
              })
              .filter(isDefined)}
          </Inline>
        </Box>
      ) : undefined}
      {error && !loading && <Problem error={error} noBorder={false} />}{' '}
      {!error && !loading && !genericLicense && (
        <Problem
          type="no_data"
          title={formatMessage(coreMessages.noDataFound)}
          message={formatMessage(coreMessages.noDataFoundDetail)}
          imgSrc="./assets/images/coffee.svg"
          titleSize="h3"
          noBorder={false}
        />
      )}
      {!error && loading && <CardLoader />}
      <LicenseDataFields
        fields={genericLicense?.payload?.data ?? []}
        licenseType={licenseType}
      />
    </IntroWrapper>
  )
}

export default LicenseDetail
