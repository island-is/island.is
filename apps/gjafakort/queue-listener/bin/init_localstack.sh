#!/bin/bash

AWS_REGION="eu-west-1"
ACCOUNT_ID="000000000000"

SNS_NAME="gjafakort-company-registration-topic"
SNS_ARN="arn:aws:sns:$AWS_REGION:$ACCOUNT_ID:$SNS_NAME"

FERDALAG_QUEUE_NAME="ferdalag-updates-queue"
YAY_QUEUE_NAME="yay-updates-queue"
DEAD_LETTER_QUEUE_NAME="gjafakort-deadletter-queue"
MAX_RECEIVE_COUNT=5
ATTRIBUTES="{\"RedrivePolicy\": \"{\\\"deadLetterTargetArn\\\": \\\"arn:aws:sqs:$AWS_REGION:$ACCOUNT_ID:$DEAD_LETTER_QUEUE_NAME\\\", \\\"maxReceiveCount\\\": $MAX_RECEIVE_COUNT}\"}"
SQS_URL="http://localhost:4576/queue"


awslocal sns create-topic --name "$SNS_NAME"

awslocal sqs create-queue --queue-name "$DEAD_LETTER_QUEUE_NAME"
awslocal sqs create-queue --queue-name "$FERDALAG_QUEUE_NAME" --attributes "$ATTRIBUTES"
awslocal sqs create-queue --queue-name "$YAY_QUEUE_NAME" --attributes "$ATTRIBUTES"

awslocal sns subscribe \
             --topic-arn "$SNS_ARN" \
             --protocol sqs \
             --notification-endpoint "$SQS_URL/$FERDALAG_QUEUE_NAME"

awslocal sns subscribe \
             --topic-arn "$SNS_ARN" \
             --protocol sqs \
             --notification-endpoint "$SQS_URL/$YAY_QUEUE_NAME"
