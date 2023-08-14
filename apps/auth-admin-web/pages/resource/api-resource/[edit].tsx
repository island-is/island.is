import React, { useEffect, useState } from 'react'
import { LoadingScreen } from '../../../components/common/LoadingScreen'
import ContentWrapper from '../../../components/Layout/ContentWrapper'
import { useRouter } from 'next/router'
import { ApiResource } from '../../../entities/models/api-resource.model'
import { ResourcesService } from '../../../services/ResourcesService'
import ApiResourceCreateForm from '../../../components/Resource/forms/ApiResourceCreateForm'
import { ApiResourcesDTO } from '../../../entities/dtos/api-resources-dto'
import ApiResourceStepNav from '../../../components/Resource/nav/ApiResourceStepNav'
import { ApiResourceStep } from '../../../entities/common/ApiResourceStep'
import StepEnd from '../../../components/common/StepEnd'
import ApiResourceSecretForm from '../../../components/Resource/forms/ApiResourceSecretForm'
import ApiResourceScopeForm from '../../../components/Resource/forms/ApiResourceScopeForm'
import ApiResourceUserClaimForm from '../../../components/Resource/forms/ApiResourceUserClaimsForm'
import ResourcesTabsNav from '../../../components/Resource/nav/ResourcesTabsNav'
import LocalizationUtils from '../../../utils/localization.utils'

const Index: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { query } = useRouter()
  const stepQuery = query.step
  const resourceId = query.edit
  const [step, setStep] = useState(1)
  const [apiResource, setApiResource] = useState<ApiResource>()
  const router = useRouter()

  /** Load the api resource and set the step from query if there is one */
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
      'resource.api-resource.[edit]',
    )
  }, [resourceId])

  const getResource = async (resourceId: string) => {
    const response = await ResourcesService.getApiResourceByName(resourceId)
    if (response) {
      setApiResource(response)
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
    router.push('/resources/api-resources')
  }

  const handleApiResourceSaved = (resourceSaved: ApiResourcesDTO) => {
    if (resourceSaved) {
      getResource(resourceId as string)
      handleNext()
    }
  }

  const refreshClaims = async () => {
    const decode = decodeURIComponent(resourceId as string)
    await getResource(decode)
  }

  if (!apiResource) {
    return (
      <ContentWrapper>
        <ResourcesTabsNav />
        <ApiResourceStepNav
          activeStep={step}
          handleStepChange={handleStepChange}
        >
          <LoadingScreen />
        </ApiResourceStepNav>
      </ContentWrapper>
    )
  }

  switch (step) {
    case ApiResourceStep.ApiResourceBasics: {
      return (
        <ContentWrapper>
          <ResourcesTabsNav />
          <ApiResourceStepNav
            activeStep={step}
            handleStepChange={handleStepChange}
          >
            <ApiResourceCreateForm
              apiResource={apiResource}
              handleSave={handleApiResourceSaved}
              handleCancel={handleCancel}
            />
          </ApiResourceStepNav>
        </ContentWrapper>
      )
    }
    case ApiResourceStep.ApiResourceScopes: {
      return (
        <ContentWrapper>
          <ResourcesTabsNav />
          <ApiResourceStepNav
            activeStep={step}
            handleStepChange={handleStepChange}
          >
            <ApiResourceScopeForm
              apiResourceName={apiResource.name}
              scopes={apiResource.scopes?.map((x) => x.scopeName)}
              handleChanges={changesMade}
              handleNext={handleNext}
              handleBack={handleBack}
            ></ApiResourceScopeForm>
          </ApiResourceStepNav>
        </ContentWrapper>
      )
    }
    case ApiResourceStep.ApiResourceSecrets: {
      return (
        <ContentWrapper>
          <ResourcesTabsNav />
          <ApiResourceStepNav
            activeStep={step}
            handleStepChange={handleStepChange}
          >
            <ApiResourceSecretForm
              apiResourceName={apiResource.name}
              secrets={apiResource.apiSecrets ?? []}
              handleChanges={changesMade}
              handleNext={handleNext}
              handleBack={handleBack}
            />
          </ApiResourceStepNav>
        </ContentWrapper>
      )
    }
    case ApiResourceStep.ApiResourceUserClaims: {
      return (
        <ContentWrapper>
          <ResourcesTabsNav />
          <ApiResourceStepNav
            activeStep={step}
            handleStepChange={handleStepChange}
          >
            <ApiResourceUserClaimForm
              apiResourceName={apiResource.name}
              claims={apiResource.userClaims?.map((x) => x.claimName)}
              handleChanges={changesMade}
              handleNext={handleNext}
              handleBack={handleBack}
              handleNewClaimsAdded={refreshClaims}
            ></ApiResourceUserClaimForm>
          </ApiResourceStepNav>
        </ContentWrapper>
      )
    }

    default: {
      return (
        <ContentWrapper>
          <ResourcesTabsNav />
          <ApiResourceStepNav
            activeStep={step}
            handleStepChange={handleStepChange}
          >
            <StepEnd
              buttonText={
                LocalizationUtils.getPage('resource.api-resource.[edit]')
                  .endStep.buttonText
              }
              title={
                LocalizationUtils.getPage('resource.api-resource.[edit]')
                  .endStep.title
              }
              handleButtonFinishedClick={() => setStep(1)}
            >
              {
                LocalizationUtils.getPage('resource.api-resource.[edit]')
                  .endStep.infoTitle
              }
            </StepEnd>
          </ApiResourceStepNav>
        </ContentWrapper>
      )
    }
  }
}
export default Index
