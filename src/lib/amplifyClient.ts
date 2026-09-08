"use client";

import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import outputs from "../../amplify_outputs.json";

Amplify.configure(outputs);

export type DataClient = ReturnType<typeof generateClient<Schema>>;

let client: DataClient | null | undefined;

/**
 * Returns null when the data backend is not configured (a frontend-only build,
 * or a sandbox that has not been deployed). Callers fall back to local state so
 * the courseware still works — see ProgressProvider.
 */
export function getDataClient(): DataClient | null {
  if (client === undefined) {
    try {
      client = generateClient<Schema>();
    } catch {
      client = null;
    }
  }
  return client;
}

/** YYYY-MM-DD in UTC — the partition key for activity rollups. */
export function utcDay(iso: string): string {
  return iso.slice(0, 10);
}
