import Debug from 'debug'
import express from 'express'
import socketIO from 'socket.io'
import { createServer } from 'http'

import { SocketEvents } from './types/socket-events'

const debug = Debug('index')

export const startServer = () => {
  const app = express()
  const http = createServer(app)
  const io = new socketIO.Server(http, {
    cors: {
      origin: '*',
    },
  })

  let activeSockets: string[] = []

  io.on('connection', (socket) => {
    const existingSocket = activeSockets.find((existingSocket) => existingSocket === socket.id)

    if (!existingSocket) activeSockets.push(socket.id)

    socket.broadcast.emit(SocketEvents.PEER_CONNECTED, { id: socket.id })

    socket.on(SocketEvents.SEND_STATUS, ({ color, name, position }) => {
      socket.broadcast.emit(SocketEvents.RECEIVED_PEER_STATUS, { id: socket.id, color, name, position })
    })

    socket.on('disconnect', () => {
      activeSockets = activeSockets.filter((existingSocket) => existingSocket !== socket.id)
    })
  })

  const port = process.env.PORT || 5000
  http.listen(port, () => {
    debug(`let's bop 🤘 ${port}`)
  })
}

startServer()
