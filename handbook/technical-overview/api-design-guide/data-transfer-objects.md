# Data Transfer Objects

Data transfer objects, or DTOs, are objects used to wrap resource definitions in request/response objects along with additional information.

In a response body, you should return a JSON object, not an array, as a top level data structure to support future extensibility. This would allow you to extend your response and, for example, add a server side pagination attribute.

**Bad response body**

```text
[
  { "id": "1", "name": "Einar"   },
  { "id": "2", "name": "Erlendur"},
  { "id": "3", "name": "Valdimar"}
]
```

**Good response body**

```text
{
  "users":[
    { "id": "1001", "name": "Einar"},
    { "id": "1002", "name": "Erlendur"},
    { "id": "1003", "name": "Valdimar"},
  ]
}
```
