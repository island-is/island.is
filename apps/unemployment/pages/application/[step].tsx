import { UnemploymentStep } from './../../entities/enums/unemployment-step.enum'
import { useRouter } from 'next/router'
import React, { useState, useEffect, useContext } from 'react'
import PersonalInformation from '../../components/forms/personal-information'
import { UserContext } from './../../components/util/UserProvider'
import { ApplicationService } from './../../services/application.service'
import { ApplicationData } from './../../entities/application-data'
import { InitialInfo } from 'apps/unemployment/entities/initial-info'

        
const Index: React.FC = () => {
    const { query } = useRouter()
    const stepQuery = query.step
    const [step, setStep] = useState(1)
    const router = useRouter()
    const { user, logOut } = useContext(UserContext)
    const [applicationData, setApplicationData] = useState<ApplicationData>()
  
    /** Load the client and set the step from query if there is one */
    useEffect(() => {
      async function loadApplication() {
        let application = await getApplication()
        if (!application) {
            application = new ApplicationData()
            application.initialInfo = new InitialInfo()
            application.initialInfo.name = user?.name
            console.log(application)
        }
        console.log("application")
        console.log(application)
        setApplicationData(application)
      }
      console.log(stepQuery)
      if (+stepQuery === UnemploymentStep.PersonalInformation) {
        console.log("Persónuupplýsingar")
        
      }
      loadApplication()
//      document.title = ""
    }, [stepQuery])
  
    const getApplication = async () => {
        return ApplicationService.getApplication()
    }
  
    const changesMade = () => {
      getApplication()
    }
  
    const handleNext = () => {
      setStep(step + 1)
    }
  
    const handleStepChange = (step: UnemploymentStep) => {
      setStep(step)
    }
  
    const handleBack = () => {
      setStep(step - 1)
    }
  
    const handleCancel = () => {
      router.push('/clients')
    }
  
    const handleSaved = (application: any) => {
        getApplication()
        handleNext()      
    }
  
    switch (step) {
      case UnemploymentStep.PersonalInformation:
        return <PersonalInformation defaultValues={applicationData} onSubmit={handleSaved} ></PersonalInformation>

     
      default: {
        return (
          <div></div>
        )
      }
    }
  }
  
  export default Index