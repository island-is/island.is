import ResourceStepNav from '../../components/Resource/components/ResourceStepper';
import Overview from '../../components/Resource/components/Overview';
import { ResourceStep } from 'apps/auth-admin-web/models/common/ResourceStep';
import { useState } from 'react';

export default function Index() {
  const [step, setStep] = useState(1);

  const handleStep = (step: ResourceStep) => {
    setStep(step);
  };

  return (
    <div>
      <ResourceStepNav
        handleStepChange={handleStep}
        activeStep={step}
      ></ResourceStepNav>

      <Overview activeStep={step}></Overview>
    </div>
  );
}
