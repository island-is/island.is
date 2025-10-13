import { FormSystemCompletedSectionInfo } from '@island.is/api/schema'
import { m } from '@island.is/form-system/ui'
import {
  Accordion,
  AccordionItem,
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  Hidden,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useParams } from 'react-router-dom'
import { useApplicationContext } from '../../../../context/ApplicationProvider'
import * as styles from './Completed.css'

export const Completed = () => {
  const { formatMessage, lang } = useLocale()
  const supportEmail = 'island@island.is'
  const { slug } = useParams()
  const { state } = useApplicationContext()
  const { title, confirmationHeader, confirmationText, additionalInfo } = state
    .application.completedSectionInfo as FormSystemCompletedSectionInfo

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
            label={formatMessage(m.completedAccordionTitle)}
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
    stafraentIslandForm()
  ) : (
    <Stack space={3}>
      <Text variant="h2" as="h2" marginBottom={1}>
        {title[lang]}
      </Text>
      <AlertMessage
        type="success"
        title={confirmationHeader[lang]}
        message={confirmationText[lang]}
      />
      <Box
        width="full"
        border="standard"
        borderColor="blue200"
        borderRadius="large"
        padding={3}
      >
        <Accordion
          dividers={false}
          dividerOnBottom={false}
          dividerOnTop={false}
        >
          <AccordionItem
            id="completed-accordion"
            label={formatMessage(m.completedAccordionTitle)}
            startExpanded
          >
            {additionalInfo.length === 1 ? (
              <Box marginBottom={2}>
                <Text className={styles.preserveLines}>
                  {additionalInfo[0][lang]}
                </Text>
              </Box>
            ) : (
              <BulletList space={1}>
                {additionalInfo.map((info, index) => (
                  <Bullet key={index}>
                    <Text className={styles.preserveLines}>{info[lang]}</Text>
                  </Bullet>
                ))}
              </BulletList>
            )}
          </AccordionItem>
        </Accordion>
      </Box>

      <Hidden below="md">
        <img
          src={require('../../../../assets/images/cover.png')}
          alt="Cover"
          style={{ width: '100%', height: 'auto' }}
        />
      </Hidden>
    </Stack>
  )
}
