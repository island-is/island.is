import React, { useContext, useMemo, useState } from 'react'

import {
  InputModal,
  NumberInput,
} from '@island.is/financial-aid-web/veita/src/components'

import { AdminContext } from '@island.is/financial-aid-web/veita/src/components/AdminProvider/AdminProvider'
import {
  aidCalculator,
  calculateAidFinalAmount,
  HomeCircumstances,
} from '@island.is/financial-aid/shared/lib'
import format from 'date-fns/format'
import { Box, Button, Input, Text } from '@island.is/island-ui/core'

import * as modalStyles from './ModalTypes.css'

interface Props {
  onCancel: (event: React.MouseEvent<HTMLButtonElement>) => void
  onSaveApplication: (amount: number) => void
  isModalVisable: boolean
  homeCircumstances: HomeCircumstances
  spouseNationalId?: string
  usePersonalTaxCredit: boolean
}

interface calculationsState {
  amount: number
  income: number
  personalTaxCredit: number
  tax: number
  secondPersonalTaxCredit: number
  showSecondPersonalTaxCredit: boolean
  hasError: boolean
  deductionFactor: Record<string, { description: string; amount: number }>
}

const AcceptModal = ({
  onCancel,
  onSaveApplication,
  isModalVisable,
  homeCircumstances,
  spouseNationalId,
  usePersonalTaxCredit,
}: Props) => {
  const maximumInputLength = 6

  const currentYear = format(new Date(), 'yyyy')

  const { municipality } = useContext(AdminContext)

  const aidAmount = useMemo(() => {
    if (municipality && homeCircumstances) {
      return aidCalculator(
        homeCircumstances,
        spouseNationalId
          ? municipality.cohabitationAid
          : municipality.individualAid,
      )
    }
  }, [homeCircumstances, municipality])

  const [state, setState] = useState<calculationsState>({
    amount: aidAmount
      ? calculateAidFinalAmount(aidAmount, usePersonalTaxCredit, currentYear)
      : 0,
    income: 0,
    personalTaxCredit: 0,
    tax: 0,
    secondPersonalTaxCredit: 0,
    showSecondPersonalTaxCredit: false,
    deductionFactor: {},
    hasError: false,
  })

  const isObjEmpty = (obj: any) =>
    obj &&
    Object.keys(obj).length === 0 &&
    Object.getPrototypeOf(obj) === Object.prototype

  return (
    <InputModal
      headline="Umsóknin þín er samþykkt og áætlun er tilbúin"
      onCancel={onCancel}
      onSubmit={() => {
        if (state.amount <= 0) {
          setState({ ...state, hasError: true })
          return
        }
        onSaveApplication(state.amount)
      }}
      submitButtonText="Samþykkja"
      isModalVisable={isModalVisable}
      hasError={state.hasError}
      errorMessage="Þú þarft að fylla út alla reiti"
    >
      <Box marginBottom={3}>
        <NumberInput
          label="Grunnupphæð"
          placeholder="Skrifaðu upphæð útborgunar"
          id="amountInput"
          name="amountInput"
          value={state.amount.toString()}
          onUpdate={(input) => {
            setState({ ...state, hasError: false })
            setState({ ...state, amount: input })
          }}
          maximumInputLength={maximumInputLength}
        />
      </Box>

      <Box marginBottom={3}>
        <NumberInput
          label="Tekjur"
          placeholder="Skrifaðu upphæð"
          id="income"
          name="income"
          value={state.income.toString()}
          onUpdate={(input) => {
            setState({ ...state, hasError: false })
            setState({ ...state, income: input })
          }}
          maximumInputLength={maximumInputLength}
        />
      </Box>

      {!isObjEmpty(state.deductionFactor) && (
        <>
          {Object.keys(state.deductionFactor).map(function (key, index) {
            return (
              <Box className={modalStyles.deductionFactor}>
                <Input
                  label="Lýsing"
                  placeholder="Skrifaðu lýsingu"
                  id={`description-${key}`}
                  name={`description-${key}`}
                  value={state.deductionFactor[key].description}
                  onChange={(e) => {
                    setState({ ...state, hasError: false })
                    setState({
                      ...state,
                      deductionFactor: {
                        ...state.deductionFactor,
                        [key]: {
                          ...state.deductionFactor[key],
                          description: e.target.value,
                        },
                      },
                    })
                  }}
                  backgroundColor="blue"
                />

                <NumberInput
                  label="Upphæð frádráttar"
                  placeholder="Skrifaðu upphæð"
                  id={`amount-${key}`}
                  name={`amount-${key}`}
                  value={state.deductionFactor[key].amount.toString()}
                  onUpdate={(input) => {
                    setState({ ...state, hasError: false })
                    setState({
                      ...state,
                      deductionFactor: {
                        ...state.deductionFactor,
                        [key]: { ...state.deductionFactor[key], amount: input },
                      },
                    })
                  }}
                  maximumInputLength={maximumInputLength}
                />

                <Button
                  circle
                  icon="remove"
                  onClick={() => {
                    const removeFactor = state.deductionFactor
                    delete removeFactor[key]

                    setState({
                      ...state,
                      deductionFactor: removeFactor,
                    })
                  }}
                  size="small"
                  variant="ghost"
                />
              </Box>
            )
          })}
        </>
      )}

      <Box marginBottom={3}>
        <Button
          icon="add"
          onClick={() => {
            if (isObjEmpty(state.deductionFactor)) {
              setState({
                ...state,
                deductionFactor: { factor1: { description: '', amount: 0 } },
              })
              return
            }
            setState({
              ...state,
              deductionFactor: {
                ...state.deductionFactor,
                [`factor${Object.keys(state.deductionFactor).length + 1}`]: {
                  description: '',
                  amount: 0,
                },
              },
            })
          }}
          variant="text"
        >
          Bættu við frádráttarlið
        </Button>
      </Box>

      <Box marginBottom={3}>
        <Input
          label="Persónuafsláttur"
          placeholder="Skrifaðu prósentuhlutfall"
          id="personalTaxCredit"
          name="personalTaxCredit"
          value={state.personalTaxCredit}
          type="number"
          onChange={(e) => {
            setState({ ...state, hasError: false })
            if (e.target.value.length <= 3) {
              setState({ ...state, personalTaxCredit: Number(e.target.value) })
            }
          }}
          backgroundColor="blue"
        />
      </Box>

      {state.showSecondPersonalTaxCredit && (
        <Box marginBottom={3}>
          <Input
            label="Persónuafsláttur"
            placeholder="Skrifaðu prósentuhlutfall"
            id="secondPersonalTaxCredit"
            name="secondPersonalTaxCredit"
            value={state.secondPersonalTaxCredit}
            type="number"
            onChange={(e) => {
              setState({ ...state, hasError: false })
              if (e.target.value.length <= 3) {
                setState({
                  ...state,
                  secondPersonalTaxCredit: Number(e.target.value),
                })
              }
            }}
            backgroundColor="blue"
          />
        </Box>
      )}

      <Box marginBottom={3}>
        <Button
          icon={state.showSecondPersonalTaxCredit ? 'remove' : 'add'}
          onClick={() => {
            setState({
              ...state,
              showSecondPersonalTaxCredit: !state.showSecondPersonalTaxCredit,
            })
          }}
          variant="text"
        >
          {state.showSecondPersonalTaxCredit
            ? 'Fjarlægðu skattkort'
            : 'Bættu við skattkorti'}
        </Button>
      </Box>

      <Box marginBottom={[3, 3, 5]}>
        <Input
          label="Skattur "
          id="tax"
          name="tax"
          value={state.tax}
          type="number"
        />
      </Box>

      <Text variant="h3" marginBottom={3}>
        Útreikningur
      </Text>

      <Box
        display="flex"
        justifyContent="spaceBetween"
        background="blue100"
        borderTopWidth="standard"
        borderBottomWidth="standard"
        borderColor="blue200"
        paddingY={2}
        paddingX={3}
        marginBottom={2}
      >
        <Text variant="small">Upphæð aðstoðar</Text>
        <Text>{state.amount.toLocaleString('de-DE')}</Text>
      </Box>
    </InputModal>
  )
}

export default AcceptModal
