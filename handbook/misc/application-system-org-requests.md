# Guide: Enable Organisations to Make Requests to an Application

This document describes how you can go enable an orginization to interact with the application system.

## Prerequisites

For an orginasation to be able to able to read/update an application the setup is as follows

1. Create a connection between their x-road server (handled by the institution) and our x-road server (handled by [Andes](https://github.com/orgs/island-is/teams/andes))
2. Create a new client In the IDS with:
   - Machine Client type
   - client claims prefix: `client_`
   - relevant scopes `application:read` and/or `application:write`
   - claim with key: nationalId and The orginasation's national Id as value

This client can be created in the [IDS admin panel](https://beta.dev01.devland.is/admin) on dev using Gervimaður Útlönd 010-7789. For Staging and Prod a make request on #ids_changes

## Orginization and Application Interaction

### 1. Add and map a role for the Orginization

In the Application template map the orginasation's nationalId like so

```typescript
  mapUserToRole(
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    ...
    if (id === 'xxxxxx-xxxx') { // The nationalId added as claim in the Ids earlier.
      return Roles.ORGINISATION_REVIEWER
    }
    ...
  },
```

### 2. Create an interaction state for the orginisation

For the org to be able to interact we need to add the role permission to a relevant state for the them to interact with the application.

Add an entry action:

```typescript
stateMachineOptions: {
  actions: {
    assignToInstitution: assign((context) => {
      const { application } = context
      const institution_ID = 'xxxxxx-xxxx'

      set(application, 'assignees', [institution_ID])

      return context
    })
  }
}
```

An example of an approve/reject state from an orginisation. Add your state with entry and exit that handles the assign of the institution

```typescript
  [States.ORGINISATION_APPROVAL]: {
    entry: 'assignToInstitution',
    exit: ['clearAssignees'], //ideally you would clear the assignees here
    meta: {
        name: States.ORGINISATION_APPROVAL,
        ...
        roles: [
        ...
        {
            id: Roles.ORGINISATION_REVIEWER,
            formLoader: () =>
            import('../forms/InReview').then((val) =>
                Promise.resolve(val.InReview),
            ),
            read: 'all',
            write: 'all',
        },
        ...
        ],
    },
    on: {
        [DefaultEvents.APPROVE]: { target: States.APPROVED },
        [DefaultEvents.REJECT]: { target: States.REJECT },
    },
```

### 3. Originisation API requests

To invoke a state change the machine client would for approving make a PUT request like so:

```c
curl --location -g --request PUT '{{baseUrl}}/applications/{applicationId}/submit' \
--header 'authorization: xxx' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-raw '{
  "event": "APPROVE",
  "answers": {},
  "message": ""
}'
```

#### Postman local testing setup

Log in to the [IDS admin panel](https://beta.dev01.devland.is/admin) on dev using Gervimaður Útlönd 010-7789. Find the client you created earlier, create a new secret and copy it to your clipboard:

![image](https://user-images.githubusercontent.com/2643113/175304337-82ce024c-4215-4de1-a09e-e28cce2082b9.png)

Choose Oauth 2.0 and use the settings below. Insert your Client id, client secret and the Scope should be `@island.is/applications:read @island.is/applications:write` press "Get New Access Token" and you have your token.

![image](https://user-images.githubusercontent.com/2643113/175303853-67c0e573-8ddf-4026-893d-d351fdf09432.png)
