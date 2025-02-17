/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const { ApiManagementClient } = require("@azure/arm-apimanagement");
const { DefaultAzureCredential } = require("@azure/identity");

/**
 * This sample demonstrates how to Performs a connectivity check between the API Management service and a given destination, and returns metrics for the connection, as well as errors encountered while trying to establish it.
 *
 * @summary Performs a connectivity check between the API Management service and a given destination, and returns metrics for the connection, as well as errors encountered while trying to establish it.
 * x-ms-original-file: specification/apimanagement/resource-manager/Microsoft.ApiManagement/stable/2021-08-01/examples/ApiManagementPerformConnectivityCheckHttpConnect.json
 */
async function httpConnectivityCheck() {
  const subscriptionId = "subid";
  const resourceGroupName = "rg1";
  const serviceName = "apimService1";
  const connectivityCheckRequestParams = {
    destination: { address: "https://microsoft.com", port: 3306 },
    protocolConfiguration: {
      httpConfiguration: {
        method: "GET",
        headers: [{ name: "", value: "" }],
        validStatusCodes: [200, 204],
      },
    },
    source: { region: "northeurope" },
    protocol: "HTTPS",
  };
  const credential = new DefaultAzureCredential();
  const client = new ApiManagementClient(credential, subscriptionId);
  const result = await client.beginPerformConnectivityCheckAsyncAndWait(
    resourceGroupName,
    serviceName,
    connectivityCheckRequestParams
  );
  console.log(result);
}

httpConnectivityCheck().catch(console.error);

/**
 * This sample demonstrates how to Performs a connectivity check between the API Management service and a given destination, and returns metrics for the connection, as well as errors encountered while trying to establish it.
 *
 * @summary Performs a connectivity check between the API Management service and a given destination, and returns metrics for the connection, as well as errors encountered while trying to establish it.
 * x-ms-original-file: specification/apimanagement/resource-manager/Microsoft.ApiManagement/stable/2021-08-01/examples/ApiManagementPerformConnectivityCheck.json
 */
async function tcpConnectivityCheck() {
  const subscriptionId = "subid";
  const resourceGroupName = "rg1";
  const serviceName = "apimService1";
  const connectivityCheckRequestParams = {
    destination: { address: "8.8.8.8", port: 53 },
    preferredIPVersion: "IPv4",
    source: { region: "northeurope" },
  };
  const credential = new DefaultAzureCredential();
  const client = new ApiManagementClient(credential, subscriptionId);
  const result = await client.beginPerformConnectivityCheckAsyncAndWait(
    resourceGroupName,
    serviceName,
    connectivityCheckRequestParams
  );
  console.log(result);
}

tcpConnectivityCheck().catch(console.error);
