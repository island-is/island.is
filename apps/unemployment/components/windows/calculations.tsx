import React, { useEffect, useState } from 'react'
import { ApplicationData } from './../../entities/application-data'
import { makeCalculations, CalculationParameters } from './../../utils/overview-calculations'
import {
    Stack,
    Box,
    Text,
    Divider,
    Input,
    Button,
    GridContainer,
  } from '@island.is/island-ui/core'
import { IcelandicRevenueService } from './../../services/icelandic-revenue-service'

interface PropTypes {
    defaultValues: ApplicationData
}


const Calculations: React.FC<PropTypes> = ({
    defaultValues,
  }: PropTypes) => {
    
    const [premises, setPremises] = useState<CalculationParameters>()
    const taxService = new IcelandicRevenueService()

    const submit = () => {
        return true
    }

    useEffect(() => {
        console.log("use Effect")
        async function loadTaxPayerInfo(){
            console.log("load")
            console.log(defaultValues)

            const taxPremises = await taxService.getTaxpayerInformation(defaultValues.initialInfo.nationalId)
            const premisesGiven = { 
                FormerSalary: taxPremises.monthlyIncome, 
                DateOfFirstUnemploymentPayment: defaultValues.endOfEmployment.dateFrom, 
                JobPercentage: taxPremises.percentageOfWork, 
                NumberOfChildren: defaultValues.childrenUnderCare.length, 
                DateOfCurrentUnemploymentInterval: new Date(defaultValues.endOfEmployment.dateFrom.setMonth(defaultValues.endOfEmployment.dateFrom.getMonth()+1)),
                CapitalGainsPayment: 0,
                PartialJobPayment: 0,
                PensionPayment: 0,
                PercentageOfPartialJob: 0,
                SocialSecurityBenefits: 0
            } as CalculationParameters
            setPremises({...premisesGiven})
            console.log(premisesGiven)
        }
        loadTaxPayerInfo()
        
    }, [defaultValues])
    
    const calculate = (dateInterval: Date) => {
        console.log(premises)
        premises.DateOfCurrentUnemploymentInterval = dateInterval;
        return makeCalculations(premises)
    }
    
    if (premises)
    {
        return <div className="calculations">
        <div className="calculations__box">
        {calculate(premises.DateOfCurrentUnemploymentInterval)}
        </div>
        <div className="calculations__box">
        {calculate(new Date(premises.DateOfCurrentUnemploymentInterval.setMonth(premises.DateOfCurrentUnemploymentInterval.getMonth()+1))) }
        </div>
        <div className="calculations__box">
        {calculate(new Date(premises.DateOfCurrentUnemploymentInterval.setMonth(premises.DateOfCurrentUnemploymentInterval.getMonth()+2))) }
        </div>
        <div className="calculations__box">
        {calculate(new Date(premises.DateOfCurrentUnemploymentInterval.setMonth(premises.DateOfCurrentUnemploymentInterval.getMonth()+3))) }
        </div>
        <div className="calculations__box">
        {calculate(new Date(premises.DateOfCurrentUnemploymentInterval.setMonth(premises.DateOfCurrentUnemploymentInterval.getMonth()+4))) }
        </div>
        <div className="calculations__box">
        {calculate(new Date(premises.DateOfCurrentUnemploymentInterval.setMonth(premises.DateOfCurrentUnemploymentInterval.getMonth()+5))) }
        </div>

        <Box paddingTop={2}>
          <Button onClick={submit}>Senda umsókn</Button>
        </Box>
    </div>
    }
    return <div></div>
    
}

export default Calculations