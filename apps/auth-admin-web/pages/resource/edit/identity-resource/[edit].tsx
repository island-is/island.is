import React, { useEffect, useState } from 'react';
import IdentityResourceCreateForm from '../../../../components/Resource/components/forms/IdentityResourceCreateForm';
import IdentityResourcesDTO from './../../../../entities/dtos/identity-resources.dto';
import ContentWrapper from './../../../../components/Layout/ContentWrapper';
import { useRouter } from 'next/router';
import { ResourcesService } from './../../../../services/ResourcesService';
import { IdentityResource } from './../../../../entities/models/identity-resource.model';
import IdentityResourceStepNav from './../../../../components/Resource/IdentityResourceStepNav';
import { IdentityResourceStep } from './../../../../entities/common/IdentityResourcesStep';
import IdentityResourceUserClaimsForm from './../../../../components/Resource/IdentityResourceUserClaimsForm';

export default function Index() {
  const { query } = useRouter();
  const stepQuery = query.step;
  const resourceId = query.edit;
  const [step, setStep] = useState(1);
  const [identityResource, setIdentityResource] = useState<IdentityResource>(
    new IdentityResource()
  );
  const router = useRouter();

  /** Load the resource from query if there is one */
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
    const response = await ResourcesService.getIdentityResourceByName(
      resourceId
    );
    if (response) {
      console.log("IDS");
      console.log(response);
      setIdentityResource(response);
    }
  };

  const changesMade = () => {
    getResource(resourceId as string);
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleStepChange = (step: number) => {
    console.log("STEP: " + step);
    setStep(step);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleCancel = () => {
    router.back();
  };

  const handleIdentityResourceSaved = (resourceSaved: IdentityResourcesDTO) => {
    if (resourceSaved) {
      getResource(resourceId as string);
    }
  };

  switch (step) {
    case IdentityResourceStep.IdentityResource: {
      return (
        <ContentWrapper>
          <IdentityResourceStepNav activeStep={step} handleStepChange={handleStepChange}>
          <IdentityResourceCreateForm
            identityResource={identityResource}
            handleSave={handleIdentityResourceSaved}
            handleCancel={handleBack}
          />
          </IdentityResourceStepNav>
        </ContentWrapper>
      );
    }
    case IdentityResourceStep.Claims: {
      return (
        <ContentWrapper>
          <IdentityResourceStepNav activeStep={step} handleStepChange={handleStepChange}>
          <IdentityResourceUserClaimsForm identityResourceName={identityResource.name} handleBack={handleBack} handleNext={handleNext} claims={identityResource.userClaims?.map(x => x.claimName)} handleChanges={changesMade} />
          </IdentityResourceStepNav>
        </ContentWrapper>
      );
    }
    default: {
      return <div>Step not found</div>;
    }
  }
}
