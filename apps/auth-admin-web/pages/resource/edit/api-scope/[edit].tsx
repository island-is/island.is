import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ContentWrapper from './../../../../components/Layout/ContentWrapper';
import ApiScopeEdit from './../../../../components/Resource/ApiScopeEdit';
import { ApiScope } from './../../../../entities/models/api-scope.model';
import { ApiScopesDTO } from './../../../../entities/dtos/api-scopes-dto';
import { ResourcesService } from './../../../../services/ResourcesService';
import ApiScopeCreateForm from './../../../../components/Resource/components/forms/ApiScopeCreateForm';

export default function Index() {
  const { query } = useRouter();
  const stepQuery = query.step;
  const apiScopeName = query.edit;
  const [step, setStep] = useState(1);
  const [apiScope, setApiScope] = useState<ApiScope>(
    new ApiScope()
  );
  const router = useRouter();

  /** Load the client and set the step from query if there is one */
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
    case 1: {
      return (
        <ContentWrapper>
          <ApiScopeCreateForm apiScope={apiScope} handleSave={handleApiScopeSaved} handleCancel={handleBack} />
        </ContentWrapper>
      );
    }
    default: {
      return <div>Step not found</div>;
    }
  }
}
