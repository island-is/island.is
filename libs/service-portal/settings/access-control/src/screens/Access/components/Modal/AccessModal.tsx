import React, { FC, useState } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Modal } from '@island.is/service-portal/core'
import {
  Text,
  Button,
  Box,
  GridColumn,
  GridRow,
  Hidden,
  Tag,
} from '@island.is/island-ui/core'
import {
  IntroHeader,
  m as coreMessages,
  NotFound,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { AuthDelegationScope } from '@island.is/api/schema'

interface Props {
  onClose: () => void
  onCloseButtonText: string
  onSubmit: () => void
  onSubmitButtonText: string
  onSubmitColor: 'blue' | 'red'
  loading?: boolean
  id: string
  title: string
  text: string
  img?: string
  scopes?: AuthDelegationScope[]
}

export const AccessModal: FC<Props> = ({
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
}) => {
  const [closeModal, setCloseModal] = useState(false)
  const { formatMessage } = useLocale()
  useNamespaces('sp.settings')

  const onCloseSideEffect = () => {
    onClose()
    setCloseModal(true)
  }

  return (
    <Modal
      id={`access-modal-${id}`}
      onCloseModal={onClose}
      toggleClose={closeModal}
    >
      <GridRow align="flexStart" alignItems="flexStart">
        <GridColumn span={['7/8', '5/8']}>
          <Text variant="h2" as="h2" marginBottom={1}>
            {title}
          </Text>
          <Text paddingTop={2} paddingBottom={scopes && 3}>
            {text}
          </Text>
          {scopes &&
            scopes.map((scope) => {
              console.log(scope)
              return <Tag>{scope.displayName}</Tag>
            })}
        </GridColumn>
        <GridColumn span={['1/8', '3/8']}>
          <Hidden below="sm">
            <img
              src={
                img ? `assets/images/${img}.svg` : 'assets/images/myInfo.svg'
              }
              alt="Skrautmynd"
              style={{ float: 'right' }}
              width="80%"
            />
          </Hidden>
        </GridColumn>
        {/* <GridColumn span={['7/8', '5/8']}></GridColumn> */}
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
    </Modal>
  )
}
