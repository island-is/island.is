import { Application } from '@island.is/application/types'
import { TOTAL } from './constants'
import { getValueViaPath } from '@island.is/application/core'
import { Election } from '../types/types'

export const checkIfNegative = (inputNumber: string) => {
  if (Number(inputNumber) < 0) {
    return false
  } else {
    return true
  }
}

export const currencyStringToNumber = (str: string) => {
  if (!str) {
    return str
  }
  const cleanString = str.replace(/[,\s]+|[.\s]+/g, '')
  return parseInt(cleanString, 10)
}

export const getTotal = (values: Record<string, string>, key: string) => {
  if (!values[key]) {
    return 0
  }
  const total = Object.entries(values[key])
    .filter(([k, v]) => k !== TOTAL && !isNaN(Number(v)))
    .map(([_k, v]) => Number(v))
    .reduce((prev, current) => {
      return (prev += current)
    }, 0)
  return total
}
export const formatCurrency = (answer: string) =>
  answer.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export const formatNumber = (num: number) => num.toLocaleString('de-DE')

export const getFinancialLimit = (application: Application) => {
  const { answers, externalData } = application

  const selectedElectionId = getValueViaPath<string>(
    answers,
    'election.electionId',
  )
  const elections = getValueViaPath<Array<Election>>(
    externalData,
    'fetchElections.data',
  )

  const selectedElection = elections?.find(
    (election) => election.electionId === selectedElectionId,
  )

  return selectedElection?.limit
}
