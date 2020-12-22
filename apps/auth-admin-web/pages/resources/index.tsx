import React, { useState } from 'react';
import ResourceStepNav from '../../components/Resource/components/ResourceStepper';
import Overview from '../../components/Resource/components/Overview';
import { ResourceStep } from './../../entities/common/ResourceStep';
import ContentWrapper from './../../components/Layout/ContentWrapper'

export default function Index() {
  const [step, setStep] = useState(1);

  const handleStep = (step: ResourceStep) => {
    setStep(step);
  };

  return (
    <ContentWrapper>
      <div>
        <ResourceStepNav
          handleStepChange={handleStep}
          activeStep={step}
        ></ResourceStepNav>

        <Overview activeStep={step}></Overview>
      </div>
    </ContentWrapper>
  );
}
