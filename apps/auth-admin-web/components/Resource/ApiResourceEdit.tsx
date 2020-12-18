import { ApiResourceStep } from './../../entities/common/ApiResourceStep'
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import ApiResourceStepNav from './components/ApiResourceStepper'
import ApiResourceOverview from './overview/ApiResourceOverview'

export default function ApiResourceEdit() {
  const [step, setStep] = useState(1);
  const handleStep = (step: ApiResourceStep) => {
    setStep(step);
  };
  const { query } = useRouter();
  const apiResourceId = query.edit;

  if (apiResourceId) {
    return (
      <div>
        <ApiResourceStepNav
          handleStepChange={handleStep}
          activeStep={step}
        ></ApiResourceStepNav>

        <ApiResourceOverview activeStep={step} apiResourceId={apiResourceId.toString()}></ApiResourceOverview>
      </div>
    );
  } else {
    return <div></div>;
  }
}
