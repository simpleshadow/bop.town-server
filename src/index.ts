import { startServer } from './server'

const server = startServer()

server.listen(port => {
  console.log(`we up => http://localhost:${port}`)
})
