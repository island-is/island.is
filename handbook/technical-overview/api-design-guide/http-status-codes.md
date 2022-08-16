# REST Response

A REST API should use an appropriate HTTP Status Code and Content Type when responding to a client's request.

## Content Type

An API can support multiple response content types. It's preferred to use a JSON content by default.
When an API supports multiple content types the client can specify the desired content type by using the
[`Accept` header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept).

The following table shows a list of common content types:

| Content Type                                                            | Description                                                                                    |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| [application/json](https://www.rfc-editor.org/rfc/rfc8259)              | **Default.** Content type for a JSON response body.                                            |
| [application/problem+json](https://www.rfc-editor.org/rfc/rfc7807.html) | Content type for the [Problem JSON error object](errors.md) for `4xx` and `5xx` statuse codes. |
| [application/xml](https://www.rfc-editor.org/rfc/rfc7303#section-9.1)   | Content type for a XML response body.                                                          |
| [text/xml](https://www.rfc-editor.org/rfc/rfc7303#section-9.2)          | Same as the `application/xml` except for the type name is `'xml'`                              |

{% hint style="info" %}
When more details are needed in an error response the API should use an application
defined errors and supply them in an [error object](errors.md) in the response body.
{% endhint %}

## HTTP Status Codes

A developer is encouraged to use the range of [`HTTP Status Codes`](https://httpstatuses.org/) to give the clients
the mot appropriate result of the request processing.

An API should at least use the following HTTP Status Codes for correspanding HTTP methods:

| Code | Meaning      | GET | POST | PUT | PATCH | DELETE |
| ---- | ------------ | :-: | :--: | :-: | :---: | :----: |
| 200  | OK           |  X  |      |  X  |   X   |   X    |
| 201  | Created      |     |  X   |     |       |        |
| 204  | No Content   |     |      |  X  |   X   |   X    |
| 303  | See Other    |     |  X   |     |       |        |
| 400  | Bad Request  |     |  X   |  X  |   X   |        |
| 401  | Unauthorized |  X  |  X   |  X  |   X   |   X    |
| 403  | Forbidden    |  X  |  X   |  X  |   X   |   X    |
| 404  | Not Found    |  X  |      |  X  |   X   |        |
| 500  | Server error |  X  |  X   |  X  |   X   |   X    |

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
- `303` should be returned if the resource already exists on the resource server. The reponse should
  contain the [`Location`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location) header with the URI of the existing resource.
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
