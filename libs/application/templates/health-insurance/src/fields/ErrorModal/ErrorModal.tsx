import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import { useLocale } from '@island.is/localization'
import Markdown from 'markdown-to-jsx'
import {
  Button,
  Box,
  ModalBase,
  Text,
  Stack,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import {
  FieldBaseProps,
  formatText,
  FormText,
} from '@island.is/application/core'
import * as styles from './ErrorModal.treat'
import { m } from '../../forms/messages'
import useModalContent from '../../hooks/useModalContent'

const ErrorModal: FC<FieldBaseProps> = ({ application }) => {
  const { typeId, externalData } = application

  const { formatMessage, lang } = useLocale()
  const history = useHistory()
  const content = useModalContent(externalData)

  return (
    <ModalBase
      baseId="healthInsuranceErrorModal"
      initialVisibility={true}
      className={`${styles.dialog} ${styles.background} ${styles.center}`}
      hideOnClickOutside={false}
    >
      {({ closeModal }: { closeModal: () => void }) => (
        <Box
          background="white"
          paddingX={[3, 3, 3, 15]}
          paddingY={[7, 7, 7, 12]}
          borderRadius="large"
        >
          <Stack space={[5, 5, 5, 7]}>
            <Stack space={2}>
              <Text variant={'h1'}>
                {formatText(
                  content?.title as FormText,
                  application,
                  formatMessage,
                )}
              </Text>
              <Text variant={'intro'}>
                <Markdown>
                  {
                    formatText(
                      content?.description as FormText,
                      application,
                      formatMessage,
                    ) as string
                  }
                </Markdown>
              </Text>
            </Stack>
            <GridRow align="spaceBetween" className={styles.gridFix}>
              <GridColumn span={['12/12', '12/12', '1/3']} paddingTop={[2, 0]}>
                <Button
                  size="default"
                  variant="ghost"
                  colorScheme="destructive"
                  onClick={() => {
                    closeModal()
                    history.push(
                      lang === 'is'
                        ? '../umsokn-um-sjukratryggingu'
                        : '../en/apply-for-health-insurance',
                    )
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
                    content?.buttonAction()
                  }}
                  fluid
                >
                  {formatText(
                    content?.buttonText as FormText,
                    application,
                    formatMessage,
                  )}
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
