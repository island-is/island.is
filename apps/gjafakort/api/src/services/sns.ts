import AWS from 'aws-sdk'
import { environment } from '../environments/environment'

AWS.config.update({ region: environment.awsRegion })

const sns = new AWS.SNS({
  apiVersion: '2010-03-31',
  endpoint: environment.awsSnsEndpoint,
})

export const publishMessage = async (message) => {
  const params = {
    Message: JSON.stringify(message),
    TopicArn: environment.awsTopicArn,
  }

  try {
    await sns.publish(params).promise()
    console.log(`Message ${params.Message} sent to topic`)
  } catch (err) {
    console.error(`Unable to send message ${params.Message}`)
    console.error('Due to: ', err)
  }
}
