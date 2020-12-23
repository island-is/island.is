import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ContentWrapper from './../../../../components/Layout/ContentWrapper';
import { ApiScope } from './../../../../entities/models/api-scope.model';
import { ApiScopesDTO } from './../../../../entities/dtos/api-scopes-dto';
import { ResourcesService } from './../../../../services/ResourcesService';
import ApiScopeCreateForm from '../../../../components/Resource/forms/ApiScopeCreateForm';
import ApiScopeStepNav from './../../../../components/Resource/ApiScopeStepNav';
import StepEnd from './../../../../components/Common/StepEnd';
import { ApiScopeStep } from './../../../../entities/common/ApiScopeStep';
import ApiScopeUserClaimsForm from '../../../../components/Resource/forms/ApiScopeUserClaimsForm';

export default function Index() {
  const { query } = useRouter();
  const stepQuery = query.step;
  const apiScopeName = query.edit;
  const [step, setStep] = useState(1);
  const [apiScope, setApiScope] = useState<ApiScope>(new ApiScope());
  const router = useRouter();

  /** Load the api Scope and set the step from query if there is one */
  useEffect(() => {
    async function loadResource() {
      if (apiScopeName) {
        await getApiScope(apiScopeName as string);
      }
      if (stepQuery) {
        setStep(+stepQuery);
      }
    }
    loadResource();
    setStep(1);
  }, [apiScopeName]);

  const getApiScope = async (apiScopeName: string) => {
    const response = await ResourcesService.getApiScopeByName(apiScopeName);
    if (response) {
      setApiScope(response);
    }
  };

  const changesMade = () => {
    getApiScope(apiScopeName as string);
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

  const handleApiScopeSaved = (apiScopeSaved: ApiScopesDTO) => {
    if (apiScopeSaved) {
      getApiScope(apiScopeName as string);
    }
  };

  switch (step) {
    case ApiScopeStep.ApiScope: {
      return (
        <ContentWrapper>
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
      );
    }

    case ApiScopeStep.Claims: {
      return (
        <ContentWrapper>
          <ApiScopeStepNav
            activeStep={step}
            handleStepChange={handleStepChange}
          >
            <ApiScopeUserClaimsForm
              apiScopeName={apiScope.name}
              claims={apiScope.userClaims?.map(claim => claim.claimName)}
              handleChanges={changesMade}
              handleNext={handleNext}
              handleBack={handleBack}
            />
          </ApiScopeStepNav>
        </ContentWrapper>
      );
    }

    default: {
      return (
        <ContentWrapper>
          <ApiScopeStepNav
            activeStep={step}
            handleStepChange={handleStepChange}
          >
            <StepEnd
              buttonText="Go back"
              title="Steps completed"
              handleButtonFinishedClick={() => setStep(1)}
            >
              The steps needed, to create the Api Scope, have been completed
            </StepEnd>
          </ApiScopeStepNav>
        </ContentWrapper>
      );
    }
  }
}
