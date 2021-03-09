import express from 'express'
import socketIO from 'socket.io'
import { PeerServer } from 'peer'
import { createServer } from 'http'
import Debug from 'debug'

import { SocketEvents } from './types/socket-events'

enum ServerDefaults {
  DEFAULT_PORT = 5000,
}

const debug = Debug('server')

export const startServer = () => {
  const app = express()
  const httpServer = createServer(app)
  const io = socketIO(httpServer)
  const peerServer = PeerServer({ port: 9000, path: '/' })

  let activePeers: string[] = []
  let activeSockets: string[] = []

  io.on('connection', socket => {
    const existingSocket = activeSockets.find(existingSocket => existingSocket === socket.id)

    if (!existingSocket) activeSockets.push(socket.id)
    socket.emit(SocketEvents.UPDATE_ACTIVE_PEERS, { activePeers })

    socket.on(SocketEvents.UPDATE_STATUS, ({ peerId, position, face }) =>
      socket.broadcast.emit(SocketEvents.UPDATE_PEER_STATUS, { peerId, position, face })
    )

    socket.on('disconnect', () => {
      activeSockets = activeSockets.filter(existingSocket => existingSocket !== socket.id)
    })
  })

  peerServer.on('connection', client => {
    const peerId = client.getId()
    activePeers.push(peerId)

    io.emit(SocketEvents.PEER_CONNECTED, { peerId })

    debug(`User connected with # ${peerId} ${activePeers}`)
  })

  peerServer.on('disconnect', client => {
    const peerId = client.getId()
    activePeers = activePeers.filter(currentPeerId => currentPeerId !== peerId)

    io.emit(SocketEvents.PEER_DISCONNECTED, { peerId })

    debug(`User disconnected with # ${peerId} ${activePeers}`)
  })

  return {
    listen: (callback: (port: number) => void) => {
      httpServer.listen(ServerDefaults.DEFAULT_PORT, () => {
        callback(ServerDefaults.DEFAULT_PORT)
      })
    },
  }
}
