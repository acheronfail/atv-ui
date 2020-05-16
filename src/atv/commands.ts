import { AppleTV } from 'node-appletv';

export async function closeInAppSwitcher(atv: AppleTV) {
  await atv.sendKeyCommand(AppleTV.Key.Up);
  await atv.sendKeyCommand(AppleTV.Key.Up);
  await atv.sendKeyCommand(AppleTV.Key.Up);
}

export async function appSwitcher(atv: AppleTV) {
  await atv.sendKeyCommand(AppleTV.Key.Home);
  await atv.sendKeyCommand(AppleTV.Key.Home);
}
