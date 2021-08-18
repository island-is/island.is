import React, { useEffect, useState } from 'react'
import { ApplicationData } from './../../entities/application-data'
import {
  makeCalculations,
  CalculationParameters,
} from './../../utils/overview-calculations'
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
  onSubmit: (data) => void
  defaultValues: ApplicationData
}

const Calculations: React.FC<PropTypes> = ({
  onSubmit,
  defaultValues,
}: PropTypes) => {
  const [premises, setPremises] = useState<CalculationParameters>()
  const taxService = new IcelandicRevenueService()

  const submit = () => {
    onSubmit(null)
  }

  // Aborted because of time issues: Use dummy instead
//   const getDateInterval = (months: number) => {
//     const date = new Date(premises.DateOfCurrentUnemploymentInterval)
//     console.log(date)
//     if (date.getMonth() + months > 11) {
//       const monthsInterval = date.getMonth() + months - 11
//       const date1 = new Date(date.getFullYear() + 1, monthsInterval - 1, 1)
//       console.log(date1)
//       return date1
//     }
//     const date2 = new Date(date.getFullYear(), date.getMonth() + months, 1)
//     console.log(date2)
//     return date2
//   }

//   const monthNames = [
//     'Janúar',
//     'Febrúar',
//     'Mars',
//     'Apríl',
//     'Maí',
//     'Júní',
//     'Julí',
//     'Áugust',
//     'September',
//     'Október',
//     'Nóvember',
//     'Desember',
//   ]

  useEffect(() => {
    async function loadTaxPayerInfo() {
      const taxPremises = await taxService.getTaxpayerInformation(
        defaultValues.initialInfo.nationalId,
      )
      const premisesGiven = {
        FormerSalary: taxPremises.monthlyIncome,
        DateOfFirstUnemploymentPayment: defaultValues.endOfEmployment.dateFrom,
        JobPercentage: taxPremises.percentageOfWork,
        NumberOfChildren: defaultValues.childrenUnderCare
          ? defaultValues.childrenUnderCare.length
          : 0,
        DateOfCurrentUnemploymentInterval: new Date(),
        CapitalGainsPayment: 0,
        PartialJobPayment: 0,
        PensionPayment: 0,
        PercentageOfPartialJob: 0,
        SocialSecurityBenefits: 25000,
      } as CalculationParameters
      setPremises({ ...premisesGiven })
    }
    loadTaxPayerInfo()
  }, [defaultValues])

  const calculate = (dateInterval: Date) => {
    console.log(premises)
    premises.DateOfCurrentUnemploymentInterval = new Date(dateInterval)
    return makeCalculations(premises)
  }

  if (premises) {
    return (
      <div>
        <div className="calculations">
          <div className="calculations__box">
            <div className="calculation__box__month">
              September 2021
            </div>
            <div className="calculation__box__value">
              {calculate(new Date(2021, 8, 1))}
            </div>
          </div>
          <div className="calculations__box">
            <div className="calculation__box__month">
              Október 2021
            </div>
            <div className="calculation__box__value">
                {calculate(new Date(2021, 9, 1))}
            </div>
          </div>
          <div className="calculations__box">
            <div className="calculation__box__month">
              Nóvember 2021
            </div>
            <div className="calculation__box__value">
                {calculate(new Date(2021, 10, 1))}
            </div>
          </div>
          <div className="calculations__box">
            <div className="calculation__box__month">
              Desember 2021
            </div>
            <div className="calculation__box__value">
            {calculate(new Date(2021, 11, 1))}
            </div>
          </div>
          <div className="calculations__box">
            <div className="calculation__box__month">
              Janúar 2022
            </div>
            <div className="calculation__box__value">
            {calculate(new Date(2022, 0, 1))}
            </div>
          </div>
          <div className="calculations__box">
            <div className="calculation__box__month">
              Febrúar 2022
            </div>
            <div className="calculation__box__value">
            {calculate(new Date(2022, 1, 1))}
            </div>
          </div>
        </div>
        <div className="calculation__button__wrapper">
          <Box paddingTop={2}>
            <Button onClick={submit}>Senda umsókn</Button>
          </Box>
        </div>
      </div>
    )
  }
  return <div></div>
}

export default Calculations
