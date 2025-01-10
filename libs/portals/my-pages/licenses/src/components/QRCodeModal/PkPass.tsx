import { useMutation } from '@apollo/client'
import { Box, Button, toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { hasPassedTimeout } from '../../utils/dateUtils'
import {
  CREATE_PK_PASS,
  useUserProfile,
} from '@island.is/portals/my-pages/graphql'
import { Locale } from '@island.is/shared/types'
import { useEffect, useState } from 'react'
import { m } from '../../lib/messages'

type PkPassProps = {
  licenseType: string
  expireDate?: string
  textButton?: boolean
}

export const PkPass = ({ licenseType }: PkPassProps) => {
  const [pkpassUrl, setPkpassUrl] = useState<string | null>(null)
  const [generatePkPass] = useMutation(CREATE_PK_PASS)
  const { data: userProfile } = useUserProfile()
  const [displayLoader, setDisplayLoader] = useState<boolean>(false)
  const [fetched, setFetched] = useState(false)
  const [linkError, setLinkError] = useState(false)
  const [linkTimestamp, setLinkTimestamp] = useState<Date>()

  const locale = (userProfile?.locale as Locale) ?? 'is'
  const { formatMessage } = useLocale()

  const handleError = (message: string) => {
    setDisplayLoader(false)
    setLinkError(true)
    toast.error(message)
    setTimeout(() => setLinkError(false), 5000)
  }

  useEffect(() => {
    if (pkpassUrl && !hasPassedTimeout(linkTimestamp, 10)) {
      try {
        setTimeout(() => window.location.assign(pkpassUrl), 100)
      } catch {
        handleError(formatMessage(m.licenseFetchError))
      }
    }
  }, [pkpassUrl, linkTimestamp, formatMessage])

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
  )
}
