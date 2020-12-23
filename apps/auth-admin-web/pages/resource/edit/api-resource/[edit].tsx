import React, { useEffect, useState } from 'react';
import ContentWrapper from './../../../../components/Layout/ContentWrapper';
import { useRouter } from 'next/router';
import { ApiResource } from './../../../../entities/models/api-resource.model';
import { ResourcesService } from './../../../../services/ResourcesService';
import ApiResourceCreateForm from './../../../../components/Resource/components/forms/ApiResourceCreateForm';
import { ApiResourcesDTO } from './../../../../entities/dtos/api-resources-dto';
import ApiResourceStepNav from './../../../../components/Resource/ApiResourceStepNav';

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
    }
  };

  switch (step) {
    case 1: {
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
    default: {
      return <div>Step not found</div>;
    }
  }
}
