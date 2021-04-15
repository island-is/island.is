import React, { FC, useEffect, useState } from 'react'
import { GetSingleArticleQuery } from '@island.is/web/graphql/schema'
import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Option,
  RadioButton,
  Select,
  Text,
  Table,
} from '@island.is/island-ui/core'
import { Wizard as WizardType } from './types'
import { richText, SliceType } from '@island.is/island-ui/contentful'
import { useRouter } from 'next/router'

interface StepProps {
  wizard: WizardType
  number: number
  onSubmit: (selected: string) => void
}

const Step: FC<StepProps> = ({ wizard, number, onSubmit }) => {
  const [selected, setSelected] = useState('')

  useEffect(() => {
    setSelected('')
  }, [number])

  const options = wizard.steps[number - 1].options.map((option) => ({
    value: option.key,
    label: option.value,
  }))

  return (
    <Box>
      <Text variant="h3">{wizard.steps[number - 1].title}</Text>
      <Box marginTop={2} marginBottom={6}>
        {options.length < 10 ? (
          <>
            {options.map((option) => (
              <Box marginBottom={1}>
                <RadioButton
                  id={option.value}
                  label={option.label}
                  checked={option.value === selected}
                  onChange={(event) => setSelected(event.target.id)}
                />
              </Box>
            ))}
          </>
        ) : (
          <GridContainer>
            <GridRow>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <Select
                  backgroundColor="white"
                  icon="chevronDown"
                  size="sm"
                  isSearchable
                  label={wizard.steps[number - 1].title}
                  name="officeSelect"
                  options={options}
                  value={options.find((x) => x.value === selected)}
                  onChange={({ value }: Option) => {
                    setSelected(value.toString())
                  }}
                />
              </GridColumn>
            </GridRow>
          </GridContainer>
        )}
      </Box>
      <Button
        size="small"
        icon="arrowForward"
        onClick={() => onSubmit(selected)}
        disabled={selected === ''}
      >
        Áfram
      </Button>
    </Box>
  )
}

interface AnswerTableProps {
  wizard: WizardType
  selected: string
}

const AnswerTable: FC<AnswerTableProps> = ({ wizard, selected }) => {
  const answers = selected.split('-')
  return selected ? (
    <Box marginTop={4}>
      <Table.Table>
        <Table.Head>
          <Table.Row>
            <Table.HeadData>Spurning</Table.HeadData>
            <Table.HeadData>Svar</Table.HeadData>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {answers.map((answer, idx) => {
            const match = wizard.steps[idx].options.find(
              (x) => x.key === answer,
            )
            return match ? (
              <Table.Row>
                <Table.Data>{wizard.steps[idx].title}</Table.Data>
                <Table.Data>{match.value}</Table.Data>
              </Table.Row>
            ) : null
          })}
        </Table.Body>
      </Table.Table>
    </Box>
  ) : null
}

interface WizardProps {
  wizard: GetSingleArticleQuery['getSingleArticle']['wizard']
}

export const Wizard: FC<WizardProps> = ({ wizard }) => {
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState('')

  const Router = useRouter()

  const config: WizardType = JSON.parse(wizard.configuration)

  const nextStep = (sel) => {
    setSelected(step === 1 ? sel : `${selected}-${sel}`)

    setStep(step + 1)
  }

  useEffect(() => {
    if (step > 1) {
      Router.replace(window.location.pathname + '#' + selected)
    }
  }, [step])

  useEffect(() => {
    const hashString = window.location.hash.replace('#', '')
    const s = hashString.split('-').length
    setSelected(hashString)
    setStep(hashString ? s + 1 : s - 1)
  }, [Router])

  const getAnswer = (selected: string) => {
    const sel = selected.split('-')
    const match = config.rules.find((rule) =>
      sel.every((s, idx) => {
        return rule.match[idx].includes(s)
      }),
    )

    if (!match) {
      return <Text>Ekkert svar fannst.</Text>
    }

    const answer = wizard.answers.find((x) => x.slug === match.answer)

    return (
      <>
        <Text variant="h3">{answer.name}</Text>
        {richText(answer.content as SliceType[])}
      </>
    )
  }

  return (
    <Box>
      {step === 0 && (
        <>
          <Text marginBottom={4} variant="intro">
            Þú gætir þurft vegabréfsáritun til að heimsækja Ísland sem
            ferðamaður, vegna náms eða vinnu.
          </Text>
          <Button
            size="small"
            icon="arrowForward"
            onClick={() => {
              setStep(1)
            }}
          >
            Byrja hér
          </Button>
        </>
      )}
      {step > 0 && step <= config.steps.length && (
        <Step wizard={config} number={step} onSubmit={nextStep} />
      )}
      {step > config.steps.length && (
        <>
          <Box marginBottom={4}>{getAnswer(selected)}</Box>
          <Button
            size="small"
            onClick={() => {
              setSelected('')
              setStep(0)
              Router.replace(window.location.pathname)
            }}
          >
            Byrja aftur
          </Button>
        </>
      )}
      <AnswerTable wizard={config} selected={selected} />
    </Box>
  )
}
