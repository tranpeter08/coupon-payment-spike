require('dotenv').config({path: '.env.local'});
const express = require('express')
const nextJs = require('next')
const stripeRouter = require('./routes/stripe');

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = nextJs({ dev })
const handle = app.getRequestHandler();
const server = express();

server.use(express.json());
server.use('/api/stripe', stripeRouter);

app.prepare().then(() => {
  server.get('/a', (req, res) => {
    return app.render(req, res, '/a', req.query)
  })

  server.get('/b', (req, res) => {
    return app.render(req, res, '/b', req.query)
  })

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err;

    console.log(`> Ready on http://localhost:${port}`);
  })
})