/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const { AzureVMwareSolutionAPI } = require("@azure/arm-avs");
const { DefaultAzureCredential } = require("@azure/identity");

/**
 * This sample demonstrates how to List private clouds in a subscription
 *
 * @summary List private clouds in a subscription
 * x-ms-original-file: specification/vmware/resource-manager/Microsoft.AVS/stable/2022-05-01/examples/PrivateClouds_ListInSubscription.json
 */
async function privateCloudsListInSubscription() {
  const subscriptionId = "00000000-0000-0000-0000-000000000000";
  const credential = new DefaultAzureCredential();
  const client = new AzureVMwareSolutionAPI(credential, subscriptionId);
  const resArray = new Array();
  for await (let item of client.privateClouds.listInSubscription()) {
    resArray.push(item);
  }
  console.log(resArray);
}

privateCloudsListInSubscription().catch(console.error);

/**
 * This sample demonstrates how to List private clouds in a subscription
 *
 * @summary List private clouds in a subscription
 * x-ms-original-file: specification/vmware/resource-manager/Microsoft.AVS/stable/2022-05-01/examples/PrivateClouds_ListInSubscription_Stretched.json
 */
async function privateCloudsListInSubscriptionStretched() {
  const subscriptionId = "00000000-0000-0000-0000-000000000000";
  const credential = new DefaultAzureCredential();
  const client = new AzureVMwareSolutionAPI(credential, subscriptionId);
  const resArray = new Array();
  for await (let item of client.privateClouds.listInSubscription()) {
    resArray.push(item);
  }
  console.log(resArray);
}

privateCloudsListInSubscriptionStretched().catch(console.error);
