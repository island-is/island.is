import React, { useEffect, useState } from 'react';
import ContentWrapper from './../../../../components/Layout/ContentWrapper';
import { useRouter } from 'next/router';
import { ApiResource } from './../../../../entities/models/api-resource.model';
import { ResourcesService } from './../../../../services/ResourcesService';
import ApiResourceCreateForm from '../../../../components/Resource/forms/ApiResourceCreateForm';
import { ApiResourcesDTO } from './../../../../entities/dtos/api-resources-dto';
import ApiResourceStepNav from './../../../../components/Resource/ApiResourceStepNav';
import { ApiResourceStep } from './../../../../entities/common/ApiResourceStep';
import StepEnd from './../../../../components/Common/StepEnd';
import ApiResourceSecretForm from './../../../../components/Resource/forms/ApiResourceSecretForm';
import ApiResourceScopeForm from './../../../../components/Resource/forms/ApiResourceScopeForm';
import ApiResourceUserClaimForm from './../../../../components/Resource/forms/ApiResourceUserClaimForm';

export default function Index() {
  const { query } = useRouter();
  const stepQuery = query.step;
  const resourceId = query.edit;
  const [step, setStep] = useState(1);
  const [apiResource, setApiResource] = useState<ApiResource>(
    new ApiResource()
  );
  const router = useRouter();

  /** Load the api resource and set the step from query if there is one */
  useEffect(() => {
    async function loadResource() {
      if (resourceId) {
        await getResource(resourceId as string);
      }
      if (stepQuery) {
        setStep(+stepQuery);
      }
    }
    loadResource();
    setStep(1);
  }, [resourceId]);

  const getResource = async (resourceId: string) => {
    const response = await ResourcesService.getApiResourceByName(resourceId);
    if (response) {
      console.log(response);
      setApiResource(response);
    }
  };

  const changesMade = () => {
    getResource(resourceId as string);
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleStepChange = (step: number) => {
    setStep(step);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleCancel = () => {
    router.back();
  };

  const handleApiResourceSaved = (resourceSaved: ApiResourcesDTO) => {
    if (resourceSaved) {
      getResource(resourceId as string);
      handleNext();
    }
  };

  switch (step) {
    case ApiResourceStep.ApiResourceBasics: {
      return (
        <ContentWrapper>
          <ApiResourceStepNav
            activeStep={step}
            handleStepChange={handleStepChange}
          >
            <ApiResourceCreateForm
              apiResource={apiResource}
              handleSave={handleApiResourceSaved}
              handleCancel={handleBack}
            />
          </ApiResourceStepNav>
        </ContentWrapper>
      );
    }
    case ApiResourceStep.ApiResourceScopes: {
      return (
        <ContentWrapper>
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
      );
    }
    case ApiResourceStep.ApiResourceSecrets: {
      return (
        <ContentWrapper>
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
      );
    }
    case ApiResourceStep.ApiResourceUserClaims: {
      return (
        <ContentWrapper>
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
            ></ApiResourceUserClaimForm>
          </ApiResourceStepNav>
        </ContentWrapper>
      );
    }

    default: {
      return (
        <ContentWrapper>
          <ApiResourceStepNav
            activeStep={step}
            handleStepChange={handleStepChange}
          >
            <StepEnd
              buttonText="Go back"
              title="Steps completed"
              handleButtonFinishedClick={() => setStep(1)}
            >
              The steps needed, to create the Api resource, have been completed
            </StepEnd>
          </ApiResourceStepNav>
        </ContentWrapper>
      );
    }
  }
}
