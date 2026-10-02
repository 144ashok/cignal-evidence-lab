import { createApp } from './app.mjs';

const port = Number(process.env.PORT ?? 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535.');
}

const app = await createApp({ development: process.argv.includes('--dev') });
app.server.on('error', async error => {
  console.error(`Unable to start the Node server: ${error.message}`);
  await app.close();
  process.exitCode = 1;
});
app.server.listen(port, '127.0.0.1', () => {
  console.log(`CIGNAL Evidence Lab: http://127.0.0.1:${port}`);
  console.log(`Fact options API: http://127.0.0.1:${port}/api/fact-options`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, async () => {
    await app.close();
    process.exitCode = 0;
  });
}
