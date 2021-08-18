import React from 'react'
import { ApplicationData } from './../../entities/application-data'
import {
    Stack,
    Box,
    Text,
    Divider,
    Input,
    Button,
    GridContainer,
  } from '@island.is/island-ui/core'

interface PropTypes {
    defaultValues: ApplicationData

  }


const Calculations: React.FC<PropTypes> = ({
    defaultValues,
  }: PropTypes) => {
    
    const dummyCalculation = (application: ApplicationData, dateOfPayment: Date) => {
        return application.endOfEmployment.dateFrom.valueOf() + dateOfPayment.valueOf()
    }
    
    return <div className="calculations">
            <div className="calculations__box">
            {dummyCalculation(defaultValues, new Date(defaultValues.endOfEmployment.dateFrom.setMonth(defaultValues.endOfEmployment.dateFrom.getMonth()+1))) }
            </div>
            <div className="calculations__box">
            {dummyCalculation(defaultValues, new Date(defaultValues.endOfEmployment.dateFrom.setMonth(defaultValues.endOfEmployment.dateFrom.getMonth()+2))) }
            </div>
            <div className="calculations__box">
            {dummyCalculation(defaultValues, new Date(defaultValues.endOfEmployment.dateFrom.setMonth(defaultValues.endOfEmployment.dateFrom.getMonth()+3))) }
            </div>
            <div className="calculations__box">
            {dummyCalculation(defaultValues, new Date(defaultValues.endOfEmployment.dateFrom.setMonth(defaultValues.endOfEmployment.dateFrom.getMonth()+4))) }
            </div>
            <div className="calculations__box">
            {dummyCalculation(defaultValues, new Date(defaultValues.endOfEmployment.dateFrom.setMonth(defaultValues.endOfEmployment.dateFrom.getMonth()+5))) }
            </div>
            <div className="calculations__box">
            {dummyCalculation(defaultValues, new Date(defaultValues.endOfEmployment.dateFrom.setMonth(defaultValues.endOfEmployment.dateFrom.getMonth()+6))) }
            </div>
        </div>
}

export default Calculations