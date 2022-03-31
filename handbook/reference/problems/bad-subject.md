# 403 Bad Subject

The server will not process the request due to validation issues around actor delegations.
This error should be thrown when a user (actor) tries to access a resource that they do not have access to but someone they have delegation rights for (subject) has access to.
The error should contain the national id of the subject that is assigned to the resource and the types of delegations the actor has for the subject.
Handling this error could then involve allowing the user to delegate to the subject assigned to the resource so that they can access it as an actor.

### `fields`

A JSON object where delegatedUser is the national id of the subject that is assigned to the resource that the actor is trying to access.
The delegations array contains delegations that the actor has for the subject assigned to the resource.
The delegation object contains the name of the subject, the subject's national id as well as the type of delegation the actor has for the subject.

## Example

```
400 Actor Validation Failed
Content-Type: application/problem+json

{
  "type": "https://docs.devland.is/reference/problems/actor-validation-failed",
  "title": "Actor Validation Failed",
  "status": 400,
  "detail": "Resource forbidden. User has not delegated to correct user",
  "fields": {
    delegatedUser: "000000-0000",
    delegations: [
      {
        name: "Gervimaður",
        nationalId: "000000-0000",
        type: "LegalGuardian",
      },
      {
        name: "Gervimaður",
        nationalId: "000000-0000",
        type: "Custom",
      },
    ],
  }
}
```
