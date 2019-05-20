// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { MessageTypes, MessageExtrinsicSign } from '@polkadot/extension/background/types';
import { KeyringJson } from '@polkadot/ui-keyring/types';
import { KeypairType } from '@polkadot/util-crypto/types';

let idCounter = 0;

function sendMessage (message: MessageTypes, request: any = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const id = ++idCounter;

    chrome.runtime.sendMessage({ id, message, request }, ({ error, response }) => {
      if (error) {
        reject(new Error(error));
      } else {
        resolve(response);
      }
    });
  });
}

export async function getAccounts (): Promise<Array<KeyringJson>> {
  return sendMessage('accounts.list');
}

export async function getRequests (): Promise<Array<[number, MessageExtrinsicSign, string]>> {
  return sendMessage('signing.requests');
}

export async function cancelRequest (id: number): Promise<boolean> {
  return sendMessage('signing.cancel', { id });
}

export async function approveRequest (id: number, password: string): Promise<boolean> {
  return sendMessage('signing.approve', { id, password });
}

export async function createAccount (name: string, password: string, suri: string, type?: KeypairType): Promise<boolean> {
  return sendMessage('accounts.create', { name, password, suri, type });
}

export async function createSeed (length?: number, type?: KeypairType): Promise<{ address: string, seed: string }> {
  return sendMessage('seed.create', { length, type });
}

export async function validateSeed (seed: string, type?: KeypairType): Promise<{ address: string, seed: string }> {
  return sendMessage('seed.validate', { seed, type });
}
