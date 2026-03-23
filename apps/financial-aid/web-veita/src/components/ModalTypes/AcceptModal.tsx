import React, { useMemo, useState } from 'react'

import {
  InputModal,
  NumberInput,
  PercentageInput,
} from '@island.is/financial-aid-web/veita/src/components'
import { useRouter } from 'next/router'
import {
  aidCalculator,
  Amount,
  calculateAcceptedAidFinalAmount,
  calculateFinalTaxAmount,
  calculateTaxOfAmount,
  ChildrenAid,
  FamilyStatus,
  getMonth,
  HomeCircumstances,
  Municipality,
  showSpouseData,
} from '@island.is/financial-aid/shared/lib'
import { Box, Button, Input, Text } from '@island.is/island-ui/core'
import cn from 'classnames'

import * as modalStyles from './ModalTypes.css'

interface Props {
  onCancel: (event: React.MouseEvent<HTMLButtonElement>) => void
  onSaveApplication: (amount: Amount, comment: string) => void
  isModalVisable: boolean
  homeCircumstances: HomeCircumstances
  familyStatus: FamilyStatus
  applicationMunicipality: Municipality
  hasApplicantChildren: boolean
  decemberCompensation: number
  appliedMonth: number
}

interface calculationsState {
  amount: number
  income?: number
  childrenAidAmount?: number
  personalTaxCreditPercentage?: number
  secondPersonalTaxCredit: number
  showSecondPersonalTaxCredit: boolean
  hasError: boolean
  hasSubmitError: boolean
  deductionFactor: Array<{ description: string; amount: number }>
  comment: string
  decemberAidAmount?: number
}

