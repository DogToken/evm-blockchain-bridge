import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import main from './event-watcher'; // Import your event-watcher.js file

const App = () => {
  const outputRef = useRef(null);

  useEffect(() => {
    const originalConsole = global.console;
    global.console = {
      ...originalConsole,
      log: (...args) => {
        originalConsole.log(...args);
        if (outputRef.current) {
          outputRef.current.innerHTML += `${args.join(' ')}\n`;
        }
      },
      error: (...args) => {
        originalConsole.error(...args);
        if (outputRef.current) {
          outputRef.current.innerHTML += `<span style="color: red;">${args.join(' ')}</span>\n`;
        }
      },
    };

    main(); // Run your main function from event-watcher.js
  }, []);

  return (
    <div>
      <h1>Event Watcher Output</h1>
      <pre ref={outputRef} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));