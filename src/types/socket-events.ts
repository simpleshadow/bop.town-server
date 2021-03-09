export enum SocketEvents {
  PEER_CONNECTED = 'peer-connected',
  PEER_DISCONNECTED = 'peer-disconnected',
  UPDATE_ACTIVE_PEERS = 'update-active-peers',
  UPDATE_STATUS = 'update-status',
  UPDATE_PEER_STATUS = 'update-peer-status',
}

export type SocketEventDataPeerConnect = {
  peerId: string
}

export type SocketEventDataPeerDisconnect = {
  peerId: string
}

export type SocketEventDataUpadateActivePeers = {
  activePeers: string[]
}

export type SocketEventDataUpdatePeerPosition = {
  peerId: string
  x: number
  y: number
}
