import React, { FC, useEffect, useState } from 'react'
import {
  Button,
  Box,
  ModalBase,
  Text,
  Stack,
  FocusableBox,
  Icon,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import * as styles from './ErrorModal.treat'

import { useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { APPLICANT_APPLICATIONS } from '@island.is/application/graphql'
import { m } from '../../forms/messages'
import { Address } from '@island.is/api/schema'

export interface ContentType {
  title?: string
  description?: string
  buttonText?: string
  buttonAction?: () => {}
}

const ErrorModal: FC<FieldBaseProps> = ({ field, application }) => {
  const { formatMessage } = useLocale()
  const { type } = useParams()
  const [shouldRender, setShouldRender] = useState<boolean>(true)
  const [content, setContent] = useState<ContentType>()

  const { data, loading, error: applicationsError } = useQuery(
    APPLICANT_APPLICATIONS,
    {
      variables: {
        typeId: type,
      },
    },
  )

  // TODO: Add conditions if former country is outside EU and if paper application is active
  useEffect(() => {
    console.table(application.externalData.nationalRegistry?.data)
    const address = (application.externalData?.nationalRegistry?.data as {
      address?: Address
    })?.address

    if (data && data.getApplicationsByApplicant.length > 1) {
      setShouldRender(true)
      setContent({
        title: formatText(m.activeApplicationTitle, application, formatMessage),
        description: formatText(
          m.activeApplicationDescription,
          application,
          formatMessage,
        ),
        buttonText: formatText(
          m.activeApplicationButtonText,
          application,
          formatMessage,
        ),
      })
    }
    // if user is not registered in Island, display error modal
    else if (
      !address ||
      (address && !(address.streetAddress && address.postalCode))
    ) {
      setShouldRender(true)
      setContent({
        title: formatText(m.registerYourselfTitle, application, formatMessage),
        description: formatText(
          m.registerYourselfDescription,
          application,
          formatMessage,
        ),
        buttonText: formatText(
          m.registerYourselfButtonText,
          application,
          formatMessage,
        ),
      })
    } else {
      setShouldRender(false)
    }
  }, [data])

  return shouldRender ? (
    <ModalBase
      baseId="healthInsuranceErrorModal"
      initialVisibility={true}
      className={`${styles.dialog} ${styles.background} ${styles.center}`}
    >
      {({ closeModal }) => (
        <Box
          background="white"
          paddingX={[3, 3, 3, 15]}
          paddingY={[7, 7, 7, 12]}
          borderRadius="large"
        >
          <FocusableBox
            component="button"
            onClick={closeModal}
            className={styles.close}
          >
            <Icon icon="close" color="blue400" size="medium" />
          </FocusableBox>
          <Stack space={[5, 5, 5, 7]}>
            <Stack space={2}>
              <Text variant={'h2'}>{content?.title}</Text>
              <Text>{content?.description}</Text>
            </Stack>
            <GridRow align="spaceBetween" className={styles.gridFix}>
              <GridColumn span={['12/12', '12/12', '1/3']}>
                <Button
                  size="default"
                  variant="ghost"
                  colorScheme="destructive"
                  onClick={closeModal}
                  fluid
                >
                  {formatText(
                    m.modalCloseButtonText,
                    application,
                    formatMessage,
                  )}
                </Button>
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '1/3']}>
                <Button size="default" onClick={closeModal} fluid>
                  {content?.buttonText}
                </Button>
              </GridColumn>
            </GridRow>
          </Stack>
        </Box>
      )}
    </ModalBase>
  ) : (
    <Box />
  )
}

export default ErrorModal
