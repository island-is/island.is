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

export interface ContentType {
  title?: string
  description?: string
  buttonText?: string
  buttonAction?: () => {}
}

const ErrorModal: FC<FieldBaseProps> = ({ field, application }) => {
  const { formatMessage } = useLocale()
  const { type } = useParams()
  const [shouldRender, setShouldRender] = useState<boolean>()
  let content: ContentType = {}

  const { data, loading, error: applicationsError } = useQuery(
    APPLICANT_APPLICATIONS,
    {
      variables: {
        typeId: type,
      },
    },
  )

  // TODO: Add conditions. if application is active and if not registred in island
  if (data && data.getApplicationsByApplicant.length >= 1) {
    content = {
      title: formatText(
        m.activeApplicationTitle,
        application,
        formatMessage,
      ),
      description: formatText(m.activeApplicationDescription, application, formatMessage),
      buttonText: formatText(m.activeApplicationButtonText, application, formatMessage),
    }
  }

  useEffect(() => {
    if (data && data.getApplicationsByApplicant.length > 1) {
      setShouldRender(true)
      console.table(application.externalData.nationalRegistry?.data)
    } else setShouldRender(false)
  }, [data, content])

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
              <Text variant={'h2'}>{content.title}</Text>
              <Text>{content.description}</Text>
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
                  Close
                </Button>
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '1/3']}>
                <Button size="default" onClick={closeModal} fluid>
                  {content.buttonText}
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
