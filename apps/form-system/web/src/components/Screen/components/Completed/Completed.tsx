import { m } from '@island.is/form-system/ui'
import {
  Accordion,
  AccordionItem,
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  Text,
} from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'

export const Completed = () => {
  const { formatMessage } = useIntl()
  const supportEmail = 'island@island.is'

  return (
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
}
