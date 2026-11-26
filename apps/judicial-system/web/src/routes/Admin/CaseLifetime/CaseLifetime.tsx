import { useContext, useState } from 'react'

import {
  AlertBanner,
  AlertMessage,
  Box,
  Input,
  Text,
} from '@island.is/island-ui/core'
import { ADMIN_USERS_ROUTE } from '@island.is/judicial-system/consts'
import {
  FormContentContainer,
  FormFooter,
  PageHeader,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { UserRole } from '@island.is/judicial-system-web/src/graphql/schema'
import { stack } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import {
  describeError,
  describeResult,
  isCaseId,
  maxDays,
  parseDays,
} from './CaseLifetime.logic'
import { useExtendCaseLifetimeMutation } from './extendCaseLifetime.generated'

type Outcome =
  | { type: 'success'; message: string }
  | { type: 'error'; message?: string }

export const CaseLifetime = () => {
  const { user } = useContext(UserContext)

  const [caseId, setCaseId] = useState('')
  const [days, setDays] = useState('')
  const [outcome, setOutcome] = useState<Outcome>()

  const [extendCaseLifetime, { loading }] = useExtendCaseLifetimeMutation({
    onCompleted: (data) => {
      const result = data.extendCaseLifetime

      setOutcome(
        result
          ? { type: 'success', message: describeResult(result) }
          : { type: 'error' },
      )
    },
    onError: (error) =>
      setOutcome({ type: 'error', message: describeError(error) }),
  })

  const parsedDays = parseDays(days)
  const hasCaseIdError = caseId !== '' && !isCaseId(caseId)
  const hasDaysError = days !== '' && parsedDays === undefined
  const canSubmit = isCaseId(caseId) && parsedDays !== undefined && !loading

  const submit = () => {
    if (!canSubmit || parsedDays === undefined) {
      return
    }

    setOutcome(undefined)

    extendCaseLifetime({
      variables: { input: { caseId: caseId.trim(), days: parsedDays } },
    })
  }

  return (
    <Box background="purple100" paddingY={6}>
      <PageHeader title="Líftími R-mála - Réttarvörslugátt" />
      <FormContentContainer>
        <div className={stack({ gap: 5 })}>
          <div className={stack({ gap: 2 })}>
            <Text variant="h1" as="h1">
              Líftími R-mála
            </Text>
            <Text>
              R-mál eru sett í geymslu þegar venjulegur líftími þeirra er
              liðinn. Hér er hægt að halda máli lifandi í tiltekinn fjölda daga
              frá deginum í dag. Ef málið er þegar komið í geymslu er það sótt
              þaðan. Skjöl sem hefur verið eytt úr skjalageymslu koma ekki
              aftur.
            </Text>
            <Text>
              Framlengingin þarf að ná fram yfir venjulegan líftíma málsins. 0
              dagar fjarlægja framlengingu af máli sem er ekki í geymslu.
            </Text>
          </div>
          {user?.role !== UserRole.ADMIN ? (
            <AlertBanner
              title="Þú hefur ekki aðgang að þessari síðu."
              variant="error"
              link={{
                href: ADMIN_USERS_ROUTE,
                title: 'Fara á yfirlitssíðu',
              }}
            />
          ) : (
            <>
              <Box background="white" borderRadius="large" padding={4}>
                <div className={stack({ gap: 3 })}>
                  <Input
                    name="caseId"
                    label="Auðkenni máls (guid)"
                    placeholder="00000000-0000-0000-0000-000000000000"
                    value={caseId}
                    disabled={loading}
                    hasError={hasCaseIdError}
                    errorMessage={
                      hasCaseIdError ? 'Auðkenni er ekki gilt guid' : undefined
                    }
                    onChange={(event) => setCaseId(event.target.value)}
                    required
                  />
                  <Input
                    name="days"
                    label="Fjöldi daga frá deginum í dag"
                    value={days}
                    disabled={loading}
                    hasError={hasDaysError}
                    errorMessage={
                      hasDaysError
                        ? `Sláðu inn heila tölu frá 0 til ${maxDays}`
                        : undefined
                    }
                    onChange={(event) => setDays(event.target.value)}
                    required
                  />
                </div>
              </Box>
              {outcome?.type === 'success' && (
                <AlertMessage
                  type="success"
                  title="Líftími máls uppfærður"
                  message={outcome.message}
                />
              )}
              {outcome?.type === 'error' && (
                <AlertMessage
                  type="error"
                  title="Ekki tókst að framlengja líftíma máls"
                  message={
                    outcome.message ?? 'Óvænt villa kom upp. Reyndu aftur.'
                  }
                />
              )}
              <FormFooter
                previousUrl={ADMIN_USERS_ROUTE}
                previousButtonText="Til baka"
                actions={[
                  {
                    text: 'Framlengja líftíma',
                    onClick: submit,
                    disabled: !canSubmit,
                    loading,
                  },
                ]}
              />
            </>
          )}
        </div>
      </FormContentContainer>
    </Box>
  )
}

export default CaseLifetime
