import React, { FC } from 'react'
import {
  Text,
  Button,
  Box,
  GridColumn,
  GridRow,
  Hidden,
  Tag,
  ModalBase,
} from '@island.is/island-ui/core'
import * as styles from './AccessModal.css'
interface Props {
  onClose: () => void
  onCloseButtonText: string
  onSubmit: () => void
  onSubmitButtonText: string
  onSubmitColor: 'blue' | 'red'
  loading?: boolean
  id: string
  title: string
  text?: string
  img?: string
  scopes?: { displayName?: string; validTo?: string }[]
  isVisible?: boolean
}

const AccessModal: FC<Props> = ({
  onClose,
  onSubmit,
  onCloseButtonText,
  onSubmitColor = 'blue',
  onSubmitButtonText,
  id,
  title,
  text,
  img,
  scopes,
  loading,
  isVisible,
}) => {
  const handleOnVisibilityChange = (isVisible: boolean) => {
    !isVisible && onClose && onClose()
  }

  return (
    <ModalBase
      baseId={`access-modal-${id}`}
      initialVisibility={false}
      isVisible={isVisible}
      className={styles.modal}
      onVisibilityChange={handleOnVisibilityChange}
    >
      {({ closeModal }: { closeModal: () => void }) => (
        <Box background="white" paddingY={[3, 6, 12]} paddingX={[3, 6, 12, 15]}>
          <Box className={styles.closeButton}>
            <Button
              circle
              colorScheme="negative"
              icon="close"
              onClick={() => {
                closeModal()
              }}
              size="large"
            />
          </Box>
          <GridRow align="flexStart" alignItems="flexStart">
            <GridColumn span={['7/8', '5/8']}>
              <Text variant="h2" as="h2" marginBottom={1}>
                {title}
              </Text>
              {text && (
                <Text paddingTop={2} paddingBottom={scopes && 3}>
                  {text}
                </Text>
              )}
              {scopes && (
                <Box display="flex" flexDirection="row" flexWrap="wrap">
                  {scopes.map((scope) => {
                    return scope?.displayName ? (
                      <Box
                        paddingRight={2}
                        paddingY={1}
                        key={scope?.displayName}
                      >
                        <Tag>{scope.displayName}</Tag>
                      </Box>
                    ) : null
                  })}
                </Box>
              )}
            </GridColumn>
            <GridColumn span={['1/8', '3/8']}>
              <Hidden below="sm">
                <img
                  src={
                    img
                      ? `assets/images/${img}.svg`
                      : 'assets/images/myInfo.svg'
                  }
                  alt=""
                  style={{ float: 'right' }}
                  width="80%"
                />
              </Hidden>
            </GridColumn>
            <GridColumn span="7/8">
              <Box marginTop={4} display="flex" flexDirection="row">
                <Box paddingRight={2}>
                  <Button
                    onClick={onSubmit}
                    size="small"
                    variant="primary"
                    colorScheme={
                      onSubmitColor === 'red' ? 'destructive' : 'default'
                    }
                  >
                    {onSubmitButtonText}
                  </Button>
                </Box>
                <Box>
                  <Button
                    loading={loading}
                    onClick={onClose}
                    variant="ghost"
                    size="small"
                  >
                    {onCloseButtonText}
                  </Button>
                </Box>
              </Box>
            </GridColumn>
          </GridRow>
        </Box>
      )}
    </ModalBase>
  )
}

export default AccessModal
