import React, { FC, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import {
  Box,
  GridRow,
  GridColumn,
  GridContainer,
  Button,
  Checkbox,
} from '@island.is/island-ui/core'
import {
  useCreateUserProfile,
  useUpdateUserProfile,
  useUserProfile,
} from '@island.is/service-portal/graphql'
import { Locale } from '@island.is/shared/types'
import { parseNumber } from '../../../utils/phoneHelper'
import { servicePortalSubmitOnBoardingModal } from '@island.is/plausible'
import { OnboardingIntro } from './components/Intro'
import { InputSection } from './components/InputSection'
import { InputEmail } from './components/Inputs/Email'
import { InputPhone } from './components/Inputs/Phone'
import { DropModal } from './components/DropModal'
import { LanguageForm, LanguageFormOption } from '../LanguageForm'
import { BankInfoForm } from '../BankInfoForm'
import * as styles from './ProfileForm.css'

interface Props {
  onCloseOverlay?: () => void
  canDrop?: boolean
  title: string
  showDetails?: boolean
}

export const ProfileForm: FC<Props> = ({
  onCloseOverlay,
  canDrop,
  title,
  showDetails,
}) => {
  const [tel, setTel] = useState('')
  const [email, setEmail] = useState('')
  const [nudge, setNudge] = useState(false)
  const [language, setLanguage] = useState<LanguageFormOption | null>(null)
  const [bankInfo, setBankInfo] = useState('')

  const [telDirty, setTelDirty] = useState(true)
  const [emailDirty, setEmailDirty] = useState(true)

  const [showDropModal, setShowDropModal] = useState<
    'tel' | 'mail' | 'all' | undefined
  >()

  const { formatMessage } = useLocale()

  const { data: userProfile } = useUserProfile()

  useEffect(() => {
    if (userProfile) {
      if (userProfile.mobilePhoneNumber) {
        const parsedNumber = parseNumber(userProfile.mobilePhoneNumber)
        setTel(parsedNumber)
        setTelDirty(false)
      }
      if (userProfile.email) {
        setEmail(userProfile.email)
        setEmailDirty(false)
      }
      if (userProfile.locale) {
        setLanguage({
          value: userProfile.locale as Locale,
          label: userProfile.locale === 'is' ? 'Íslenska' : 'English',
        })
      }
      if (userProfile.canNudge) {
        setNudge(true)
      }
      if (userProfile.bankInfo) {
        setBankInfo(userProfile.bankInfo)
      }
    }
  }, [userProfile])

  useEffect(() => {
    if (canDrop && onCloseOverlay) {
      const showAll = !email && !tel && 'all'
      const showEmail = !email && 'mail'
      const showTel = !tel && 'tel'
      const showDropModal = showAll || showEmail || showTel || undefined
      if (showDropModal) {
        setShowDropModal(showDropModal)
      } else {
        onCloseOverlay()
      }
    }
  }, [canDrop])

  const { createUserProfile } = useCreateUserProfile()
  const { updateUserProfile } = useUpdateUserProfile()

  const { pathname } = useLocation()

  const submitFormData = async (email: string, mobilePhoneNumber: string) => {
    try {
      /**
       * TODO:
       * - createIslykillSettings + updateIslykillSettings in islykill.service.ts...
       * ..should check if email + phone is verified before saving in islykill db
       * - BankInfo Validation.
       * - Setja form utan um allt. Nested react-form-hook. nota trigger validation í email og síma: https://codesandbox.io/s/react-hook-form-trigger-validation-utih0?file=/src/index.js
       * - Fix hardcoded strings.
       * - Country code mobile input
       * - Input styling
       * - Cleanup
       */
      if (userProfile) {
        await updateUserProfile({
          email,
          mobilePhoneNumber: `+354-${mobilePhoneNumber}`,
          locale: language?.value,
          canNudge: nudge,
        })
      } else {
        await createUserProfile({
          email,
          mobilePhoneNumber: `+354-${mobilePhoneNumber}`,
          locale: language?.value,
        })
      }
      if (pathname) {
        servicePortalSubmitOnBoardingModal(pathname)
      }
    } catch (err) {
      toast.error(
        'Eitthvað fór úrskeiðis, ekki tókst að uppfæra notendaupplýsingar þínar',
      )
    }
  }

  const handleFormSubmit = () => {
    submitFormData(email, tel)
  }

  return (
    <GridContainer>
      <GridRow marginBottom={10}>
        <GridColumn span={['12/12', '7/12']}>
          <OnboardingIntro name={title || ''} />
          {showDetails && (
            <InputSection
              title={formatMessage(m.language)}
              text="Hér getur þú gert breytingar á því tungumáli sem þú vilt nota í kerfum island.is"
            >
              <LanguageForm
                language={language}
                onValueChange={(val) => setLanguage(val.language)}
              />
            </InputSection>
          )}
          <InputSection
            title={formatMessage(m.email)}
            text="Vinsamlegt settu inn nefangið þitt. Við komum til með að senda á þig staðfestingar og tilkynningar."
          >
            <InputEmail
              onCallback={(emailAddr) => setEmail(emailAddr)}
              emailDirty={(isDirty) => setEmailDirty(isDirty)}
              buttonText={formatMessage({
                id: 'sp.settings:save-email',
                defaultMessage: 'Vista netfang',
              })}
              email={email}
            />
          </InputSection>
          <InputSection
            title={formatMessage(m.telNumber)}
            text="Við komum til með að senda á þig staðfestinar og tilkynningar og því er gott að vera með rétt númer skráð. Endilega skráðu númerið þitt hér fyrir neðan og við sendum þér öryggiskóða til staðfestingar."
          >
            <InputPhone
              onCallback={(mobile) => setTel(mobile)}
              telDirty={(isDirty) => setTelDirty(isDirty)}
              buttonText={formatMessage({
                id: 'sp.settings:save-tel',
                defaultMessage: 'Vista símanúmer',
              })}
              mobile={tel}
            />
          </InputSection>
          {showDetails && (
            <InputSection
              title={formatMessage(m.bankAccountInfo)}
              text={formatMessage({
                id: 'sp.settings:edit-bankInfo-description',
                defaultMessage: `
                  Hér getur þú gert breytingar á þeim bankareikningi
                  sem þú vilt nota í kerfum island.is.
                `,
              })}
            >
              <BankInfoForm bankInfo={bankInfo} />
            </InputSection>
          )}
          {showDetails && (
            <InputSection
              title={formatMessage(m.nudge)}
              text={formatMessage({
                id: 'sp.settings:edit-nudge-description',
                defaultMessage: `
                    Hér getur þú gert breytingar á hnipp möguleikum. 
                    Hnipp stillingar segja til um hvort þú viljir að Island.is láti 
                    þig vita þegar eitthvað markvert gerist.
                  `,
              })}
            >
              <Checkbox
                label={formatMessage({
                  id: 'sp.settings:nudge-checkbox-label',
                  defaultMessage: 'Virkja hnipp',
                })}
                onChange={(e) => setNudge(e.target.checked)}
                name="can-nudge"
                checked={nudge}
              />
            </InputSection>
          )}
          <Box
            paddingTop={4}
            display="flex"
            alignItems="flexEnd"
            flexDirection="column"
          >
            <Button
              icon="checkmark"
              disabled={emailDirty || telDirty || (!tel && !email)}
              onClick={handleFormSubmit}
            >
              {formatMessage(m.saveInfo)}
            </Button>
          </Box>
        </GridColumn>
        <GridColumn className={styles.endGrid} span={['12/12', '5/12']}>
          <img
            src="assets/images/digitalServices.svg"
            width="80%"
            alt="Skrautmynd"
          />
          {showDropModal && onCloseOverlay && (
            <DropModal
              type={showDropModal}
              onDrop={onCloseOverlay}
              onClose={() => setShowDropModal(undefined)}
              close={false}
            />
          )}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default ProfileForm
