# HTTP Status Response Codes

Try to minimize the number of HTTP status codes a REST API returns. When more details are needed in a error response use application defined errors and supply them in a response error object, described in the [errors](errors.md) document.

For each HTTP method, you should try to use only status codes marked with **X** in the following table.

| Code | Meaning      | GET | POST | PUT | PATCH | DELETE |
| ---- | ------------ | --- | ---- | --- | ----- | ------ |
| 200  | OK           | X   |      | X   | X     | X      |
| 201  | Created      |     | X    |     |       |        |
| 204  | No Content   |     |      | X   | X     | X      |
| 400  | Bad Request  |     | X    | X   | X     |        |
| 401  | Unauthorized | X   | X    | X   | X     | X      |
| 403  | Forbidden    | X   | X    | X   | X     | X      |
| 404  | Not Found    | X   |      | X   | X     |        |
| 500  | Server error | X   | X    | X   | X     | X      |

## General

- `401` should be returned when client fails to authenticate.
- `403` should be returned when client is authenticated but does not have necessary permission to perform the operation.
- `500` should be returned when the server encounters some unexpected error, preferably along with an [errors](errors.md) object.

## `GET`

For retrieving a resource or a collection of resources

- `200` should be returned on success. If a collection asked for is empty, `200` is still to be returned.
- `404` should be returned when a resource asked for is not found.

## `POST`

For creating a resource

- `201` should be returned if the resource was created. The response body should contain a resource identifier to the created resource.
- `400` should be returned if the request is invalid, i.e. the resource already exists or contains invalid fields.

## `PUT`

For updating a existing resource

- `200` should be returned after a successful execution, when there is a need for content in the response.
- `204` should be returned after a successful execution, as usually there is no need for content in the response.
- `400` should be returned if the request is invalid, i.e. the resource contains invalid fields.
- `404` should be returned if the resource to be updated is not found.

## `PATCH`

For making a partial update on a resource

- `200` should be returned after a successful execution, when there is a need for content in the response.
- `204` should be returned after a successful execution, as usually there is no need for content in the response.
- `400` should be returned if the request is invalid, i.e. the resource contains invalid fields.
- `404` should be returned if the resource to be updated is not found.

## `DELETE`

For removing a resource

- `200` can be returned after a successful execution, when there is a need for a content in the response.
- `204` should be returned after a successful execution **Note:** If a client asks for the removal of a resource already deleted. `204` should be returned, **not** `404`, because clients usually do not care if a resource was previously deleted.
