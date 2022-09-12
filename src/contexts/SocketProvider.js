import React, { useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

const SocketContext = React.createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ id, children }) {
  const [socket, setSocket] = useState();

  useEffect(() => {
    client = new WebSocket('ws://' + window.location.host + '/ws/chat/' + this.state.room + '/');
    const newSocket = io(
      'http://localhost:5000',
      { query: { id } } // This is the id being passed to server.js
    );
    setSocket(newSocket);

    return () => newSocket.close();
  }, [id])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}
