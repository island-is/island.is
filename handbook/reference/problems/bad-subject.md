# 403 Bad Subject

The server will not process the request since the current subject claims don't have access.
This problem is different from `403 Forbidden` in that it indicates that the user might be able to switch to another subject to get access, e.g. using the delegation system. It can both mean that the user needs to switch to a specific delegation, or that they must switch from a delegation to the original authenticated user.

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
