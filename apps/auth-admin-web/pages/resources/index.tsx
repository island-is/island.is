import React, { useState } from 'react';
import ResourceTabsNav from '../../components/Resource/components/ResourceTabsNav';
import Overview from '../../components/Resource/components/Overview';
import { ResourceTabs } from '../../entities/common/ResourceTabs';
import ContentWrapper from './../../components/Layout/ContentWrapper'

export default function Index() {
  const [step, setStep] = useState(1);

  const handleStep = (step: ResourceTabs) => {
    setStep(step);
  };

  return (
    <ContentWrapper>
      <div>
        <ResourceTabsNav
          handleStepChange={handleStep}
          activeStep={step}
        ></ResourceTabsNav>

        <Overview activeStep={step}></Overview>
      </div>
    </ContentWrapper>
  );
}
