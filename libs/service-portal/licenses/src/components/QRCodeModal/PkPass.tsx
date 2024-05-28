import { useMutation } from '@apollo/client'
import { Box, Button, toast } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import {
  FeatureFlagClient,
  useFeatureFlagClient,
} from '@island.is/react/feature-flags'
import {
  CREATE_PK_PASS,
  GenericLicenseType,
  useUserProfile,
} from '@island.is/service-portal/graphql'
import { Locale } from '@island.is/shared/types'
import { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'
import { m } from '../../lib/messages'
import { hasPassedTimeout } from '../../utils/dateUtils'
import { DriversLicensePkPass } from './DriversLicensePkPass'

type PkPassProps = {
  licenseType: string
  expireDate?: string
  textButton?: boolean
}

export const PkPass = ({
  licenseType,
  expireDate,
  textButton = false,
}: PkPassProps) => {
  const [pkpassUrl, setPkpassUrl] = useState<string | null>(null)
  const [generatePkPass] = useMutation(CREATE_PK_PASS)
  const { data: userProfile } = useUserProfile()
  const [displayLoader, setDisplayLoader] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState(false)
  const [fetched, setFetched] = useState(false)
  const [linkError, setLinkError] = useState(false)
  const [linkTimestamp, setLinkTimestamp] = useState<Date>()
  const [useNewDriversLicense, setUseNewDriversLicense] = useState(false)

  const locale = (userProfile?.locale as Locale) ?? 'is'
  const { formatMessage } = useLocale()
  const { width } = useWindowSize()
  const featureFlagClient: FeatureFlagClient = useFeatureFlagClient()

  /* Should use the new drivers license? */
  useEffect(() => {
    const isFlagEnabled = async () => {
      const ffEnabled = await featureFlagClient.getValue(
        `isLicenseServiceDrivingLicenceClientV2Enabled`,
        false,
      )
      if (ffEnabled) {
        setUseNewDriversLicense(ffEnabled as boolean)
      }
    }
    isFlagEnabled()
  }, [])

  useEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  const isOldDriversLicense =
    licenseType === GenericLicenseType.DriversLicense && !useNewDriversLicense

  const handleError = (message: string) => {
    setDisplayLoader(false)
    setLinkError(true)
    toast.error(message)
    setTimeout(() => setLinkError(false), 5000)
  }

  useEffect(() => {
    if (pkpassUrl && !hasPassedTimeout(linkTimestamp, 10)) {
      window.location.assign(pkpassUrl)
    }
  }, [pkpassUrl, linkTimestamp])

  const getLink = async () => {
    await generatePkPass({
      variables: { locale, input: { licenseType } },
    })
      .then((response) => {
        if (
          !response.errors &&
          window &&
          typeof window !== 'undefined' &&
          response?.data?.generatePkPass?.pkpassUrl
        ) {
          setPkpassUrl(response.data.generatePkPass.pkpassUrl)
          setFetched(true)
          setDisplayLoader(false)
          setLinkTimestamp(new Date())
        } else {
          handleError(formatMessage(m.licenseFetchError))
        }
      })
      .catch(() => {
        handleError(formatMessage(m.licenseFetchError))
        return
      })
  }

  return (
    <>
      {!isMobile && isOldDriversLicense && (
        <DriversLicensePkPass textButton={textButton} expireDate={expireDate} />
      )}

      {(isMobile || !isOldDriversLicense) && (
        <Box>
          <Button
            variant="utility"
            disabled={linkError}
            size="small"
            loading={displayLoader}
            icon={
              fetched && !linkError
                ? 'checkmark'
                : displayLoader
                ? undefined
                : linkError
                ? 'warning'
                : 'QRCode'
            }
            iconType="outline"
            onClick={() => {
              setDisplayLoader(true)
              getLink()
            }}
          >
            {formatMessage(m.sendToPhone)}
          </Button>
        </Box>
      )}
    </>
  )
}
