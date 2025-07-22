import SlackNotify from 'slack-notify'
;(async () => {
  const webhookUrl = process.env.SLACK_WEBHOOK
  if (webhookUrl) {
    const slack = SlackNotify(webhookUrl)
    const user = process.env.TRIGGER_USER
    const filter = process.env.TEST_FILTER ?? ''
    const project = process.env.TEST_PROJECT
    const likelyProject = filter.split('/')[0]
    slack
      .send({
        channel: '#acceptance-tests-status',
        icon_emoji: ':boom:',
        text: [
          `System tests have failed in ${likelyProject} (triggered by ${user}).`,
          `  Project=${project}, filter=${filter}`,
          `Check https://www.tesults.com/digital-iceland/monorepo`,
        ].join('\n'),
      })
      .then((_: unknown) => console.log('done'))
      .catch((e: unknown) => console.error(e))
  }
})()
