import { UnemploymentStep } from './../../entities/enums/unemployment-step.enum'
import { useRouter } from 'next/router'
import React, { useState, useEffect, useContext } from 'react'
import PersonalInformation from '../../components/forms/personal-information'
import { UserContext } from './../../components/util/UserProvider'
import { ApplicationService } from './../../services/application.service'
import { ApplicationData } from './../../entities/application-data'
import { InitialInfo } from './../../entities/initial-info'
import { UserService } from './../../services/user.service'

        
const Index: React.FC = () => {
    const { query } = useRouter()
    const stepQuery = query.step
    const [step, setStep] = useState(1)
    const router = useRouter()
    const { user } = useContext(UserContext)
    const [applicationData, setApplicationData] = useState<ApplicationData>()
  
    /** Load the client and set the step from query if there is one */
    useEffect(() => {
        let application = getApplication()
        if (!application) {
            application = new ApplicationData()
            application.initialInfo = new InitialInfo()
            application.initialInfo.name = UserService.getUser().name
            console.log("kdkdadg")
            console.log(application)
            console.log(user?.name)
        }
        console.log("application")
        console.log(application)
        setApplicationData(application)
      
        if (+stepQuery === UnemploymentStep.PersonalInformation) {
          console.log("Persónuupplýsingar")
        }
        
//      document.title = ""
    }, [stepQuery, user])
  
    const getApplication = () => {
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
      console.log("saved")
      console.log(application)
        getApplication()
        handleNext()      
    }
  
    if (applicationData)
    {
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
    return <div></div>
      
    
    
  }
  
  export default Index