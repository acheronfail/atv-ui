import path from 'path';
import fs from 'fs-extra';
import { Credentials, parseCredentials } from 'node-appletv';

export async function getCredentials(): Promise<Credentials> {
  const credentialsFile = path.join(process.cwd(), '.credentials.json');
  return parseCredentials(await fs.readJson(credentialsFile));
}
