import React, { ReactNode, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Form, useLoaderData } from 'react-router-dom'
import isAfter from 'date-fns/isAfter'

import { useUserDecodedIdToken } from '@island.is/auth/react'
import {
  AlertMessage,
  Box,
  Button,
  Divider,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader } from '@island.is/portals/core'
import { Modal } from '@island.is/react/components'
import { useSubmitting } from '@island.is/react-spa/shared'

import { RestrictionsIntent } from './Restrictions.action'
import { m } from '../../lib/messages'
import { formatDate } from '../../utils/formatDate'
import { RestrictionsLoaderResult } from './Restrictions.loader'

import * as styles from './Restrictions.css'

type FormWrapperProps = {
  children: ReactNode
  intent: RestrictionsIntent
}

const FormWrapper = ({ children, intent }: FormWrapperProps) => (
  <Form method="post">
    <input type="hidden" name="intent" value={intent} />
    {children}
  </Form>
)

export default function Restrictions() {
  const { formatMessage } = useLocale()
  const { idp } = useUserDecodedIdToken()
  const data = useLoaderData() as RestrictionsLoaderResult
  const { isLoading, isSubmitting } = useSubmitting()

  const [showModal, setShowModal] = useState(false)

  const dateUntil = new Date(data.disabledUntil)

  const allowRestrictions = isAfter(dateUntil, new Date())
  const hasRestrictions = data.disabledUntil !== null && allowRestrictions
  const showElectronicIdWarning = !idp.includes('sim')

  const formattedDate = formatDate(data.disabledUntil)
  const intent = allowRestrictions
    ? RestrictionsIntent.Enable
    : RestrictionsIntent.Disable

  return (
    <>
      <IntroHeader
        title={formatMessage(m.restrictions)}
        intro={formatMessage(m.restrictionsIntro)}
        imgPosition="right"
        img="./assets/images/skjaldarmerki.svg"
      />
      <FormWrapper intent={intent}>
        <Box
          display="flex"
          rowGap={4}
          flexDirection="column"
          className={styles.content}
        >
          <Divider />
          <Box display="flex" rowGap={1} flexDirection="column">
            <Text variant="h4">
              {formatMessage(m.restrictionsDevicesTitle)}
            </Text>
            <Text>{formatMessage(m.restrictionsDevicesDescription)}</Text>
          </Box>
          {hasRestrictions && (
            <AlertMessage
              type="info"
              message={
                <div className={styles.whiteSpacePreWrap}>
                  <FormattedMessage
                    {...m.messageEnabledRestriction}
                    values={{ date: <b>{formattedDate}</b> }}
                  />
                </div>
              }
            />
          )}
          {showElectronicIdWarning ? (
            <AlertMessage
              type="warning"
              message={formatMessage(m.warningElectronicId)}
            />
          ) : (
            <div>
              <Button
                {...(allowRestrictions
                  ? { onClick: () => setShowModal(true) }
                  : { type: 'submit', loading: isSubmitting || isLoading })}
              >
                {formatMessage(
                  allowRestrictions
                    ? m.enableRestrictions
                    : m.disableRestrictions,
                )}
              </Button>
            </div>
          )}
        </Box>
      </FormWrapper>
      {showModal && (
        <Modal
          label={formatMessage(m.restrictions)}
          id="restrictions-modal"
          isVisible={showModal}
          onClose={() => setShowModal(false)}
          closeButtonLabel={formatMessage(m.closeModal)}
          scrollType="inside"
        >
          <FormWrapper intent={intent}>
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
                    values={{ date: <b>{formattedDate}</b> }}
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
                <Button
                  type="submit"
                  variant="primary"
                  loading={isLoading || isSubmitting}
                >
                  {formatMessage(m.confirm)}
                </Button>
              </Box>
            </Box>
          </FormWrapper>
        </Modal>
      )}
    </>
  )
}
