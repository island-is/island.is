import React, { FC } from 'react'
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
import * as styles from './ErrorModal.treat'
import { isValidCountry } from '../healthInsuranceUtils'

export interface ContentType {
  title?: string
  description?: string
  buttonText?: string
  buttonAction?: () => {}
}

const ErrorModal: FC<FieldBaseProps> = ({ field, application }) => {
  const previousCountry = (application.externalData.nationalRegistry?.data as {
    previousCountry?: string
  })?.previousCountry
  let content: ContentType = {}
  // TODO: Add conditions. if application is active and if not registred in island
  if (previousCountry && !isValidCountry(previousCountry)) {
    content = {
      title: 'Waiting period',
      description:
        'According to Registers Iceland data it seems like you are not moving to Iceland from an EU/EEA country, Switzerland, Greenland or the Faroe Islands. There is a six-month waiting period before qualifying. We advise you to buy private health insurance until you are covered by the national health insurance. There are some Medical exceptions.',
      buttonText: 'Read more',
    }
  } else {
    content = {
      title: 'Active application',
      description:
        'You have already submitted an application for health insurance. We will notify you on the e-mail address you provided in the application when the status changes. You can always see your application status in My Pages.',
      buttonText: 'See status',
    }
  }

  return (
    <ModalBase
      baseId="healthInsuranceErrorModal"
      initialVisibility={true}
      className={`${styles.dialog} ${styles.background}`}
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
            <GridRow align="spaceBetween">
              <GridColumn span={['12/12', '12/12', '1/3']}>
                <Button
                  size="default"
                  variant="ghost"
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
  )
}

export default ErrorModal
