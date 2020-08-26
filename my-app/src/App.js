import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ListOfActiveUsers from './Components/ListOfActiveUsers.jsx';
import ListOfQueueUsers from './Components/ListOfQueueUsers.jsx'
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';



const timeInMinutes = 30;
let socket = new WebSocket('ws://localhost:3333');

class App extends React.Component { 
    constructor(props) {
        super(props);
        this.joinQueue = this.joinQueue.bind(this);
        this.leaveQueue = this.leaveQueue.bind(this);
        this.openWebSocket = this.openWebSocket.bind(this);
        this.state = {
            user : null,
            videoURL : null,
            users : null,
            activeUsers : null,
            queueUsers : null,
            showEnter: false,
            showTimesUp: false,
            isInQueue: false
        }
    }

   

    componentDidMount(){

      };
    
    openWebSocket() {
      socket.onopen = () => {
        console.log('connection open')
        }

        socket.onmessage = event => {
          //if the message from the server starts with u then it has the user lists in it
          if(event.data[3] === 'u'){
          const allUsers = JSON.parse(event.data);
          this.setState({
              users : allUsers,
              activeUsers : allUsers.activeUsers,
              queueUsers : allUsers.users
              })
          //if it starts with v then it is the URL for the video endpoint
          } else if (event.data[2] === 'v') {
            const url = JSON.parse(event.data)
            this.setState({
              showEnter: true,
              videoURL: url.videoUrl
              }) 
          //if it starts with T then it is telling the user that time is up
          } else if(event.data === 'Times Up') {
            this.setState({
              showTimesUp: true,
              isInQueue: false
              }) 
            }
        }

    }
    //when the user decides to join the 3d verse (puts you in the world if it is not full and the queue if it is full)
    joinQueue() {
      this.openWebSocket();
      let randInt = Math.random() * Math.floor(1000);
      let userId = randInt;
      let username = 'playaName';
      socket.send('{"uuid":' + JSON.stringify(userId) +',' +
                    '"userName":' + JSON.stringify(username) + '}');
      this.setState({
        isInQueue: true, 
        user : 'playaName' + randInt.toString()
      
    })
  }

    //when a user decides to leave the queue
    leaveQueue(){
      this.setState({
        isInQueue: false,
        showEnter: false,
        showTimesUp: false

      })
      socket.close();
      socket = new WebSocket('ws://localhost:3333');
      socket.onopen = () => {
        console.log('connection open')
      }
    }

    


    render() {
     
      if(!this.state.showEnter && !this.state.showTimesUp && this.state.activeUsers != null && this.state.queueUsers != null && this.state.isInQueue) {
      return (
        <Accordion>
          <Card>
          
            <Accordion.Toggle id="queueToggle" as={Button} variant='primary' eventKey="1">
                Enter The 3D Verse
               
            </Accordion.Toggle>
          
            <Accordion.Collapse eventKey="1">
              <Card.Body> 
                <div id='userLists'>
                  <ListOfActiveUsers users={this.state.activeUsers}/>
                  <ListOfQueueUsers users={this.state.queueUsers}/>
                </div>
                <div>
      <p><b>Estimated Wait Time: {this.state.queueUsers.length * timeInMinutes} minutes</b></p>
              <Button variant='link' onClick={this.leaveQueue}>Leave</Button>
              </div>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
  );
} else if(this.state.showEnter) {
          return(
            <Modal.Dialog>
              <Modal.Body> 
                You may now enter the 3D verse!
              </Modal.Body>
              <Modal.Footer>
                <Button variant='primary' href={this.state.videoURL} target="_blank">Enter</Button>
                <Button variant='link' onClick={()=>{this.setState({showEnter:false})}}>Close</Button>
              </Modal.Footer>
            </Modal.Dialog>
          )
    } else if(this.state.showTimesUp) {
      return(
        <Modal.Dialog>
          <Modal.Body> Times Up!</Modal.Body>
          <Modal.Footer>
            <Button variant='primary' onClick={()=>{this.setState({showTimesUp:false})}}>Close</Button>
          </Modal.Footer>
        </Modal.Dialog>
      )
}else {
      return (
        <Accordion>
          <Card>
          
            <Accordion.Toggle id="queueToggle" as={Button} variant='primary' eventKey="1">
                Enter The 3D Verse
               
            </Accordion.Toggle>
          
            <Accordion.Collapse eventKey="1">
              <Card.Body> 
                <div id='userLists'>
              

                </div>
              <Button onClick={this.joinQueue}>Join</Button>

              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
  );
    }
}
}

export default App;