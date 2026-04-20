import { useState } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  formatPlausiblePathToParams,
  ServicePortalPaths,
} from '@island.is/portals/my-pages/core'
import {
  ModalBase,
  GridRow,
  GridColumn,
  GridContainer,
  Button,
  Box,
} from '@island.is/island-ui/core'
import { m } from '@island.is/portals/my-pages/core'
import { servicePortalCloseOnBoardingModal } from '@island.is/plausible'
import { useLocation } from 'react-router-dom'
import { OnboardingHeader } from './components/Header'
import ProfileForm from '../Forms/ProfileForm/ProfileForm'
import * as styles from './UserOnboardingModal.css'
import { onboardingModalStorage } from '../../../utils/showUserOnboardingModal'
import { useUserInfo } from '@island.is/react-spa/bff'

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
              isOnboardingModal
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
