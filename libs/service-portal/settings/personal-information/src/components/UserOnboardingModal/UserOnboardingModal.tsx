import React, { useState } from 'react'
import { toast } from '@island.is/island-ui/core'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import {
  ModalBase,
  GridRow,
  GridColumn,
  GridContainer,
} from '@island.is/island-ui/core'
import { servicePortalCloseOnBoardingModal } from '@island.is/plausible'
import { useLocation } from 'react-router-dom'
import { OnboardingHeader } from './components/Header'
import ProfileForm from '../Forms/ProfileForm/ProfileForm'
import * as styles from './UserOnboardingModal.css'

const UserOnboardingModal: ServicePortalModuleComponent = ({ userInfo }) => {
  const [toggleCloseModal, setToggleCloseModal] = useState(false)
  const [canDropOverlay, setCanDropOverlay] = useState(false)

  const { pathname } = useLocation()

  const dropOnboardingSideEffects = () => {
    toast.info('Notendaupplýsingum er hægt að breyta í stillingum')
    servicePortalCloseOnBoardingModal(pathname)
    // TODO: Save in db date for reminder to finish in 3 months.
  }

  const closeModal = () => {
    setToggleCloseModal(true)
    dropOnboardingSideEffects()
  }

  return (
    <ModalBase
      baseId="user-onboarding-modal"
      toggleClose={toggleCloseModal}
      hideOnClickOutside={false}
      initialVisibility={true}
      className={styles.dialog}
    >
      <GridContainer>
        <GridRow marginBottom={4}>
          <GridColumn span="12/12">
            <OnboardingHeader dropOnboarding={() => setCanDropOverlay(true)} />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span="3/12" />
          <GridColumn span="9/12">
            <ProfileForm
              title={userInfo?.profile?.name || ''}
              onCloseOverlay={closeModal}
              canDrop={canDropOverlay}
            />
          </GridColumn>
        </GridRow>
      </GridContainer>
    </ModalBase>
  )
}

export default UserOnboardingModal
