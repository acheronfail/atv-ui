import path from 'path';
import fs from 'fs-extra';
import { Credentials, parseCredentials } from 'node-appletv';

export async function getCredentials(): Promise<Credentials> {
  const credentialsFile = path.join(process.cwd(), '.credentials.json');
  const credentialsList: string[] = await fs.readJson(credentialsFile);
  const credentials = credentialsList.map(parseCredentials);

  return credentials[0];
}
