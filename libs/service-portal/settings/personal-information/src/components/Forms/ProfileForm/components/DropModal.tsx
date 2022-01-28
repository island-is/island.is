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
} from '@island.is/island-ui/core'

interface Props {
  onClose: () => void
  onDrop: () => void
  type: 'tel' | 'mail' | 'all'
}

export const DropModal: FC<Props> = ({ onClose, onDrop, type }) => {
  const [closeModal, setCloseModal] = useState(false)
  const { formatMessage } = useLocale()
  useNamespaces('sp.settings')

  const onCloseSideEffect = () => {
    onClose()
    setCloseModal(true)
  }

  const anyStrings = {
    title: 'Ertu alveg viss um að þú viljir ekki skrá netfang og/eða síma?',
    text: `Ertu viss um þú viljir halda áfram án þess að skrá símanúmer eða
      netfang? Við komum til með að senda á þig staðfestingar og tilkynningar
      og því er gott að vera með rétt númer og netfang skráð`,
  }
  const emailStrings = {
    title: 'Ertu alveg viss um að þú viljir ekki skrá netfang?',
    text: `Ertu viss um þú viljir halda áfram án þess að skrá
      netfang? Við komum til með að senda á þig staðfestingar og tilkynningar
      og því er gott að vera með rétt netfang skráð`,
  }
  const telStrings = {
    title: 'Ertu alveg viss um að þú viljir ekki skrá síma?',
    text: `Ertu viss um þú viljir halda áfram án þess að skrá
      síma? Við komum til með að senda á þig staðfestingar og tilkynningar
      og því er gott að vera með rétt símanúmer skráð`,
  }
  return (
    <Modal
      id="drop-onboarding-modal"
      onCloseModal={onClose}
      toggleClose={closeModal}
    >
      <GridRow align="flexStart" alignItems="flexStart">
        <GridColumn span={['7/8', '5/8']}>
          <Text variant="h4" as="h2" marginBottom={1}>
            {type === 'tel' && telStrings.title}
            {type === 'mail' && emailStrings.title}
            {type === 'all' && anyStrings.title}
          </Text>
          <Text>
            {type === 'tel' && telStrings.text}
            {type === 'mail' && emailStrings.text}
            {type === 'all' && anyStrings.text}
          </Text>
        </GridColumn>
        <GridColumn span={['1/8', '3/8']}>
          {type === 'tel' ? (
            <Hidden below="sm">
              <img
                src="assets/images/retirement.svg"
                alt="Skrautmynd"
                style={{ float: 'right' }}
                width="80%"
              />
            </Hidden>
          ) : (
            <Hidden below="sm">
              <img
                src="assets/images/jobsGrid.svg"
                alt="Skrautmynd"
                width="80%"
                style={{ float: 'right' }}
              />
            </Hidden>
          )}
        </GridColumn>
        <GridColumn span="7/8">
          <Box marginTop={4} display="flex" flexDirection="row">
            <Box paddingRight={2}>
              <Button onClick={onCloseSideEffect} size="small">
                {formatMessage({
                  id: 'sp.settings:register-info-button',
                  defaultMessage: 'Ég vil skrá upplýsingar',
                })}
              </Button>
            </Box>
            <Box>
              <Button onClick={onDrop} variant="ghost" size="small">
                {formatMessage({
                  id: 'sp.settings:register-close-overlay-button',
                  defaultMessage: 'Ég vil halda áfram',
                })}
              </Button>
            </Box>
          </Box>
        </GridColumn>
      </GridRow>
    </Modal>
  )
}
