import React, { useState } from 'react';
import ResourcesTabsNav from '../../components/Resource/ResourcesTabsNav';
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
        <ResourcesTabsNav
          handleStepChange={handleStep}
          activeStep={step}
        ></ResourcesTabsNav>

        <Overview activeTab={step}></Overview>
      </div>
    </ContentWrapper>
  );
}
