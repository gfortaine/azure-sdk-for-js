# Azure Web PubSub Client

[Azure Web PubSub service](https://aka.ms/awps/doc) is an Azure-managed service that helps developers easily build web applications with real-time features and publish-subscribe pattern. Any scenario that requires real-time publish-subscribe messaging between server and clients or among clients can use Azure Web PubSub service. Traditional real-time features that often require polling from server or submitting HTTP requests can also use Azure Web PubSub service.

You can use this library in your client side to manage the WebSocket client connections, as shown in below diagram:

![overflow](https://user-images.githubusercontent.com/668244/140014067-25a00959-04dc-47e8-ac25-6957bd0a71ce.png)

Details about the terms used here are described in [Key concepts](#key-concepts) section.

[API reference documentation](https://aka.ms/awps/sdk/js) |
[Product documentation](https://aka.ms/awps/doc) |
[Samples][samples_ref]

## Getting started

### Currently supported environments

- [LTS versions of Node.js](https://nodejs.org/about/releases/)

### Prerequisites

- An [Azure subscription][azure_sub].
- An existing Azure Web PubSub endpoint.

### 1. Install the `@azure/web-pubsub-client` package

```bash
npm install @azure/web-pubsub-client
```

### 2. Authenticate the client

Client uses a Client Access URL to connect and authenticate with the service. The URL follow the patten as `wss://<service_name>.webpubsub.azure.com/client/hubs/<hub_name>?access_token=<token>`. The client has some different ways to get Client Access URL. As a quick start, you can copy and paste from Azure Portal, and for production, you usually need a negotiation server to generate the URL.

#### Use Client Access URL from Azure Portal

As a quick start, you can go to the Portal and copy the **Client Access URL** from **Key** blade.

![get_client_url](https://learn.microsoft.com/azure/azure-web-pubsub/media/howto-websocket-connect/generate-client-url.png)

As shown in the diagram, the client will be granted the permission of sending message to the specific group and joining the specific group. Learn more about client permission, see [permissions](https://learn.microsoft.com/azure/azure-web-pubsub/reference-json-reliable-webpubsub-subprotocol#permissions)

```js
const { WebPubSubClient } = require("@azure/web-pubsub-client");

const client = new WebPubSubClient("<<client-access-url>>");

await client.start();
```

#### Use negotiation server to generate Client Access URL

In production, client usually fetch Client Access URL from a negotiation server. The server holds the connection string and generates Client Access URL through `@azure/web-pubsub`.

The code snippet below is an example of negotiation server. The server exposes a `/negotiate` path and return the Client Access URL.

```js
const express = require('express');
const { WebPubSubServiceClient } = require('@azure/web-pubsub');

const app = express();
const hubName = 'sample_chat';
const port = 8080;

const serviceClient = new WebPubSubServiceClient("<<web-pubsub-connectionstring>>", "hubName");

app.get('/negotiate', async (req, res) => {
  let token = await serviceClient.getClientAccessToken({roles: ["webpubsub.joinLeaveGroup", "webpubsub.sendToGroup"] });
  res.json({
    url: token.url
  });
});

app.use(express.static('dist'));
app.listen(port, () => console.log(`Event handler listening at http://localhost:${port}/negotiate`));
```

The code snippet below is the example of client side.

```js
const { WebPubSubClient } = require("@azure/web-pubsub-client")

const client = new WebPubSubClient({
  getClientAccessUrl: async _ => {
    let value = await (await fetch(`/negotiate`)).json();
    return value.url;
  }
});

await client.start();
```

For the full code samples, please reach to [samples-browser](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/web-pubsub/web-pubsub-client/samples-browser)

### Join group and send message to group

The client can only receive messages from groups that it has joined and you need to add a callback to specify the logic when receiving messages.

```js
client.on("group-message", (e) => {
  console.log(`Received message: ${e.message.data}`);
});

let groupName = "group1";

// client need to join group to receive messages from the group.
await client.joinGroup(groupName);

// send a message to group
await client.sendToGroup(groupName, "hello world", "text");
```

## Key concepts

### Connection

A connection, also known as a client or a client connection, represents an individual WebSocket connection connected to the Web PubSub service. When successfully connected, a unique connection ID is assigned to this connection by the Web PubSub service.

### Recovery

If using reliable protocols, a new WebSocket tries to establish using the connection ID of the lost connection. If the new WebSocket connection is successfully connected, the connection is recovered. And all group contexts will be recovered, and unreceived messages will be resent. If the service returns WebSocket error code `1008` or the recovery attemption lasts more than 30 seconds, the recovery fails.

### Reconnect

Reconnection happens when client connection drops and fails to recover. Reconnection just like a new connection which has a new connection ID. After reconnection, the group context or unreceived messages are lost. Client connection needs to rejoin groups. By default, client library rejoin group after reconnection.

### Hub

A hub is a logical concept for a set of client connections. Usually you use one hub for one purpose, for example, a chat hub, or a notification hub. When a client connection is created, it connects to a hub, and during its lifetime, it belongs to that hub. Different applications can share one Azure Web PubSub service by using different hub names.

### Group

A group is a subset of connections to the hub. You can add a client connection to a group, or remove the client connection from the group, anytime you want. For example, when a client joins a chat room, or when a client leaves the chat room, this chat room can be considered to be a group. A client can join multiple groups, and a group can contain multiple clients.

### User

Connections to Web PubSub can belong to one user. A user might have multiple connections, for example when a single user is connected across multiple devices or multiple browser tabs.

## Client Lifetime

Each of the Web PubSub client is safe to cache and use as a singleton for the lifetime of the application. The registered event callbacks share the same lifetime with the client. Which means you can add or remove callbacks at anytime and the registration status won't change after reconnection or even stopping the client.

## Examples

### Specify subprotocol

You can change the subprotocol to be used in client. By default, the client uses `json.reliable.webpubsub.azure.v1`. In library, you can choose to use `json.reliable.webpubsub.azure.v1` or `json.webpubsub.azure.v1`.

```js
// Change to use json.webpubsub.azure.v1
const client = new WebPubSubClient("<client-access-url>", { protocol: WebPubSubJsonProtocol() });
```

```js
// Change to use json.reliable.webpubsub.azure.v1
const client = new WebPubSubClient("<client-access-url>", { protocol: WebPubSubJsonReliableProtocol() });
```

### Consume messages from server and from groups

Client can add callbacks to consume messages from server and from groups. Please note, client can only receive group messages that it has joined.

```js
client.on("server-message", (e) => {
  console.log(`Received message ${e.message.data}`);
});

client.on("group-message", (e) => {
    console.log(`Received message from ${e.message.group}: ${e.message.data}`);
});
```

### Add callbacks for connected, disconnected and stopped events

When a client connection is connected to the service, the `connected` event is triggered once it received the connected message from the service.

```js
client.on("connected", (e) => {
  console.log(`Connection ${e.connectionId} is connected.`);
});
```

When a client connection is disconnected and fails to recover, the disconnected event is triggered.

```js
client.on("disconnected", (e) => {
  console.log(`Connection disconnected: ${e.message}`);
});
```

When a client is stopped, which means the client connection is disconnected and the client stops try to reconnect, the stopped event will be triggered. This usually happens after the `client.stop()` is called, or disabled `autoReconnect` or specify a limited reconnect retry count and the limit has reached. If you want to restart the client, you can call `client.start()` in the stopped event.

```js
client.on("stopped", _ => {
  console.log(`Client has stopped`);
});
```

### Auto rejoin group and handle rejoin failure

When a client connection has dropped and fails to recover, all group context will be clean up in the service side. That means when the client reconnects, it needs to rejoin groups. By default, the client enabled `autoRejoinGroup` options. However, this feature has limitation. The client can only rejoin groups that it's originally joined by then client rather than joined by server side. And rejoin group operations may fail due to various reason, e.g. the client don't have the permission to join group. In such case, uses need to add a callback to handle the failure.

```js
// By default autoRejoinGroups=true. You can disable it by setting to false.
const client = new WebPubSubClient("<client-access-url>", { autoRejoinGroups: true });

client.on("rejoin-group-failed", e => {
  console.log(`Rejoin group ${e.group} failed: ${e.error}`);
})
```

### Operation and retry

By default, the operation like `client.joinGroup()`, `client.leaveGroup()`, `client.sendToGroup()`, `client.sendEvent()` has three reties. You can use `messageRetryOptions` to change. If all retries have failed, an error will be thrown. You can keep retry by pass in the same `ackId` as previous retries, thus the service can help to deduplicate the operation with the same `ackId`

```js
try {
  await client.joinGroup(groupName);
} catch (err) {
  let id = null;
  if (err instanceof SendMessageError) {
    id = err.ackId;
  }
  await client.joinGroup(groupName, {ackId: id});
}
```

## Troubleshooting

### Enable logs

You can set the following environment variable to get the debug logs when using this library.

- Getting debug logs from the SignalR client library

```bash
export AZURE_LOG_LEVEL=verbose
```

For more detailed instructions on how to enable logs, you can look at the [@azure/logger package docs](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/core/logger).

### Live Trace

Use **Live Trace** from the Web PubSub service portal to view the live traffic.

## Next steps

Please take a look at the
[samples][samples_ref]
directory for detailed examples on how to use this library.

## Contributing

If you'd like to contribute to this library, please read the [contributing guide](https://github.com/Azure/azure-sdk-for-js/blob/main/CONTRIBUTING.md) to learn more about how to build and test the code.

## Related projects

- [Microsoft Azure SDK for Javascript](https://github.com/Azure/azure-sdk-for-js)

[azure_sub]: https://azure.microsoft.com/free/
[samples_ref]: https://github.com/Azure/azure-webpubsub/tree/main/samples/javascript/
