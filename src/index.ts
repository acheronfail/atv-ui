import { createApplication } from './server';
import { AddressInfo } from 'net';

async function main() {
  const app = await createApplication();

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
  const server = app.listen(port, () => {
    const addr = server.address() as AddressInfo;
    console.log(`Server started on port: ${addr.port}`);
  });
}

if (require.main === module) {
  main().then(undefined, (err) => {
    console.error(err);
    process.exit(1);
  });
}
