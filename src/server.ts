import Koa, { Context } from 'koa';
import Router from '@koa/router';
import { getCredentials } from './atv/credentials';
import { connect } from './atv/connect';
import { AppleTV } from 'node-appletv';
import { ExtraCommand } from './types';
import { appSwitcher, closeInAppSwitcher } from './atv/commands';
import KoaStatic from 'koa-static';
import KoaLogger from 'koa-logger';

export async function getCommand(ctx: Context) {
  const { command } = ctx.params;
  const isKey = command in AppleTV.Key;
  const isCommand = command in ExtraCommand;

  if (!command || (!isKey && !isCommand)) {
    ctx.status = 400;
    return;
  }

  // A `node-appletv` command.
  if (isKey) {
    const key = (AppleTV.Key[command] as any) as AppleTV.Key;
    await (ctx.atv as AppleTV).sendKeyCommand(key);
  }

  // One of our custom commands.
  if (isCommand) {
    const cmd = (ExtraCommand[command] as any) as ExtraCommand;
    switch (cmd) {
      case ExtraCommand.AppSwitcher:
        await appSwitcher(ctx.atv);
        break;
      case ExtraCommand.CloseInAppSwitcher:
        await closeInAppSwitcher(ctx.atv);
        break;
    }
  }

  ctx.status = 200;
}

export async function createApplication(): Promise<Koa> {
  const atv = await connect(await getCredentials());

  const app = new Koa();
  app.use(KoaLogger());
  app.use(KoaStatic('public'));
  app.context.atv = atv;

  const router = new Router();
  router.get('/atv/:command', getCommand);

  return app.use(router.routes());
}
