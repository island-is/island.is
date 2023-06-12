import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { LoadingScreen } from '../../../components/common/LoadingScreen'
import ContentWrapper from '../../../components/Layout/ContentWrapper'
import { ApiScope } from '../../../entities/models/api-scope.model'
import { ApiScopeDTO } from '../../../entities/dtos/api-scope-dto'
import { ResourcesService } from '../../../services/ResourcesService'
import ApiScopeCreateForm from '../../../components/Resource/forms/ApiScopeCreateForm'
import ApiScopeStepNav from '../../../components/Resource/nav/ApiScopeStepNav'
import StepEnd from '../../../components/common/StepEnd'
import { ApiScopeStep } from '../../../entities/common/ApiScopeStep'
import ApiScopeUserClaimsForm from '../../../components/Resource/forms/ApiScopeUserClaimsForm'
import ResourcesTabsNav from '../../../components/Resource/nav/ResourcesTabsNav'
import LocalizationUtils from '../../../utils/localization.utils'
import ApiScopeResourceForm from './../../../components/Resource/forms/ApiScopeResourceForm'
import ApiScopePersonalRepresentativePermissionsForm from '../../../components/Resource/forms/ApiScopePersonalRepresentativePermissionsForm'

const Index: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { query } = useRouter()
  const stepQuery = query.step
  const apiScopeName = query.edit
  const [step, setStep] = useState(1)
  const [apiScope, setApiScope] = useState<ApiScope>()
  const router = useRouter()

  /** Load the api Scope and set the step from query if there is one */
  useEffect(() => {
    async function loadResource() {
      if (apiScopeName) {
        const decode = decodeURIComponent(apiScopeName as string)
        await getApiScope(decode)
      }
      if (stepQuery) {
        setStep(+stepQuery)
      }
    }
    loadResource()
    setStep(1)
    document.title = LocalizationUtils.getPageTitle('resource.api-scope.[edit]')
  }, [apiScopeName])

  const getApiScope = async (apiScopeName: string) => {
    const response = await ResourcesService.getApiScopeByName(apiScopeName)
    if (response) {
      setApiScope(response)
    }
  }

  const changesMade = () => {
    getApiScope(apiScopeName as string)
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
    router.push('/resources/api-scopes')
  }

  const handleApiScopeSaved = (apiScopeSaved: ApiScopeDTO) => {
    if (apiScopeSaved) {
      getApiScope(apiScopeName as string)
      handleNext()
    }
  }

  const refreshClaims = async () => {
    const decode = decodeURIComponent(apiScopeName as string)
    await getApiScope(decode)
  }

  if (!apiScope) {
    return (
      <ContentWrapper>
        <ResourcesTabsNav />
        <ApiScopeStepNav activeStep={step} handleStepChange={handleStepChange}>
          <LoadingScreen />
        </ApiScopeStepNav>
      </ContentWrapper>
    )
  }

  switch (step) {
    case ApiScopeStep.ApiScope: {
      return (
        <ContentWrapper>
          <ResourcesTabsNav />
          <ApiScopeStepNav
            activeStep={step}
            handleStepChange={handleStepChange}
          >
            <ApiScopeCreateForm
              apiScope={apiScope}
              handleSave={handleApiScopeSaved}
              handleCancel={handleCancel}
            />
          </ApiScopeStepNav>
        </ContentWrapper>
      )
    }

    case ApiScopeStep.Claims: {
      return (
        <ContentWrapper>
          <ResourcesTabsNav />
          <ApiScopeStepNav
            activeStep={step}
            handleStepChange={handleStepChange}
          >
            <ApiScopeUserClaimsForm
              apiScopeName={apiScope.name}
              claims={apiScope.userClaims?.map((claim) => claim.claimName)}
              handleChanges={changesMade}
              handleNext={handleNext}
              handleBack={handleBack}
              handleNewClaimsAdded={refreshClaims}
            />
          </ApiScopeStepNav>
        </ContentWrapper>
      )
    }

    case ApiScopeStep.ApiResource: {
      return (
        <ContentWrapper>
          <ResourcesTabsNav />
          <ApiScopeStepNav
            activeStep={step}
            handleStepChange={handleStepChange}
          >
            <ApiScopeResourceForm
              apiScope={apiScope}
              handleSave={handleNext}
              handleCancel={handleBack}
            />
          </ApiScopeStepNav>
        </ContentWrapper>
      )
    }

    case ApiScopeStep.PersonalRepresentativePermissions: {
      return (
        <ContentWrapper>
          <ResourcesTabsNav />
          <ApiScopeStepNav
            activeStep={step}
            handleStepChange={handleStepChange}
          >
            <ApiScopePersonalRepresentativePermissionsForm
              apiScopeName={apiScope.name}
              handleNext={handleNext}
              handleBack={handleBack}
            />
          </ApiScopeStepNav>
        </ContentWrapper>
      )
    }

    default: {
      return (
        <ContentWrapper>
          <ResourcesTabsNav />
          <ApiScopeStepNav
            activeStep={step}
            handleStepChange={handleStepChange}
          >
            <StepEnd
              buttonText={
                LocalizationUtils.getPage('resource.api-scope.[edit]').endStep
                  .buttonText
              }
              title={
                LocalizationUtils.getPage('resource.api-scope.[edit]').endStep
                  .title
              }
              handleButtonFinishedClick={() => setStep(1)}
            >
              {
                LocalizationUtils.getPage('resource.api-scope.[edit]').endStep
                  .infoTitle
              }
            </StepEnd>
          </ApiScopeStepNav>
        </ContentWrapper>
      )
    }
  }
}
export default Index
