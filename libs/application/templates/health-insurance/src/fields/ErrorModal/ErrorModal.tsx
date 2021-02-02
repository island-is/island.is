import React, { FC, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import { useLocale } from '@island.is/localization'
import Markdown from 'markdown-to-jsx'
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
import { APPLICANT_APPLICATIONS } from '@island.is/application/graphql'
import { Address } from '@island.is/api/schema'
import * as styles from './ErrorModal.treat'
import { m } from '../../forms/messages'
import useModalContent from '../../hooks/useModalContent'

interface ContentType {
  title?: string
  description?: string
  buttonText?: string
  buttonAction?: () => void
}

const ErrorModal: FC<FieldBaseProps> = ({ application }) => {
  const { typeId, externalData } = application

  const { formatMessage } = useLocale()
  const history = useHistory()
  const content = useModalContent(externalData)

  return (
    <ModalBase
      baseId="healthInsuranceErrorModal"
      initialVisibility={true}
      className={`${styles.dialog} ${styles.background} ${styles.center}`}
    >
      {({ closeModal }: { closeModal: () => void }) => (
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
              <Text variant={'h1'}>{
                formatText(
                  content?.title,
                  application,
                  formatMessage,
                )
              }</Text>
              <Text variant={'intro'}>
                <Markdown>{formatText(
                  content?.description,
                  application,
                  formatMessage,
                ) as string}</Markdown>
              </Text>
            </Stack>
            <GridRow align="spaceBetween" className={styles.gridFix}>
              <GridColumn span={['12/12', '12/12', '1/3']}>
                <Button
                  size="default"
                  variant="ghost"
                  colorScheme="destructive"
                  onClick={() => {
                    closeModal()
                    if (content?.buttonAction) content?.buttonAction()
                  }}
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
                <Button
                  size="default"
                  onClick={() => {
                    closeModal()
                    history.push(`../umsoknir/${typeId}`)
                  }}
                  fluid
                >
                  {
                    formatText(
                      content?.buttonText,
                      application,
                      formatMessage,
                    )
                  }
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
