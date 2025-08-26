# Templates

## Pruning notifications

If desired it is possible to have a custom message sent to an application's applicant when it is pruned.
This is done by adding a `pruneMessage` object of type `PruningNotification` or a function returning a `PruningNotification` to the application's lifecycle configuration.
When executed, the function will be passed an argument that is a `PruningApplication` object which contains the application's data. The `PruningNotification` object has `externalBody`, `internalBody` and `notificationTemplateId`. The former two can be used to fill in the values for the `externalBody` and `internalBody` template variables in the notification that will be sent to the user.
The `notificationTemplateId` is the id of the notification template that will be used to send the notification.
It is up to the user whether to use the body variables or not.

For example an application might want to send a notification when an application that was in the draft stage was pruned. Here is an example of how that might be accomplished in the application template:

```typescript
stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: application.general.name.defaultMessage,
          lifecycle: defaultLifecycleWithPruneMessage((application: PruningApplication) => ({
            externalBody: `Application has been in draft for more than 30 days and has been pruned.`,
            internalBody: `Application for ${application.externalData.nationalRegistry.data.fullName} has been in draft for more than 30 days. Please note that if desired the application may be re-submitted.`,
            notificationTemplateId: 'HNIPP.AS.*',
          })),
          status: 'draft',
        },
      },
    },
  },
```

### Testing pruning notifications locally

To test locally you'll need to proxy the user notifiction service on you local system.

Here's how to do that:

- Add the following line to your .envrc.private file: `export USER_NOTIFICATION_API_URL=http://localhost:8088`

- Make sure your terminal has an active AWS SSO session see [here](https://docs.devland.is/development/aws-secrets) and more info [here](https://www.notion.so/Onboarding-Tips-and-Tricks-c1e89b284db44e06947af9fc258dd88f#1835a76701d680c1b50acd2b5fb7e786)

- Start your port forwarding with the following command `kubectl port-forward -n user-notification service/user-notification 8088:80`

- To test pruning you must run the api worker once the test application has expired, that means you'll want to set the whenToPrune field to just a couple of seconds and then you can run `yarn nx run application-system-api:worker` to perform the pruning.

- You can then log into the [notifications page](https://beta.dev01.devland.is/minarsidur/min-gogn/tilkynningar) for the user you used to create the application to check if the message has arrived.

Please note that messages can sometimes take severaly minutes to make their way through the system so just because you don't see your message right away that does not necessarily mean there was a problem.

Finally here is a link to the [HNIPP section on devland](https://docs.devland.is/products/notifications-hnipp)

## Mocking XROAD endpoints with Mockoon for templates

### Prerequisites

Since the requests from the services we are running locally default to making their calls on port `8081`so the mock will be listening on port `8081`. This means the port forwarding for xroad needs to be listening on port `8082` (or some other port) and then we will set the mock server will forward requests it does not have mock responses for to that port.

To set the port forwarding to listen on port `8082` you can pass a port argument to the proxies script like so `yarn proxies xroad --p 8082`. Alternatively if you use kubectl and socat just replace `8081:80` with `8082:80`.

### How to

The mockoon CLI is a dev dependency so it should be installed along with everything else when you `yarn`. When you want to use the mockoon-cli you simply call `mockoon-cli start --data <path to capture file>`. The capture file can be one you made yourself (see below) or some applications have mock files already created for them, in which case they can be found under `libs/application/<application name>/mockData`.

Mockoon should now be listening on port `8081` and proxying non-mocked traffic to port `8082`.

For more in-depth instructions, you can check out the [mockoon site](https://mockoon.com/cli/).

### Mockoon app

It is very much recommended to install the [Mockoon app](https://mockoon.com/download/) as that allows you to both capture new mock data, select which endppoints should be mocked or even modify the mocked payloads to name a few things.

### Current mocks

If mockdata is available for an application it should be in the mockData directory in the application in question (see above under how to). If you create mock data for an application that doesn't have any, consider adding it under the appropriate directory.

## Q&A

### What if I need to call an endpoint that isn't mocked

No problem, mockoon will transparently proxy whatever requests it does not have mocks for.

### What if I want to get an actual response from an endpoint being mocked

Find the endpoint in question in the `Routes` panel, click on the three little dots in the upper right corner of the route entry and select `Toggle`. This will cause any incoming requests to be proxied rather than mocked.

### What if I want to update the mocked data for an endpoint

The simplest way is to delete the existing endpoint by finding it in the routes list as above but selecting `Delete` instead of `Toggle`, turning on the recording function by clicking the little dot in the `Logs` tab above the request list and then performing a call to the underlying endpoint. You can also toggle the endpoint mock off as described above, do a call to the endpoint, find the log for that call in the logs tab and simply copy over the returned data.

### My calls aren't being mocked

The mocks are currently set up for the Gervimaður Færeyjar fake person. If you need to mock other fake persons, you can download the [mockoon app](https://mockoon.com/download/) and either open the applicable collection or start your own with [automocking](https://mockoon.com/docs/latest/logging-and-recording/auto-mocking-and-recording/).

### Does the mocking proxy only respond with mocks when the proxied service is down?

No, one of the benefits of mocking locally is a significantly shorter response time, and to achieve that, it's necessary to use mocks even if the underlying service is operational. If you want to send calls to the proxied endpoint you can toggle the mock off in the `Routes` tab.
