import React, { useState } from 'react'
import useUserInfo from '../../hooks/useUserInfo/useUserInfo'
import { useHistory } from 'react-router-dom'
import {
  Box,
  Button,
  Columns,
  Column,
  Select,
  Option,
  ContentBlock,
  Typography,
} from '@island.is/island-ui/core'
import actors from '../../mirage-server/fixtures/actors'
import { Actor } from '../../mirage-server/models/actor'
import { Subject } from '../../mirage-server/models/subject'
import subjects from '../../mirage-server/fixtures/subjects'

export const Login = () => {
  const history = useHistory()
  const [actor, setActor] = useState<Actor>()
  const [subject, setSubject] = useState<Subject>()
  const historyState = history.location.state as { from?: string }
  const { setUser } = useUserInfo()
/*
  const handleActor = (option: Option) =>
    setActor(actors.find((x) => x.nationalId === option.value))
  const handleSubject = (option: Option) =>
    setSubject(subjects.find((x) => x.nationalId === option.value))

  const handleLogin = async () => {
    await setUser(actor.nationalId, subject.nationalId)
    history.push(historyState?.from || '/')
  }*/

  return (
    <h1>Login deactivate</h1>
  /*   <Box width="full" height="full" padding={20}>
      <ContentBlock width="small">
        <Box display="flex" justifyContent="center" marginBottom={5}>
          <Typography variant="h2">Innskráning</Typography>
        </Box>
        <Columns space={1}>
          <Column>
            <Typography variant="h5">Actor</Typography>
            <Select
              name="Actor"
              onChange={handleActor}
              options={actors.map((actor) => ({
                label: `${actor.name}, ${actor.nationalId}`,
                value: actor.nationalId,
              }))}
            />
          </Column>
          <Column>
            <Typography variant="h5">Subject</Typography>
            <Select
              name="Subject"
              onChange={handleSubject}
              options={
                actor
                  ? subjects
                      .filter((x) => actor.subjectIds.includes(x.id))
                      .map((subject) => ({
                        label: `${subject.name}, ${subject.nationalId}`,
                        value: subject.nationalId,
                      }))
                  : []
              }
            />
          </Column>
        </Columns>
        <Box display="flex" justifyContent="center" marginTop={4}>
          <Button onClick={handleLogin} disabled={!actor || !subject}>
            Innskráning
          </Button>
        </Box>
      </ContentBlock>
    </Box>
  ) */
  )
}
