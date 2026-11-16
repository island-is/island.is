import type {
  FormSystemForm,
  FormSystemSectionInfo,
} from '@island.is/api/schema'
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
import coverImage from './cover.png'

export const PreviewCompleted = ({ form }: { form: FormSystemForm }) => {
  const { formatMessage, lang } = useLocale()
  const completed = form.sectionInfo as
    | Partial<FormSystemSectionInfo>
    | undefined
  const title = completed?.title?.[lang]
  const header =
    completed?.confirmationHeader?.[lang] ?? formatMessage(m.completedHeader)
  const text =
    completed?.confirmationText?.[lang] ?? formatMessage(m.completedText)
  const infos = completed?.additionalInfo ?? []
  const supportEmail = 'island@island.is'
  const applicationPdfDownload = form.enableApplicationPdfDownload ? (
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
          <Button variant="ghost" disabled>
            {formatMessage(m.downloadApplicationPdf)}
          </Button>
        </Box>
        <Box display="flex" alignItems="center">
          <Text>{formatMessage(m.applicationPdfDownloadDescription)}</Text>
        </Box>
      </Box>
    </Stack>
  ) : null

  if (form.slug === 'umsokn-um-samstarf-vid-stafraent-island') {
    return (
      <Stack space={3}>
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
        {applicationPdfDownload}
      </Stack>
    )
  }

  return (
    <Stack space={3}>
      {title && (
        <Text variant="h2" as="h2" marginBottom={1}>
          {title}
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
