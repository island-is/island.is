import React, { useContext, useMemo, useState } from 'react'

import {
  InputModal,
  NumberInput,
} from '@island.is/financial-aid-web/veita/src/components'

import { AdminContext } from '@island.is/financial-aid-web/veita/src/components/AdminProvider/AdminProvider'
import {
  aidCalculator,
  calculateAcceptedAidFinalAmount,
  calculateTaxOfAmount,
  HomeCircumstances,
  isObjEmpty,
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
}

interface calculationsState {
  amount: number
  income: number
  personalTaxCreditPercentage: number
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

  if (!aidAmount) {
    return (
      <Text color="red400">
        Útreikingur fyrir aðstoð misstókst, vinsamlegast reyndu aftur
      </Text>
    )
  }

  const [state, setState] = useState<calculationsState>({
    amount: aidAmount,
    income: 0,
    personalTaxCreditPercentage: 0,
    tax: calculateTaxOfAmount(aidAmount, currentYear),
    secondPersonalTaxCredit: 0,
    showSecondPersonalTaxCredit: false,
    deductionFactor: {},
    hasError: false,
  })

  const sumValues = (
    obj: Record<string, { description: string; amount: number }>,
  ) =>
    Object.values(obj)
      .map((item) => {
        return item.amount
      })
      .reduce((a, b) => {
        return a + b
      }, 0)

  const finalAmount = calculateAcceptedAidFinalAmount(
    aidAmount - state.income - sumValues(state.deductionFactor),
    currentYear,
    state.personalTaxCreditPercentage,
    state.secondPersonalTaxCredit,
  )

  return (
    <InputModal
      headline="Umsóknin þín er samþykkt og áætlun er tilbúin"
      onCancel={onCancel}
      onSubmit={() => {
        if (finalAmount && finalAmount <= 0) {
          setState({ ...state, hasError: true })
          return
        }
        onSaveApplication(finalAmount)
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
            setState({ ...state, amount: input, hasError: false })
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
            setState({ ...state, income: input, hasError: false })
          }}
          maximumInputLength={maximumInputLength}
        />
      </Box>

      {!isObjEmpty(state.deductionFactor) && (
        <>
          {Object.keys(state.deductionFactor).map(function (key) {
            return (
              <Box className={modalStyles.deductionFactor}>
                <Input
                  label="Lýsing"
                  placeholder="Skrifaðu lýsingu"
                  id={`description-${key}`}
                  name={`description-${key}`}
                  value={state.deductionFactor[key].description}
                  onChange={(e) => {
                    setState({
                      ...state,
                      hasError: false,
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
                    setState({
                      ...state,
                      hasError: false,
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
                      hasError: false,
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
                hasError: false,
                deductionFactor: { factor1: { description: '', amount: 0 } },
              })
              return
            }
            setState({
              ...state,
              hasError: false,
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
          value={Number(state.personalTaxCreditPercentage).toString()}
          type="number"
          onChange={(e) => {
            if (e.target.value.length <= 3 && Number(e.target.value) <= 100) {
              setState({
                ...state,
                hasError: false,
                personalTaxCreditPercentage: Number(e.target.value),
              })
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
            value={Number(state.secondPersonalTaxCredit).toString()}
            type="number"
            onChange={(e) => {
              if (e.target.value.length <= 3 && Number(e.target.value) <= 100) {
                setState({
                  ...state,
                  hasError: false,
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
            ? 'Fjarlægðu skattkorti'
            : 'Bættu við skattkorti'}
        </Button>
      </Box>

      <Box marginBottom={[3, 3, 5]}>
        <Input
          label="Skattur "
          id="tax"
          name="tax"
          value={calculateTaxOfAmount(
            (aidAmount || 0) - state.income - sumValues(state.deductionFactor),
            currentYear,
          ).toLocaleString('de-DE')}
          readOnly={true}
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
        <Text>{finalAmount.toLocaleString('de-DE')} kr.</Text>
      </Box>
    </InputModal>
  )
}

export default AcceptModal
