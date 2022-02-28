# 400 Actor Validation Failed

The server will not process the request due to validation issues around actor delegations.

The client can try again after delegating to correct delegation.

## Extra metadata

### `fields`

A JSON object listing validation issues where delegatedUser is the nationalId of the user assigned to the resource that the actor is a and actor is the nationalId of the user trying to access the resource.


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
    actor: "111111-1111"
  }
}
```
