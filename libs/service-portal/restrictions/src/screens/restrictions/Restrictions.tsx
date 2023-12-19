import { useLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'
import { Modal } from '@island.is/react/components'
import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Form, useLoaderData } from 'react-router-dom'
import { Box, Button, Divider, Text } from '@island.is/island-ui/core'

import { RestrictionsLoaderResult } from './Restrictions.loader'
import { m } from '../../lib/messages'
import { formatDate } from '../../utils/formatDate'
import * as styles from './Restrictions.css'

export default function Restrictions() {
  const data = useLoaderData() as RestrictionsLoaderResult
  const enableRestrictions = true
  const date = formatDate(new Date())
  const [showModal, setShowModal] = useState(false)
  const { formatMessage } = useLocale()

  return (
    <Form method="post">
      <Box>
        <IntroHeader
          title={formatMessage(m.restrictions)}
          intro={formatMessage(m.restrictionsIntro)}
          imgPosition="right"
          img="./assets/images/skjaldarmerki.svg"
        />
        <Divider />
        <Box
          display="flex"
          rowGap={1}
          paddingY={4}
          flexDirection="column"
          className={styles.content}
        >
          <Text variant="h4">{formatMessage(m.restrictionsDevicesTitle)}</Text>
          <Text>{formatMessage(m.restrictionsDevicesDescription)}</Text>
        </Box>
        <Button onClick={() => setShowModal(true)}>
          {formatMessage(
            enableRestrictions ? m.enableRestrictions : m.disableRestrictions,
          )}
        </Button>
      </Box>

      {showModal && (
        <Modal
          label={formatMessage(m.restrictions)}
          id="restrictions-modal"
          isVisible={showModal}
          onClose={() => setShowModal(false)}
          closeButtonLabel={formatMessage(m.closeModal)}
          scrollType="inside"
        >
          <Box
            paddingY={3}
            paddingX={[0, 8]}
            rowGap={7}
            display="flex"
            flexDirection="column"
          >
            <Box rowGap={2} display="flex" flexDirection="column">
              <Text variant="h2">{formatMessage(m.modalTitle)}</Text>
              <Text variant="h3" fontWeight="light">
                <FormattedMessage
                  {...m.modalDescription}
                  values={{ date: <b>{date}</b> }}
                />
              </Text>
              <Text variant="h3" fontWeight="light" marginTop={2}>
                {formatMessage(m.modalConfirmText)}
              </Text>
            </Box>
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
            >
              <Button variant="ghost" onClick={() => setShowModal(false)}>
                {formatMessage(m.cancel)}
              </Button>
              <Button type="submit" variant="primary">
                {formatMessage(m.confirm)}
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </Form>
  )
}
