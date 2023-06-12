import React, { useEffect, useState } from 'react'
import { LoadingScreen } from '../../../components/common/LoadingScreen'
import IdentityResourceCreateForm from '../../../components/Resource/forms/IdentityResourceCreateForm'
import IdentityResourceDTO from '../../../entities/dtos/identity-resource.dto'
import ContentWrapper from '../../../components/Layout/ContentWrapper'
import { useRouter } from 'next/router'
import { ResourcesService } from '../../../services/ResourcesService'
import { IdentityResource } from '../../../entities/models/identity-resource.model'
import IdentityResourceStepNav from '../../../components/Resource/nav/IdentityResourceStepNav'
import { IdentityResourceStep } from '../../../entities/common/IdentityResourcesStep'
import IdentityResourceUserClaimsForm from '../../../components/Resource/forms/IdentityResourceUserClaimsForm'
import StepEnd from '../../../components/common/StepEnd'
import ResourcesTabsNav from '../../../components/Resource/nav/ResourcesTabsNav'
import LocalizationUtils from '../../../utils/localization.utils'

const Index: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { query } = useRouter()
  const stepQuery = query.step
  const resourceId = query.edit
  const [step, setStep] = useState(1)
  const [identityResource, setIdentityResource] = useState<IdentityResource>()
  const router = useRouter()

  /** Load the resource from query if there is one */
  useEffect(() => {
    async function loadResource() {
      if (resourceId) {
        const decoded = decodeURIComponent(resourceId as string)
        await getResource(decoded)
      }
      if (stepQuery) {
        setStep(+stepQuery)
      }
    }
    loadResource()
    setStep(1)
    document.title = LocalizationUtils.getPageTitle(
      'resource.identity-resource.[edit]',
    )
  }, [resourceId])

  const getResource = async (resourceId: string) => {
    const response = await ResourcesService.getIdentityResourceByName(
      resourceId,
    )
    if (response) {
      setIdentityResource(response)
    }
  }

  const changesMade = () => {
    getResource(resourceId as string)
  }

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleStepChange = (step: number) => {
    setStep(step)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleCancel = () => {
    router.push('/resources/identity-resources')
  }

  const handleIdentityResourceSaved = (resourceSaved: IdentityResourceDTO) => {
    if (resourceSaved) {
      getResource(resourceId as string)
      handleNext()
    }
  }

  const refreshClaims = async () => {
    const decode = decodeURIComponent(resourceId as string)
    await getResource(decode)
  }

  if (!identityResource) {
    return (
      <ContentWrapper>
        <ResourcesTabsNav />
        <IdentityResourceStepNav
          activeStep={step}
          handleStepChange={handleStepChange}
        >
          <LoadingScreen />
        </IdentityResourceStepNav>
      </ContentWrapper>
    )
  }

  switch (step) {
    case IdentityResourceStep.IdentityResource: {
      return (
        <ContentWrapper>
          <ResourcesTabsNav />
          <IdentityResourceStepNav
            activeStep={step}
            handleStepChange={handleStepChange}
          >
            <IdentityResourceCreateForm
              identityResource={identityResource}
              handleSave={handleIdentityResourceSaved}
              handleCancel={handleCancel}
            />
          </IdentityResourceStepNav>
        </ContentWrapper>
      )
    }
    case IdentityResourceStep.Claims: {
      return (
        <ContentWrapper>
          <ResourcesTabsNav />
          <IdentityResourceStepNav
            activeStep={step}
            handleStepChange={handleStepChange}
          >
            <IdentityResourceUserClaimsForm
              identityResourceName={identityResource.name}
              handleBack={handleBack}
              handleNext={handleNext}
              claims={identityResource.userClaims?.map((x) => x.claimName)}
              handleChanges={changesMade}
              handleNewClaimsAdded={refreshClaims}
            />
          </IdentityResourceStepNav>
        </ContentWrapper>
      )
    }
    default: {
      return (
        <ContentWrapper>
          <ResourcesTabsNav />
          <IdentityResourceStepNav
            activeStep={step}
            handleStepChange={handleStepChange}
          >
            <StepEnd
              buttonText={
                LocalizationUtils.getPage('resource.identity-resource.[edit]')
                  .endStep.buttonText
              }
              title={
                LocalizationUtils.getPage('resource.identity-resource.[edit]')
                  .endStep.title
              }
              handleButtonFinishedClick={() => setStep(1)}
            >
              {
                LocalizationUtils.getPage('resource.identity-resource.[edit]')
                  .endStep.infoTitle
              }
            </StepEnd>
          </IdentityResourceStepNav>
        </ContentWrapper>
      )
    }
  }
}
export default Index
