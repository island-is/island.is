import React, { ReactNode, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Form, useActionData, useLoaderData } from 'react-router-dom'
import addDays from 'date-fns/addDays'
import startOfDay from 'date-fns/startOfDay'

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

import { RestrictionsIntent, RestrictionsResponse } from './Restrictions.action'
import { m } from '../../lib/messages'
import { formatDate } from '../../utils/formatDate'
import { RestrictionsLoaderResponse } from './Restrictions.loader'

import * as styles from './Restrictions.css'

const IDP_SIM = 'audkenni_sim'

const createFutureRestrictionDate = () => startOfDay(addDays(new Date(), 8))

type FormWrapperProps = {
  children: ReactNode
  intent: RestrictionsIntent
  date?: Date
}

const FormWrapper = ({ children, intent, date }: FormWrapperProps) => (
  <Form method="post">
    <input type="hidden" name="intent" value={intent} />
    {intent === RestrictionsIntent.Enable && date && (
      <input type="hidden" name="until" value={date.toISOString()} />
    )}
    {children}
  </Form>
)

export default function Restrictions() {
  const [showModal, setShowModal] = useState(false)

  const { formatMessage } = useLocale()
  const { idp } = useUserDecodedIdToken()

  const loaderData = useLoaderData() as RestrictionsLoaderResponse
  const { isLoading, isSubmitting } = useSubmitting()
  const actionData = useActionData() as RestrictionsResponse

  const isSimIdp = idp === IDP_SIM
  const { restricted, until } =
    actionData?.data === true ? loaderData : actionData?.data ?? loaderData

  const dateUntil = until ? new Date(until) : null
  const futureDate = createFutureRestrictionDate()

  const formattedDate = dateUntil ? formatDate(futureDate) : null
  const intent = !restricted
    ? RestrictionsIntent.Enable
    : RestrictionsIntent.Disable

  useEffect(() => {
    if (!isLoading && !isSubmitting) {
      setShowModal(false)
    }
  }, [isLoading, isSubmitting])

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
          {restricted && formattedDate && isSimIdp && (
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
          {/* if developer wants to try out this feature he has to use real phone number and login with two factor */}
          {!isSimIdp ? (
            <AlertMessage
              type="warning"
              message={formatMessage(m.warningElectronicId)}
            />
          ) : (
            <div>
              <Button
                {...(!restricted
                  ? { onClick: () => setShowModal(true) }
                  : {
                      type: 'submit',
                      variant: 'ghost',
                      loading:
                        intent === RestrictionsIntent.Disable
                          ? isSubmitting || isLoading
                          : false,
                    })}
              >
                {formatMessage(
                  !restricted ? m.enableRestrictions : m.disableRestrictions,
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
          <FormWrapper intent={intent} date={futureDate}>
            <Box
              paddingY={3}
              paddingX={[0, 8]}
              rowGap={7}
              display="flex"
              flexDirection="column"
            >
              <Box rowGap={2} display="flex" flexDirection="column">
                <Text variant="h2">{formatMessage(m.modalTitle)}</Text>
                <Text variant="h3" fontWeight="light" marginTop={2}>
                  {formatMessage(m.modalDescription)}
                </Text>
                <Text variant="h3" fontWeight="light">
                  <FormattedMessage
                    {...m.modalConfirmText}
                    values={{
                      date: (
                        <b>{formatDate(startOfDay(addDays(new Date(), 8)))}</b>
                      ),
                    }}
                  />
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
