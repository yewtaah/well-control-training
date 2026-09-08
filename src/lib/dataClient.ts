"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

/**
 * Lazily created so that importing this module does not require Amplify to be
 * configured yet — configuration happens in AuthenticatedApp.
 */
let client: ReturnType<typeof generateClient<Schema>> | undefined;

export function getClient() {
  if (!client) {
    client = generateClient<Schema>();
  }
  return client;
}

export type { Schema };
