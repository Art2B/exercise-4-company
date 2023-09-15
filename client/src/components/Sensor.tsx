import useSocket from '@/hooks/useSocket';
import styles from '@/styles/Home.module.css'

interface SensorProps {
  data: SensorData
};

export interface SensorData {
  id: string,
  name: string,
  connected: boolean,
  unit: string,
  value: string | null,
}

export default function Sensor ({data}: SensorProps) {
  const socket = useSocket();

  const handleConnection = () => {
    socket.send(JSON.stringify({ command: "connect", id: data.id }));
  }

  const handleDisconnection = () => {
    socket.send(JSON.stringify({ command: "disconnect", id: data.id }));
  }

  return (
    <div className={styles.card}>
      <h2>{ data.name }</h2>
      <div className={styles.connectionState}>
        <p>
          <span
            className={[
              styles.diode,
              data.connected ? styles.connected : styles.disconnected
            ].join(' ')} />
          {data.connected ? 'Connected' : 'Not connected'}
        </p>
      </div>
      <div>
        { data.value 
          ? (
            <p className={[
              styles.code,
              styles.data
            ].join(' ')}>
              {data.value} { data.unit}
            </p>)
          : (
            <p className={styles.data}>No data yet</p>
          )}
      </div>

      { data.connected 
        ? (
            <button
              className={[
                styles.button,
                styles.disconnect
              ].join(' ')}
              onClick={handleDisconnection}>
              Disconnect sensor
            </button>
          )
        : (
            <button
              className={[
                styles.button,
                styles.connect
              ].join(' ')}
              onClick={handleConnection}>
              Connect sensor
            </button>
        )
      }
    </div>
  );
}