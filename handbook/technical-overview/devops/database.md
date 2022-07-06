# Database

We use Sequelize as an ORM for our database.

## Setup

To set up Sequelize in your backend service take a look at [reference-backend](https://github.com/island-is/island.is/tree/main/apps/reference-backend).

## Read replicas

You can enable an application to use read replicas to reduce the load of the
database. A read replica is an exact matching replica of your current database
that is kept in sync with the original one. This replica is read only and thus
called a read replica while the original database allows writes and is called
a writer. There can only be one writer but there can be many read replicas.

We can configure Sequelize to use read replicas, it handles the logic of sending
all the read commands to the read replicas instead of the writer.

All we need to do is add the connection config for the readers. AWS provides us
with a single host name for all of the read replicas. AWS directs the connecting
server to an available read replica.

Edit your `sequelize.config.js` and setup the replication object like this:

```javascript
{
  production: {
    replication: {
      read: [
        {
          host: process.env.DB_REPLICAS_HOST,
          username: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_NAME,
        },
      ],
      write: {
        host: process.env.DB_HOST,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
      },
    },
  }
}
```

By default Sequelize creates a connection with each of the hosts in the config
file and keeps the connection alive as long as possible. That's usually fine but
because of autoscaling this usually results in a very uneven distribution of
connections between the readers.

To handle that we can recycle the connections periodically. Change
`sequelizeConfig.service.ts` and pass in the `recycleConnections` property like
this:

```javascript
  getOptions({ recycleConnections: true }),
```
