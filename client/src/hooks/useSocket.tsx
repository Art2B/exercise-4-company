import {useContext, createContext, ReactNode } from "react";

const SocketContext = createContext(null);

interface ISocketProvider {
  children: ReactNode;
  value: any
}

export const SocketProvider = ({children, value}: ISocketProvider) => (
  <SocketContext.Provider value={value}>
    {children}
  </SocketContext.Provider>
);

export default function useSocket() {
  const socket = useContext(SocketContext);

  return socket;
};