import React, { useState } from 'react';
import ResourcesTabsNav from '../../components/Resource/nav/ResourcesTabsNav';
import ResourcesTabsOverview from '../../components/Resource/nav/ResourcesTabsOverview';
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

        <ResourcesTabsOverview activeTab={step}></ResourcesTabsOverview>
      </div>
    </ContentWrapper>
  );
}
