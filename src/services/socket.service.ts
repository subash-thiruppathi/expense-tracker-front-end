
import { io, Socket } from 'socket.io-client';

const URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class SocketService {
  socket: Socket;

  constructor() {
    this.socket = io(URL, {
      autoConnect: false,
    });
  }

  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  on(event: string, callback: (data: any) => void) {
    this.socket.on(event, callback);
  }

  off(event: string) {
    this.socket.off(event);
  }
}

const socketService = new SocketService();

export default socketService;
