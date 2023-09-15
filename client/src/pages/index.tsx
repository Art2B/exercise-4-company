import { useEffect, useState, useRef, useReducer } from 'react';

import Head from 'next/head'
import { Inter } from 'next/font/google'
import getConfig from 'next/config'
import styles from '@/styles/Home.module.css'

const { publicRuntimeConfig } = getConfig()
const inter = Inter({ subsets: ['latin'] })
import Sensor, { SensorData } from '@/components/Sensor';
import { SocketProvider } from '@/hooks/useSocket';

function reducer(state: SensorData[], action: {type: string, sensor: SensorData}) {
  let newState;
  switch (action.type) {
    case 'update-sensor':
      const sensorIndex = state.findIndex((el: SensorData) => el.id === action.sensor.id);
      if (sensorIndex >= 0) {
        newState = [...state];
        newState[sensorIndex] = action.sensor;
      } else {
        newState = [...state, action.sensor];
      }
      break;
    default:
      throw new Error();
  }
  return newState;
}

export default function Home() {
  const socket = useRef<WebSocket>();
  const [connected, setConnectionState] = useState(false);
  const [sensors, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    socket.current = new WebSocket(publicRuntimeConfig.wsurl);

    socket.current.onopen = () => {
      setConnectionState(true);
    }

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      dispatch({
        type: 'update-sensor',
        sensor: data
      });
    };
  }, []);

  return (
    <>
      <Head>
        <title>Websocket technical exercise</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <SocketProvider value={socket.current}>
        <header className={`${styles.header} ${inter.className}`}>
          <h1>Sensor dashboard</h1>
        </header>
        <main className={`${styles.main} ${inter.className}`}>
          { connected
            ? (
              <div className={styles.grid}>
                {sensors.map((s: SensorData) => (
                  <Sensor key={s.id} data={s} />
                ))}
              </div>
            )
            : (
              <div className={styles.grid}>
                <p>Waiting for connection. One moment</p>
              </div>
            )
          }
        </main>
      </SocketProvider>
    </>
  )
}
