# Methods

Methods are operations a client can take on resources. Follow [resource-oriented design](resource-oriented-design.md) when developing methods for APIs. Emphasize resources (data model) over the methods performed on the resources (functionality). A typical resource-oriented API exposes a large number of resources with a small number of methods.

Most API services support the following 5 operations: `LIST`, `GET`, `CREATE`, `UPDATE`, and `DELETE` on all resources, also known as the **standard methods** ([CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete)). Create **custom methods** to provide a means to express arbitrary actions that are difficult to model using only the **standard methods**.

A photo album service, for example, may provide the following methods:

| Method                          | Resource                                                  |                                    |
| ------------------------------- | --------------------------------------------------------- | ---------------------------------- |
| `CREATE` _Creates a user_       | `//my-service.island.is/v1/users`                         | a collection of `User` resources   |
| `GET` _Gets a user_             | `//my-service.island.is/v1/users/:userId`                 | a single `User` resource           |
| `UPDATE` _Updates a user_       | `//my-service.island.is/v1/users/:userId`                 | a single `User` resource           |
| `LIST` _Lists photos of a user_ | `//my-service.island.is/v1/users/:userId/photos`          | a collection of `Photos` resources |
| `DELETE` _Deletes a photo_      | `//my-service.island.is/v1/users/:userId/photos/:photoId` | a single `Photo` resource          |

For obvious reasons, operations `CREATE` and `LIST` always work on a resource collection, and `GET`, `UPDATE` and `DELETE` on a single resource.
**Note:** _You should never define a method with no associated resource_.

## Methods mapping to HTTP verbs

In HTTP RESTful API services, each method must be mapped to an HTTP verb ([HTTP request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)).

The following table specifies the mappings between standard and custom methods and HTTP verbs:

| Method   | HTTP Request Method (Verb) |
| -------- | -------------------------- |
| `LIST`   | `GET`                      |
| `GET`    | `GET`                      |
| `CREATE` | `POST`                     |
| `UPDATE` | `PATCH`/`PUT`              |
| `DELETE` | `DELETE`                   |
| `Custom` | `POST` (usually)           |

## Custom methods

APIs should prefer standard methods over custom methods. However, in the real world there is often a need to provide custom methods. A custom method is an action that does not cleanly map to any of the standard methods. The way to add custom methods to your API is to nounify the action and make it a sub-resource.

### Example

An API has a `Message` resource and it provides the standard [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) methods like:

```text
GET    https://api.island.is/v1/messages
GET    https://api.island.is/v1/messages/{messageId}
POST   https://api.island.is/v1/messages
PUT    https://api.island.is/v1/messages/{messageId}
DELETE https://api.island.is/v1/messages/{messageId}
```

Then there is a requirement to provide a functionality to be able to archive and unarchive a single message and a batch of messages. The archiving and unarchiving of a single message is then provided by:

```text
POST   https://api.island.is/v1/messages/{messageId}/archives
DELETE https://api.island.is/v1/messages/{messageId}/archives
```

The batch archiving is provided by

```text
POST   https://api.island.is/v1/messages/archives
DELETE https://api.island.is/v1/messages/archives
```

_Note:_ The `POST` method accepts a list of message Ids in the request body.
