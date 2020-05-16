import { Credentials, AppleTV, scan } from 'node-appletv';

export async function connect(credentials: Credentials): Promise<AppleTV> {
  const [device] = await scan(credentials.uniqueIdentifier);
  await device.openConnection();
  return device;
}
