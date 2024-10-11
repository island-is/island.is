CHECKED IN VOLUNTARILY

To avoid a circular dependency we replicate the system-notification part of @island.is/clients/user-notification.

The user-notification service uses the delegation API to add Hnipp support for delegations by doing lookup in the delegation index..

With the new addition of the delegation API sending notifications when new delegations
get created we have a circular dependency since both services are now using the user-notification client.

To get around it we replicate the part of that client required to create system notifications here.
