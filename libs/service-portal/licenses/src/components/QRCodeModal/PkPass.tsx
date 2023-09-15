import { useEffect, useState } from 'react'
import { Box, Button, toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Locale } from '@island.is/shared/types'
import { useMutation } from '@apollo/client'
import {
  CREATE_PK_PASS,
  GenericLicenseType,
  useUserProfile,
} from '@island.is/service-portal/graphql'
import { m } from '../../lib/messages'
import { theme } from '@island.is/island-ui/theme'
import { hasPassedTimeout } from '../../utils/dateUtils'
import {
  FeatureFlagClient,
  useFeatureFlagClient,
} from '@island.is/react/feature-flags'
import { useWindowSize } from 'react-use'
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

  const getLink = async () => {
    if (pkpassUrl && !hasPassedTimeout(linkTimestamp, 10)) {
      window.open(pkpassUrl)
      setDisplayLoader(false)
      return
    }
    await generatePkPass({
      variables: { locale, input: { licenseType } },
    })
      .then((response) => {
        if (!response.errors && window && typeof window !== 'undefined') {
          setPkpassUrl(response?.data?.generatePkPass?.pkpassUrl)
          window.open(response?.data?.generatePkPass?.pkpassUrl)
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