const AcceptModal = ({
  onCancel,
  onSaveApplication,
  isModalVisable,
  homeCircumstances,
  familyStatus,
  applicationMunicipality,
  hasApplicantChildren,
  decemberCompensation,
  appliedMonth,
}: Props) => {
  const router = useRouter()
  const maximumInputLength = 6

  const hasDecemberAid = getMonth(appliedMonth, 'en') === 'November'
  const hasChildrenAid =
    applicationMunicipality.childrenAid === ChildrenAid.APPLICANT &&
    hasApplicantChildren

  const aidAmount = useMemo(() => {
    if (applicationMunicipality && homeCircumstances) {
      return aidCalculator(
        homeCircumstances,
        showSpouseData[familyStatus]
          ? applicationMunicipality.cohabitationAid
          : applicationMunicipality.individualAid,
      )
    }
  }, [homeCircumstances, applicationMunicipality])

  if (!aidAmount) {
    return (
      <>
        {isModalVisable && (
          <Text color="red400">
            Útreikingur fyrir aðstoð misstókst, vinsamlegast reyndu aftur
          </Text>
        )}
      </>
    )
  }

  const calculateDecemberAid = (
    hasDecemberAid: boolean,
    aidAmount: number,
    decemberCompensation: number,
  ) => {
    if (hasDecemberAid) {
      const aidPercentage = aidAmount / 100
      return Math.round(aidPercentage * decemberCompensation)
    }
    return 0
  }

  const [state, setState] = useState<calculationsState>({
    amount: aidAmount,
    childrenAidAmount: undefined,
    income: undefined,
    personalTaxCreditPercentage: undefined,
    secondPersonalTaxCredit: 0,
    showSecondPersonalTaxCredit: false,
    deductionFactor: [],
    hasError: false,
    hasSubmitError: false,
    comment: '',
    decemberAidAmount: calculateDecemberAid(
      hasDecemberAid,
      aidAmount,
      decemberCompensation,
    ),
  })

  const sumValues = state.deductionFactor.reduce(
    (n, { amount }) => n + amount,
    0,
  )

  const checkingValue = (element?: number) => (element ? element : 0)

  const amount =
    (state.amount || 0) -
    checkingValue(state.income) -
    sumValues +
    (state.decemberAidAmount || 0)

  const taxAmountWithPersonalTax = calculateFinalTaxAmount(
    amount,
    checkingValue(state.personalTaxCreditPercentage),
    state.secondPersonalTaxCredit,
  )

  const finalAmount = calculateAcceptedAidFinalAmount(
    amount,
    taxAmountWithPersonalTax,
    state.childrenAidAmount || 0,
  )

  const taxAmount = calculateTaxOfAmount(amount)

  const areRequiredFieldsFilled =
    state.income === undefined ||
    state.personalTaxCreditPercentage === undefined ||
    (hasChildrenAid && state.childrenAidAmount === undefined) ||
    !finalAmount ||
    finalAmount === 0

  const submit = async () => {
    if (areRequiredFieldsFilled) {
      setState({ ...state, hasError: true })
      return
    }

    onSaveApplication(
      {
        applicationId: router.query.id as string,
        aidAmount: state.amount,
        childrenAidAmount: state.childrenAidAmount,
        income: state.income,
        personalTaxCredit: state.personalTaxCreditPercentage ?? 0,
        spousePersonalTaxCredit: state.secondPersonalTaxCredit,
        tax: taxAmount,
        finalAmount: finalAmount,
        deductionFactors: state.deductionFactor,
        decemberAidAmount: state.decemberAidAmount,
      },
      state.comment,
    )
  }

  return (
    <InputModal
      headline="Umsóknin þín er samþykkt og áætlun er tilbúin"
      onCancel={onCancel}
      onSubmit={submit}
      submitButtonText="Samþykkja"
      isModalVisable={isModalVisable}
      hasError={state.hasSubmitError}
      errorMessage={'Eitthvað fór úrskeiðis, vinsamlega reynið aftur síðar'}
    >
      <Box marginBottom={3}>
        <NumberInput
          label="Grunnupphæð"
          placeholder="Sláðu inn upphæð útborgunar"
          id="amountInput"
          name="amountInput"
          value={state.amount.toString()}
          onUpdate={(input) => {
            setState({ ...state, amount: input, hasError: false })
          }}
          maximumInputLength={maximumInputLength}
        />
      </Box>

      {hasDecemberAid && (
        <Box marginBottom={3}>
          <NumberInput
            label="Desember uppbót"
            placeholder="Sláðu inn upphæð desember uppbótar"
            id="decemberAidAmountInput"
            name="decemberAidAmountInput"
            value={
              state?.decemberAidAmount
                ? state?.decemberAidAmount.toString()
                : ''
            }
            onUpdate={(input) => {
              setState({ ...state, decemberAidAmount: input, hasError: false })
            }}
            maximumInputLength={maximumInputLength}
          />
        </Box>
      )}

      {hasChildrenAid && (
        <Box marginBottom={3}>
          <NumberInput
            label="Styrkur vegna barna"
            placeholder="Sláðu inn upphæð"
            id="childrenAidAmountInput"
            name="childrenAidAmountInput"
            value={
              state?.childrenAidAmount
                ? state?.childrenAidAmount.toString()
                : ''
            }
            onUpdate={(input) => {
              setState({
                ...state,
                childrenAidAmount: input,
                hasError: false,
              })
            }}
            maximumInputLength={maximumInputLength}
            hasError={state.hasError && state.childrenAidAmount === undefined}
          />
          <Text variant="small" fontWeight="semiBold" marginBottom={1}>
            ATH. ekki er tekinn skattur af styrk barna
          </Text>
        </Box>
      )}

      <Box marginBottom={3}>
        <NumberInput
          label="Tekjur"
          placeholder="Sláðu inn upphæð"
          id="income"
          name="income"
          value={state?.income ? state?.income.toString() : ''}
          onUpdate={(input) => {
            setState({ ...state, income: input, hasError: false })
          }}
          maximumInputLength={maximumInputLength}
          hasError={state.hasError && state.income === undefined}
        />
      </Box>

      {state.deductionFactor.map((item, index) => {
        return (
          <Box
            className={modalStyles.deductionFactor}
            key={`deductionFactor-${index}`}
          >
            <Input
              label="Lýsing"
              placeholder="Sláðu inn lýsingu"
              id={`description-${index}`}
              name={`description-${index}`}
              value={state.deductionFactor[index].description}
              onChange={(e) => {
                setState({
                  ...state,
                  hasError: false,
                  deductionFactor: [...state.deductionFactor].map((object) => {
                    if (object === item) {
                      return {
                        ...object,
                        description: e.target.value,
                      }
                    } else return object
                  }),
                })
              }}
              backgroundColor="blue"
            />

            <NumberInput
              label="Upphæð frádráttar"
              placeholder="Sláðu inn upphæð"
              id={`amount-${index}`}
              name={`amount-${index}`}
              value={state.deductionFactor[index].amount.toString()}
              onUpdate={(input) => {
                setState({
                  ...state,
                  hasError: false,
                  deductionFactor: [...state.deductionFactor].map((object) => {
                    if (object === item) {
                      return {
                        ...object,
                        amount: input,
                      }
                    } else return object
                  }),
                })
              }}
              maximumInputLength={maximumInputLength}
            />

            <Button
              circle
              icon="remove"
              onClick={() => {
                setState({
                  ...state,
                  deductionFactor: state.deductionFactor.filter(
                    (el) => el !== item,
                  ),
                })
              }}
              size="small"
              variant="ghost"
            />
          </Box>
        )
      })}

      <Box marginBottom={3}>
        <Button
          icon="add"
          onClick={() => {
            setState({
              ...state,
              hasError: false,
              deductionFactor: [
                ...state.deductionFactor,
                { description: '', amount: 0 },
              ],
            })
          }}
          variant="text"
        >
          Bættu við frádráttarlið
        </Button>
      </Box>

      <Box marginBottom={3}>
        <PercentageInput
          id="personalTaxCredit"
          name="personalTaxCredit"
          label="Persónuafsláttur"
          value={
            state.personalTaxCreditPercentage
              ? state.personalTaxCreditPercentage.toString()
              : ''
          }
          hasError={
            state.hasError && state.personalTaxCreditPercentage === undefined
          }
          onUpdate={(value: number) =>
            setState({
              ...state,
              hasError: false,
              personalTaxCreditPercentage: value,
            })
          }
        />
      </Box>

      {state.showSecondPersonalTaxCredit && (
        <Box marginBottom={3}>
          <PercentageInput
            id="secondPersonalTaxCredit"
            name="secondPersonalTaxCredit"
            placeholder="Sláðu inn prósentuhlutfall"
            label="Persónuafsláttur"
            value={
              state.secondPersonalTaxCredit
                ? state.secondPersonalTaxCredit.toString()
                : ''
            }
            hasError={
              state.hasError && state.secondPersonalTaxCredit === undefined
            }
            onUpdate={(value: number) =>
              setState({
                ...state,
                hasError: false,
                secondPersonalTaxCredit: value,
              })
            }
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
            ? 'Fjarlægja persónuafslátt'
            : 'Nýta persónuafslátt maka'}
        </Button>
      </Box>

      <Box marginBottom={3}>
        <Box marginBottom={1}>
          <Input
            label="Skattur "
            id="tax"
            name="tax"
            value={taxAmount.toLocaleString('de-DE')}
            readOnly={true}
          />
        </Box>

        <Input
          label="Reiknaður skattur tekið tillit til persónuafsláttar"
          id="tax"
          name="tax"
          value={taxAmountWithPersonalTax.toLocaleString('de-DE')}
          readOnly={true}
        />
      </Box>

      <Box marginBottom={[3, 3, 5]}>
        <Input
          label="Skýring"
          placeholder="Sláðu inn skýringu ef þarf"
          id="comment"
          name="comment"
          textarea
          value={state.comment}
          onChange={(e) => {
            setState({
              ...state,
              comment: e.target.value,
            })
          }}
          backgroundColor="blue"
        />
      </Box>

      <div
        className={cn({
          [`errorMessage`]: true,
          [`showErrorMessage`]: state.hasError,
        })}
      >
        <Text color="red600" fontWeight="semiBold" variant="small">
          Þú þarft að fylla út alla reiti
        </Text>
      </div>

      <Text variant="h3" marginBottom={3}>
        Útreikningur
      </Text>

      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
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
