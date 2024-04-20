const http = require('http');
const main = require('./event-watcher'); // Import your event-watcher.js file

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Event Watcher Output</title>
      <style>
        body {
          font-family: monospace;
          white-space: pre;
          padding: 1rem;
        }
      </style>
    </head>
    <body>
      <h1>Event Watcher Output</h1>
      <div id="output"></div>
      <script>
        const outputDiv = document.getElementById('output');

        const originalConsole = global.console;
        global.console = {
          ...originalConsole,
          log: (...args) => {
            originalConsole.log(...args);
            outputDiv.innerHTML += args.join(' ') + '\\n';
          },
          error: (...args) => {
            originalConsole.error(...args);
            outputDiv.innerHTML += '<span style="color: red;">' + args.join(' ') + '</span>\\n';
          },
        };
      </script>
  `);

  // Run your main function from event-watcher.js
  main();

  res.write(`
    </body>
    </html>
  `);
  res.end();
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});