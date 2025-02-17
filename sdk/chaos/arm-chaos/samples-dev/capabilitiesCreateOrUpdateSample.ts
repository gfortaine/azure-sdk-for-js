/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { Capability, ChaosManagementClient } from "@azure/arm-chaos";
import { DefaultAzureCredential } from "@azure/identity";

/**
 * This sample demonstrates how to Create or update a Capability resource that extends a Target resource.
 *
 * @summary Create or update a Capability resource that extends a Target resource.
 * x-ms-original-file: specification/chaos/resource-manager/Microsoft.Chaos/preview/2022-10-01-preview/examples/CreateOrUpdateACapability.json
 */
async function createOrUpdateACapabilityThatExtendsAVirtualMachineTargetResource() {
  const subscriptionId = "6b052e15-03d3-4f17-b2e1-be7f07588291";
  const resourceGroupName = "exampleRG";
  const parentProviderNamespace = "Microsoft.Compute";
  const parentResourceType = "virtualMachines";
  const parentResourceName = "exampleVM";
  const targetName = "Microsoft-VirtualMachine";
  const capabilityName = "Shutdown-1.0";
  const capability: Capability = {};
  const credential = new DefaultAzureCredential();
  const client = new ChaosManagementClient(credential, subscriptionId);
  const result = await client.capabilities.createOrUpdate(
    resourceGroupName,
    parentProviderNamespace,
    parentResourceType,
    parentResourceName,
    targetName,
    capabilityName,
    capability
  );
  console.log(result);
}

createOrUpdateACapabilityThatExtendsAVirtualMachineTargetResource().catch(
  console.error
);
