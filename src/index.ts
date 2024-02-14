import app from './App'
import * as http from 'http';


let port = 8000;
let server = http.createServer(app);
server.on('error', onError);
server.listen(port, () => {
  return console.log(`server is listening on ${port}`)
});

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  console.log(error);
  if (error.syscall !== 'listen') {
      throw error;
  }

  let bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
      case 'EACCES':
          console.error(bind + ' requires elevated privileges');
          process.exit(1);
          break;
      case 'EADDRINUSE':
          console.error(bind + ' is already in use');
          process.exit(1);
          break;
      default:
          throw error;
  }
}
