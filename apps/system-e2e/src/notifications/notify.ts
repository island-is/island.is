import SlackNotify from 'slack-notify'
;(async () => {
  const webhookUrl = process.env.SLACK_WEBHOOK
  if (webhookUrl) {
    const slack = SlackNotify(webhookUrl)
    slack
      .send({
        channel: '#acceptance-tests-status',
        icon_emoji: ':boom:',
        text: `System tests in ${
          process.env.TEST_PROJECT ?? 'islandis'
        } have failed (triggered by ${
          process.env.TRIGGER_USER
        }).\nCheck https://www.tesults.com/digital-iceland/monorepo`,
      })
      .then((_: unknown) => console.log('done'))
      .catch((e: unknown) => console.error(e))
  }
})()
