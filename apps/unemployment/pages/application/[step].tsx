import { UnemploymentStep } from './../../entities/enums/unemployment-step.enum'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'



        
const Index: React.FC = () => {
    const { query } = useRouter()
    const stepQuery = query.step
    const [step, setStep] = useState(1)
    const router = useRouter()
  
    /** Load the client and set the step from query if there is one */
    useEffect(() => {
      async function loadApplication() {
        const application = await getApplication()
        // TODO: set the application
      }
      loadApplication()
      
      document.title = ""
    }, [step])
  
    const getApplication = async () => {
      // TODO: Load the application from service
    }
  
    const changesMade = () => {
      getApplication(clientId as string)
    }
  
    const handleNext = () => {
      setStep(step + 1)
    }
  
    const handleStepChange = (step: UnemploymentStep) => {
      setStep(step)
    }
  
    const handleBack = () => {
      setStep(step - 1)
    }
  
    const handleCancel = () => {
      router.push('/clients')
    }
  
    const handleSaved = (application: any) => {
        getApplication()
        handleNext()      
    }
  
    switch (step) {
      case UnemploymentStep.PersonalInformation:
        return (

          <ContentWrapper>
            <ClientStepNav handleStepChange={handleStepChange} activeStep={step}>
              <ClientCreateForm
                handleCancel={handleCancel}
                client={client as ClientDTO}
                onNextButtonClick={handleSaved}
              />
            </ClientStepNav>
          </ContentWrapper>
          <
        )
      case ClientStep.ClientRedirectUri: {
        return (
          <ContentWrapper>
            <ClientStepNav handleStepChange={handleStepChange} activeStep={step}>
              <ClientRedirectUriForm
                clientId={client.clientId}
                defaultUrl={client.clientUri}
                uris={client.redirectUris?.map((r) => r.redirectUri)}
                handleNext={handleNext}
                handleBack={handleBack}
                handleChanges={changesMade}
              />
            </ClientStepNav>
          </ContentWrapper>
        )
      }
      case ClientStep.ClientIdpRestrictions: {
        return (
          <ContentWrapper>
            <ClientStepNav handleStepChange={handleStepChange} activeStep={step}>
              <ClientIdpRestrictionsForm
                clientId={client.clientId}
                restrictions={client.identityProviderRestrictions?.map(
                  (r) => r.name,
                )}
                handleNext={handleNext}
                handleBack={handleBack}
                handleChanges={changesMade}
              />
            </ClientStepNav>
          </ContentWrapper>
        )
      }
      case ClientStep.ClientPostLogoutRedirectUri: {
        return (
          <ContentWrapper>
            <ClientStepNav handleStepChange={handleStepChange} activeStep={step}>
              <ClientPostLogoutRedirectUriForm
                clientId={client.clientId}
                defaultUrl={client.clientUri}
                uris={client.postLogoutRedirectUris?.map((p) => p.redirectUri)}
                handleNext={handleNext}
                handleBack={handleBack}
                handleChanges={changesMade}
              />
            </ClientStepNav>
          </ContentWrapper>
        )
      }
      case ClientStep.ClientAllowedCorsOrigin: {
        return (
          <ContentWrapper>
            <ClientStepNav handleStepChange={handleStepChange} activeStep={step}>
              <ClientAllowedCorsOriginsForm
                clientId={client.clientId}
                defaultOrigin={client.clientUri}
                origins={client.allowedCorsOrigins?.map((a) => a.origin)}
                handleNext={handleNext}
                handleBack={handleBack}
                handleChanges={changesMade}
              />
            </ClientStepNav>
          </ContentWrapper>
        )
      }
      case ClientStep.ClientGrantTypes: {
        return (
          <ContentWrapper>
            <ClientStepNav handleStepChange={handleStepChange} activeStep={step}>
              <ClientGrantTypesForm
                clientId={client.clientId}
                grantTypes={client.allowedGrantTypes?.map((a) => a.grantType)}
                handleBack={handleBack}
                handleChanges={changesMade}
                handleNext={handleNext}
              />
            </ClientStepNav>
          </ContentWrapper>
        )
      }
      case ClientStep.ClientAllowedScopes: {
        return (
          <ContentWrapper>
            <ClientStepNav handleStepChange={handleStepChange} activeStep={step}>
              <ClientAllowedScopesForm
                clientId={client.clientId}
                scopes={client.allowedScopes?.map((s) => s.scopeName)}
                handleChanges={changesMade}
                handleNext={handleNext}
                handleBack={handleBack}
              />
            </ClientStepNav>
          </ContentWrapper>
        )
      }
      case ClientStep.ClientClaims: {
        return (
          <ContentWrapper>
            <ClientStepNav handleStepChange={handleStepChange} activeStep={step}>
              <ClientClaimForm
                clientId={client.clientId}
                claims={client.claims}
                handleNext={handleNext}
                handleBack={handleBack}
                handleChanges={changesMade}
              ></ClientClaimForm>
            </ClientStepNav>
          </ContentWrapper>
        )
      }
      case ClientStep.ClientSecret: {
        return (
          <ContentWrapper>
            <ClientStepNav handleStepChange={handleStepChange} activeStep={step}>
              <ClientSecretForm
                secrets={client.clientSecrets}
                clientId={client.clientId}
                clientType={client.clientType}
                handleBack={handleBack}
                handleNext={handleNext}
                handleChanges={changesMade}
              />
            </ClientStepNav>
          </ContentWrapper>
        )
      }
      default: {
        return (
          <ContentWrapper>
            <ClientStepNav handleStepChange={handleStepChange} activeStep={step}>
              <StepEnd
                buttonText={
                  LocalizationUtils.getPage('client.[client]').endStep?.buttonText
                }
                title={
                  LocalizationUtils.getPage('client.[client]').endStep?.title
                }
                handleButtonFinishedClick={() => setStep(1)}
              >
                <p>
                  {
                    LocalizationUtils.getPage('client.[client]').endStep
                      ?.infoTitle
                  }
                </p>
                <p>
                  {
                    LocalizationUtils.getPage('client.[client]').endStep
                      ?.infoDescription
                  }
                </p>
              </StepEnd>
            </ClientStepNav>
          </ContentWrapper>
        )
      }
    }
  }
  
  export default Index