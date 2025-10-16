import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  ModalBase,
  Text,
} from '@island.is/island-ui/core'
import { useState } from 'react'
import * as styles from './GenericRenewModal.css'
import cn from 'classnames'

export interface ModalField {
  title: string
  value: string | string[] | React.ReactNode
}

export interface GenericRenewModalProps<T> {
  item: T
  isVisible: boolean
  setVisible: (visible: boolean) => void
  setActiveItem: (item: T | null) => void
  onSubmit: (item: T) => Promise<void>
  getDataFields: (item: T) => ModalField[]
  modalTitle: string
  modalText: string
  cancelLabel: string
  confirmLabel: string
  toggleClose?: boolean
  errorMessage?: string
  loading?: boolean
}

const GenericRenewModal = <T extends { id?: string }>({
  item,
  isVisible,
  setVisible,
  setActiveItem,
  onSubmit,
  getDataFields,
  modalTitle,
  modalText,
  cancelLabel,
  confirmLabel,
  toggleClose,
  errorMessage,
  loading,
}: GenericRenewModalProps<T>) => {
  const [modalVisible, setModalVisible] = useState<boolean>(isVisible)
  const [formError, setFormError] = useState<string>()
  const columnWidth = '7/12'
  const titleWidth = '5/12'

  const closeModal = () => {
    setModalVisible(false)
    setVisible(false)
    setActiveItem(null)
  }

  const submitForm = async () => {
    if (!item?.id) {
      setFormError(errorMessage || 'An error occurred')
      return
    }

    try {
      await onSubmit(item)
      closeModal()
    } catch {
      setFormError(errorMessage || 'An error occurred')
    }
  }

  const data = getDataFields(item)

  return (
    <ModalBase
      baseId={'genericRenewModal'}
      isVisible={modalVisible}
      initialVisibility={false}
      onVisibilityChange={setModalVisible}
      toggleClose={toggleClose}
      removeOnClose
      className={styles.modal}
    >
      <Box paddingY={[4, 4, 4, 8]} paddingX={[4, 4, 4, 12]}>
        <Box className={styles.closeButton}>
          <Button
            circle
            colorScheme="negative"
            icon="close"
            onClick={closeModal}
            size="large"
          />
        </Box>
        <Box paddingRight={[3, 3, 3, 0]}>
          <Text variant="h3" marginBottom={[2, 2, 2, 5]}>
            {modalTitle}
          </Text>
        </Box>
        <Text marginBottom={3}>{modalText}</Text>

        <Box>
          <GridContainer className={styles.grid}>
            <GridRow>
              {data.map((item, i) => (
                <GridColumn key={i} span={'12/12'}>
                  <GridContainer
                    className={cn(styles.innerGrid, {
                      [styles.blue]: i % 2 === 0,
                    })}
                  >
                    <GridRow>
                      <GridColumn span={titleWidth}>
                        <Box className={styles.titleCol}>
                          <Text fontWeight="semiBold" variant="small" as="span">
                            {item.title}
                          </Text>
                        </Box>
                      </GridColumn>
                      <GridColumn span={columnWidth}>
                        <Box display={'flex'} flexWrap={'wrap'}>
                          <Text variant="small">{item.value}</Text>
                        </Box>
                      </GridColumn>
                    </GridRow>
                  </GridContainer>
                </GridColumn>
              ))}
            </GridRow>
            <GridRow>
              <GridColumn span={'12/12'}>
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="spaceBetween"
                  alignItems="center"
                  marginTop={[1, 1, 1, 5]}
                >
                  <Button size="small" variant="ghost" onClick={closeModal}>
                    {cancelLabel}
                  </Button>
                  <Button
                    size="small"
                    type="submit"
                    onClick={submitForm}
                    disabled={loading}
                    loading={loading}
                  >
                    {confirmLabel}
                  </Button>
                </Box>
              </GridColumn>
              {formError && (
                <GridColumn>
                  <Box>
                    <Text color="red600">{formError}</Text>
                  </Box>
                </GridColumn>
              )}
            </GridRow>
          </GridContainer>
        </Box>
      </Box>
    </ModalBase>
  )
}

export default GenericRenewModal
