import React from 'react';
import ActiveUser from './ActiveUser.jsx';


class ListOfActiveUsers extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        console.log('props : ' + this.props.users)
        if(this.props.users.length) {
        return (
        <div className='listOfActiveUsers'>
            <h6>Users On The Playa</h6>
            {this.props.users.map(user => {
           return ( <ActiveUser user={user}/>)
            })}
        </div>
        )
    } else return null;
}
}

export default ListOfActiveUsers;