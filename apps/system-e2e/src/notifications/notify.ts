import SlackNotify from 'slack-notify'
;(async () => {
  const webhookUrl = process.env.SLACK_WEBHOOK
  if (webhookUrl) {
    const slack = SlackNotify(webhookUrl)
    slack
      .send({
        channel: '#acceptance-tests-status',
        icon_emoji: ':boom:',
        text: `The System E2E tests have failed, please check Spinnaker. The user that triggered the pipeline is: ${process.env.TRIGGER_USER}`,
      })
      .then((_) => console.log('done'))
      .catch((e) => console.error(e))
  }
})()
