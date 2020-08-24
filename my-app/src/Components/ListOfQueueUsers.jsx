import React from 'react';
import QueueUser from './QueueUser.jsx';


class ListOfQueueUsers extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        if(this.props.users.length) {
        return (
         <div className='listOfUsers'>
            
            <h6>Waiting in the Queue</h6>
        
            {this.props.users.map(user => {
                return ( <QueueUser user={user}/> )
            })}
        </div>
        )
        }else return null;
    } 
}

export default ListOfQueueUsers;