/*
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is regenerated.
 */

import {
  env,
  Recorder,
  RecorderStartOptions,
  delay,
  isPlaybackMode,
} from "@azure-tools/test-recorder";
import { createTestCredential } from "@azure-tools/test-credential";
import { assert } from "chai";
import { Context } from "mocha";
import { AzureBotService } from "../src/azureBotService";

const replaceableVariables: Record<string, string> = {
  AZURE_CLIENT_ID: "azure_client_id",
  AZURE_CLIENT_SECRET: "azure_client_secret",
  AZURE_TENANT_ID: "88888888-8888-8888-8888-888888888888",
  SUBSCRIPTION_ID: "azure_subscription_id"
};

const recorderOptions: RecorderStartOptions = {
  envSetupForPlayback: replaceableVariables
};

export const testPollingOptions = {
  updateIntervalInMs: isPlaybackMode() ? 0 : undefined,
};

describe("Botservice test", () => {
  let recorder: Recorder;
  let client: AzureBotService;
  let subscriptionId: string;
  let location: string;
  let resourceGroup: string;
  let botresourceName: string;

  beforeEach(async function (this: Context) {
    recorder = new Recorder(this.currentTest);
    await recorder.start(recorderOptions);
    subscriptionId = env.SUBSCRIPTION_ID || '';
    // This is an example of how the environment variables are used
    const credential = createTestCredential();
    client = new AzureBotService(credential, subscriptionId, recorder.configureClientOptions({}));
    location = "global";
    resourceGroup = "myjstest";
    botresourceName = "mybotxxx";
  });

  afterEach(async function () {
    await recorder.stop();
  });

  it("bots create test", async function () {
    const res = await client.bots.create(resourceGroup, botresourceName, {
      sku: {
        name: "S1"
      },
      etag: "etag1",
      tags: {
        tag1: "value1",
        tag2: "value2"
      },
      kind: "sdk",
      properties: {
        description: "The description of the bot",
        developerAppInsightsApiKey: "w24iw5ocbhcig71su7ibaj63hey5ieaozeuwdv2r",
        developerAppInsightKey: "59513bad-10a7-4d41-b4d0-b1c34c6af52a",
        developerAppInsightsApplicationId: "cf03484e-3fdb-4b5e-9ad7-94bde32e5a2b",
        displayName: "this is a test bot",
        endpoint: "https://bing.com/messages/",
        msaAppId: "41a220b9-6571-4f0b-bbd2-43f1c1d82f51"
      },
      location: "global"
    });
    assert.equal(res.name, botresourceName);
  });

  it("bots get test", async function () {
    const res = await client.bots.get(resourceGroup, botresourceName);
    assert.equal(res.name, botresourceName);
  });

  it("MsTeamsChannel create test", async function () {
    const res = await client.channels.create(resourceGroup, botresourceName, "MsTeamsChannel", {
      location,
      properties: {
        channelName: "MsTeamsChannel",
        properties: {
          isEnabled: true,
        }
      }
    });
    assert.equal(res.name, "mybotxxx/MsTeamsChannel")
  });

  it("MsTeamsChannel get test", async function () {
    const res = await client.channels.get(resourceGroup, botresourceName, "MsTeamsChannel");
    assert.equal(res.name, "mybotxxx/MsTeamsChannel")
  });

  it("MsTeamsChannel list test", async function () {
    const resArray = new Array();
    for await (let item of client.channels.listByResourceGroup(resourceGroup, botresourceName)) {
      resArray.push(item);
    }
    assert.equal(resArray.length, 2);
  });

  it("MsTeamsChannel delete test", async function () {
    const res = await client.channels.delete(resourceGroup, botresourceName, "MsTeamsChannel");
    const resArray = new Array();
    for await (let item of client.channels.listByResourceGroup(resourceGroup, botresourceName)) {
      resArray.push(item);
    }
    assert.equal(resArray.length, 1);
  });

  it("bots delete test", async function () {
    const res = await client.bots.delete(resourceGroup, botresourceName);
    const resArray = new Array();
    for await (let item of client.bots.list()) {
      resArray.push(item);
    }
    assert.equal(resArray.length, 0);
  });
});
