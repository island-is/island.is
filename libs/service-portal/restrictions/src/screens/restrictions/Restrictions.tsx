import React, { ReactNode, useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
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
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  APPLICATION_SERVICE_PROVIDER_SLUG,
  IntroHeader,
} from '@island.is/service-portal/core'
import { Modal } from '@island.is/react/components'
import { useSubmitting } from '@island.is/react-spa/shared'

import { RestrictionsIntent, RestrictionsResponse } from './Restrictions.action'
import { m } from '../../lib/messages'
import { RestrictionsLoaderResponse } from './Restrictions.loader'

import * as styles from './Restrictions.css'

const IDP_SIM = 'audkenni_sim'

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
  useNamespaces(['sp.restrictions'])
  const [showModal, setShowModal] = useState(false)

  const { formatMessage } = useLocale()
  const { idp } = useUserDecodedIdToken()

  const loaderData = useLoaderData() as RestrictionsLoaderResponse
  const actionData = useActionData() as RestrictionsResponse
  const { isLoading, isSubmitting } = useSubmitting()
  const { formatDate } = useIntl()

  const formatDateWithFormat = (date: Date) =>
    formatDate(date, { dateStyle: 'short' })

  const isSimIdp = idp === IDP_SIM
  const { restricted, until } =
    actionData?.data === true ? loaderData : actionData?.data ?? loaderData

  const futureDate = startOfDay(addDays(new Date(), 8))
  const intent = !restricted
    ? RestrictionsIntent.Enable
    : RestrictionsIntent.Disable

  useEffect(() => {
    if (!isLoading && !isSubmitting && showModal) {
      setShowModal(false)
    }
  }, [isLoading, isSubmitting])

  return (
    <>
      <IntroHeader
        title={formatMessage(m.restrictions)}
        intro={formatMessage(m.restrictionsIntro)}
        serviceProviderSlug={APPLICATION_SERVICE_PROVIDER_SLUG}
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
          {restricted && until && (
            <AlertMessage
              type="info"
              message={
                <div className={styles.whiteSpacePreWrap}>
                  <FormattedMessage
                    {...m.messageEnabledRestriction}
                    values={{
                      date: <b>{formatDateWithFormat(new Date(until))}</b>,
                    }}
                  />
                </div>
              }
            />
          )}
          {/* if developer wants to try out this feature he has to use real phone number and login with two factor */}
          {!isSimIdp && !restricted ? (
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
                        <b>
                          {formatDateWithFormat(
                            startOfDay(addDays(new Date(), 8)),
                          )}
                        </b>
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
