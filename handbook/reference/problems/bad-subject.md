# 403 Bad Subject

The server will not process the request since the current subject claims don't have access.
This problem is different from `403 Forbidden` in that it indicates that the user might be able to switch to another subject to get access, e.g. using the delegation system. It can both mean that the user needs to switch to a specific delegation, or that they must switch from a delegation to the original authenticated user.

### `alternativeSubjects`

A optional field. If it is not returned it can be used as a hint that the resource trying to be accessed does not support delegations. It is used this way when users enter applications as a subject in applicaitons that do not support delegations.
When alternativeSubjects is returned it is an array of objects containing nationalIds of users that that have access to the resource. This should only be returned if the user is marked as an actor on the resource being requested or has delegation rights to the alternative subject being hinted at.

## Example

```
400 Bad Subject
Content-Type: application/problem+json

{
  "type": "https://docs.devland.is/reference/problems/bad-subject",
  "title": "Bad Subject",
  "status": 403,
  "detail": "Forbidden. User has subject for resource and needs to delegate",
  "alternativeSubjects": [
    {
      "nationalId": "000000-0000"
    }
  ]
}
```
