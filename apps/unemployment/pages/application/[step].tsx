import { UnemploymentStep } from './../../entities/enums/unemployment-step.enum'
import { useRouter } from 'next/router'
import React, { useState, useEffect, useContext } from 'react'
import PersonalInformationForm from '../../components/forms/personal-information.form'
import { UserContext } from './../../components/util/UserProvider'
import { ApplicationService } from './../../services/application.service'
import { ApplicationData } from './../../entities/application-data'
import { UserService } from './../../services/user.service'
import ChildrenUnderCare from '../../components/forms/children-under-care'
import EndOfEmploymentForm from './../../components/forms/end-of-employment.form'
import { stepState } from "../../utils/state";
import { useRecoilState } from "recoil";
import { assign, cloneDeep } from 'lodash'
import Calculations from './../../components/windows/calculations'
import ApplicationReceived from './../../components/windows/application-received'

const Index: React.FC = () => {
  const { query } = useRouter()
  const stepQuery = parseInt(query.step as string)
  const [step, setStep] = useState(1)
  const { user } = useContext(UserContext)
  const [applicationData, setApplicationData] = useState<ApplicationData>()
  const [, setSteps] = useRecoilState(stepState);

  /** Load the client and set the step from query if there is one */
  useEffect(() => {
  

    let application = ApplicationService.getApplication()
    if (!application) {
      application = ApplicationData.getFromUser(UserService.getUser())
    }
    setApplicationData(application)
    document.title = 'Samskipti'

    if (step !== stepQuery) {
      setStep(stepQuery)
    }
  }, [stepQuery, user])

  const handleNext = () => {
    setStep(step + 1)
    setSteps(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
    setSteps(step - 1)
  }

  const handleSaved = (application: any) => {
    setApplicationData(cloneDeep(assign(applicationData, application)))
    handleNext()
  }
  if (applicationData) {
    
    switch (step) {
      case UnemploymentStep.PersonalInformation:
        return (
          <PersonalInformationForm
            onBack={handleBack}
            defaultValues={applicationData}
            onSubmit={handleSaved}
          ></PersonalInformationForm>
        )
        case UnemploymentStep.EndOfEmployment:
          return (
            <EndOfEmploymentForm
              onBack={handleBack}
              defaultValues={applicationData}
              onSubmit={handleSaved}
            ></EndOfEmploymentForm>
          )
      case UnemploymentStep.ChildrenUnderCare:
        return (
          <ChildrenUnderCare
            onBack={handleBack}
            defaultValues={applicationData}
            onSubmit={handleSaved}
          />
        )
      case UnemploymentStep.Calculation:
        return <Calculations defaultValues={applicationData} onSubmit={handleSaved}></Calculations>
      case UnemploymentStep.ApplicationSent:
        return <ApplicationReceived defaultValues={applicationData}></ApplicationReceived>
      default: {
        return (
          <PersonalInformationForm
            onBack={handleBack}
            defaultValues={applicationData}
            onSubmit={handleSaved}
          ></PersonalInformationForm>
        )
      }
    }
  }
  return <div></div>
}

export default Index
