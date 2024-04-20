const http = require('http');
const main = require('./event-watcher'); // Import your event-watcher.js file

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.write('<pre>'); // Open the pre tag to display the output as preformatted text

  // Redirect console output to the response
  const originalConsole = global.console;
  global.console = {
    ...originalConsole,
    log: (...args) => {
      originalConsole.log(...args);
      res.write(args.join(' ') + '\n');
    },
    error: (...args) => {
      originalConsole.error(...args);
      res.write('<span style="color: red;">' + args.join(' ') + '</span>\n');
    },
  };

  // Run your main function from event-watcher.js
  main();

  res.write('</pre>'); // Close the pre tag
  res.end();
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});