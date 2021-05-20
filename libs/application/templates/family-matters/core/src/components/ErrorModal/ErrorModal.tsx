import React, { FC } from 'react'
import {
  Button,
  Box,
  ModalBase,
  Text,
  Stack,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import * as styles from './ErrorModal.treat'

interface ButtonProp {
  label: string
  onClick: () => void
}

interface Props {
  title: string
  ctaButton: ButtonProp
  ariaLabel?: string
}

const ErrorModal: FC<Props> = ({ title, ariaLabel, children, ctaButton }) => {
  return (
    <ModalBase
      baseId="noChildrenFoundModal"
      initialVisibility={true}
      className={styles.dialog}
      modalLabel={ariaLabel || title}
      hideOnClickOutside={false}
    >
      <Box
        background="white"
        paddingX={[3, 3, 3, 15]}
        paddingY={[7, 7, 7, 12]}
        paddingBottom={7}
        borderRadius="large"
      >
        <Stack space={[5, 5, 5, 7]}>
          <Stack space={2}>
            <Text variant="h1" as="h1">
              {title}
            </Text>
            {children}
          </Stack>
          <GridRow align="flexEnd">
            <GridColumn span={['1/1', '1/2', '1/2']}>
              <Button size="default" onClick={ctaButton.onClick} fluid>
                {ctaButton.label}
              </Button>
            </GridColumn>
          </GridRow>
        </Stack>
      </Box>
    </ModalBase>
  )
}

export default ErrorModal
