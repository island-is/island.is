import React, { useState } from 'react'
import { UserContext } from './../../components/util/UserProvider'
import { useContext, useEffect } from 'react'
import PersonalInformation from '../../components/forms/personal-information'
import { ApplicationData } from './../../entities/application-data'

const Index = () => {
    const { user, logOut } = useContext(UserContext)
    const [applicationData, setApplicationData] = useState<ApplicationData>(null)
    
    useEffect(() => {
        console.log("logging user")
        console.log(user?.name)
        const temp = {initialInfo: { name: user?.name}} as ApplicationData
        setApplicationData(temp)
    }, [])

    const submit = (data: any) => {
        console.log(data)
    }

    if (applicationData && applicationData.initialInfo) {

        console.log(applicationData)
        return <PersonalInformation defaultValues={applicationData} onSubmit={submit} ></PersonalInformation>
    }

    return <div></div>
    
}

export default Index