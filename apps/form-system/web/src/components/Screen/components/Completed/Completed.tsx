import { useLazyQuery } from '@apollo/client'
import { FormSystemSectionInfo } from '@island.is/api/schema'
import coverImage from '../../../../assets/images/cover.png'
import { GET_APPLICATION_PDF } from '@island.is/form-system/graphql'
import { m } from '@island.is/form-system/ui'
import {
  Accordion,
  AccordionItem,
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  Button,
  Hidden,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useApplicationContext } from '../../../../context/ApplicationProvider'

export const Completed = () => {
  const { formatMessage, lang } = useLocale()
  const supportEmail = 'island@island.is'
  const { slug, id } = useParams()
  const { state, enableApplicationPdfDownload } = useApplicationContext()
  const [getApplicationPdf, { loading: pdfLoading }] = useLazyQuery(
    GET_APPLICATION_PDF,
    { fetchPolicy: 'no-cache' },
  )
  const [pdfDownloadError, setPdfDownloadError] = useState(false)
  const completed = state.application.sectionInfo as
    | Partial<FormSystemSectionInfo>
    | undefined
  const t = completed?.title?.[lang]
  const header =
    completed?.confirmationHeader?.[lang] ?? formatMessage(m.completedHeader)
  const text =
    completed?.confirmationText?.[lang] ?? formatMessage(m.completedText)
  const infos = completed?.additionalInfo ?? []

  const downloadApplicationPdf = async () => {
    if (!id || !slug) return

    setPdfDownloadError(false)
    try {
      const { data, error } = await getApplicationPdf({
        variables: { input: { id, slug, locale: lang } },
      })
      const pdf = data?.formSystemApplicationPdf
      if (error || !pdf) {
        setPdfDownloadError(true)
        return
      }

      const bytes = Uint8Array.from(window.atob(pdf.base64), (character) =>
        character.charCodeAt(0),
      )
      const url = URL.createObjectURL(
        new Blob([bytes], { type: 'application/pdf' }),
      )
      const link = document.createElement('a')
      link.href = url
      link.download = pdf.filename
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 30_000)
    } catch {
      setPdfDownloadError(true)
    }
  }

  const applicationPdfDownload = enableApplicationPdfDownload ? (
    <Stack space={3}>
      <Box
        display="flex"
        flexDirection={['column', 'row']}
        alignItems={['flexStart', 'center']}
        border="standard"
        borderColor="blue200"
        borderRadius="large"
        padding={3}
      >
        <Box marginRight={[0, 3]} marginBottom={[2, 0]} flexShrink={0}>
          <Button
            variant="ghost"
            loading={pdfLoading}
            onClick={downloadApplicationPdf}
          >
            {formatMessage(m.downloadApplicationPdf)}
          </Button>
        </Box>
        <Box display="flex" alignItems="center">
          <Text>{formatMessage(m.applicationPdfDownloadDescription)}</Text>
        </Box>
      </Box>
      {pdfDownloadError && (
        <AlertMessage
          type="error"
          title={formatMessage(m.applicationPdfDownloadError)}
        />
      )}
    </Stack>
  ) : null

  const stafraentIslandForm = () => (
    <Box marginTop={5}>
      <AlertMessage
        type="success"
        title={formatMessage(m.completedSuccessTitle)}
        message={formatMessage(m.completedSuccessDescription)}
      />
      <Box
        marginTop={5}
        width="full"
        border="standard"
        borderColor="blue200"
        borderRadius="standard"
        padding={3}
      >
        <Accordion
          dividers={false}
          dividerOnBottom={false}
          dividerOnTop={false}
        >
          <AccordionItem
            id="completed-accordion"
            label={formatMessage(m.completedListHeader)}
            startExpanded
          >
            <Box marginBottom={2}>
              <Text>{formatMessage(m.completedText)}</Text>
            </Box>

            <BulletList space={1}>
              <Bullet>{formatMessage(m.completedBullet1)}</Bullet>
              <Bullet>{formatMessage(m.completedBullet2)}</Bullet>
              <Bullet>
                <Text>
                  {formatMessage(m.completedBullet3)}
                  <a
                    href={`mailto:${supportEmail}`}
                    style={{ textDecoration: 'underline' }}
                  >
                    {supportEmail}
                  </a>
                </Text>
              </Bullet>
            </BulletList>
          </AccordionItem>
        </Accordion>
      </Box>
    </Box>
  )

  return slug === 'umsokn-um-samstarf-vid-stafraent-island' ? (
    <Stack space={3}>
      {stafraentIslandForm()}
      {applicationPdfDownload}
    </Stack>
  ) : (
    <Stack space={3}>
      {t && (
        <Text variant="h2" as="h2" marginBottom={1}>
          {t}
        </Text>
      )}
      <AlertMessage type="success" title={header} message={text} />
      {infos.length > 0 && (
        <Box
          width="full"
          border="standard"
          borderColor="blue200"
          borderRadius="large"
          padding={3}
        >
          <Text variant="h4" as="h4" marginBottom={2}>
            {formatMessage(m.completedListHeader)}
          </Text>
          <BulletList space={1}>
            {infos.map((info, index) => (
              <Bullet key={index}>{info?.[lang] || ''}</Bullet>
            ))}
          </BulletList>
        </Box>
      )}
      {applicationPdfDownload}

      <Hidden below="md">
        <img
          src={coverImage}
          alt="Cover"
          style={{ width: '100%', height: 'auto' }}
        />
      </Hidden>
    </Stack>
  )
}
