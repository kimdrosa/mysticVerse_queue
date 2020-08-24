import React, { useState } from 'react';

const socket = new WebSocket('ws://localhost:3333');

class WS extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            users : null
        }
    }

   

    componentDidMount(){
        socket.onopen = () => {
            socket.send('xochi');
            socket.send('gavin');
            socket.send('appa');
            socket.send('momo');
            }
  
            socket.onmessage = event => {
            console.log(`Message from server: ${event.data}`);
            this.setState({
                users : JSON.parse(event.data)
            })
            };
    }

    render() {

  return (
    <div >
        Users: {this.state.users.users}
        Active Users: {this.state.users.activeUsers}
    </div>
  );
    }
}

export default WS;