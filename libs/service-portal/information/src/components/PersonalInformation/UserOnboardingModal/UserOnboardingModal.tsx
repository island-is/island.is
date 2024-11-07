import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  ModalBase,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { servicePortalCloseOnBoardingModal } from '@island.is/plausible'
import { useUserInfo } from '@island.is/react-spa/bff'
import {
  ServicePortalPaths,
  formatPlausiblePathToParams,
  m,
} from '@island.is/service-portal/core'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { onboardingModalStorage } from '../../../utils/showUserOnboardingModal'
import ProfileForm from '../Forms/ProfileForm/ProfileForm'
import * as styles from './UserOnboardingModal.css'
import { OnboardingHeader } from './components/Header'

export const UserOnboardingModal = () => {
  useNamespaces('sp.settings')
  const userInfo = useUserInfo()
  const [toggleCloseModal, setToggleCloseModal] = useState(false)
  const [canDropOverlay, setCanDropOverlay] = useState(false)
  const [formLoading, setFormLoadingState] = useState(false)
  const { formatMessage } = useLocale()
  const { pathname } = useLocation()

  const dropOnboardingSideEffects = () => {
    servicePortalCloseOnBoardingModal(
      formatPlausiblePathToParams(pathname, ServicePortalPaths.Base),
    )
    sessionStorage.setItem(
      onboardingModalStorage.key,
      onboardingModalStorage.value,
    )
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
      modalLabel="Onboarding"
      preventBodyScroll={false}
    >
      <GridContainer>
        <GridRow marginBottom={4}>
          <GridColumn span="12/12">
            <OnboardingHeader
              hideClose={formLoading}
              dropOnboarding={() => setCanDropOverlay(true)}
            />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn
            span={['12/12', '12/12', '12/12', '9/12']}
            offset={['0', '0', '0', '3/12']}
          >
            <ProfileForm
              title={userInfo?.profile?.name || ''}
              onCloseOverlay={closeModal}
              onCloseDropModal={() => setCanDropOverlay(false)}
              canDrop={canDropOverlay}
              setFormLoading={(val: boolean) => setFormLoadingState(val)}
              showIntroTitle
            />
            <GridRow>
              <GridColumn span={['12/12', '12/12', '12/12', '9/12']}>
                <Box
                  display="flex"
                  alignItems="flexEnd"
                  flexDirection="column"
                  paddingTop={2}
                >
                  <Button
                    icon="checkmark"
                    onClick={() => setCanDropOverlay(true)}
                    loading={formLoading}
                  >
                    {formatMessage(m.continue)}
                  </Button>
                </Box>
              </GridColumn>
            </GridRow>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </ModalBase>
  )
}
