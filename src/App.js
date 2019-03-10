import React, { Component } from 'react';
//adding authentication for react app
import { withAuthenticator } from 'aws-amplify-react';
//using api configuration for graphQl 
import { API, graphqlOperation } from 'aws-amplify';
// brining mutation module 
import { createNote } from './graphql/mutations';

class App extends Component {

  state= {
    termnote:"",
    notes:[]
  }

  handleChange = (event) => {
    this.setState({ termnote: event.target.value })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { termnote } = this.state;
    const input = { note: termnote }
    API.graphql(graphqlOperation( createNote, { input }));
  }

  render() {
    return (
       <div className="flex flex-column 
       items-center justify-center 
       pa3 bg-washed-red">
       <h1 className="code f2-1">Amplify NoteTaker</h1>
       {/* Note Form */}
        <form className="mb3" onSubmit={this.handleSubmit}>
            <input type="text"
              className="pa2 f4"
              placeholder="Write Your Note"
              onChange={this.handleChange}
              />
              <button className="pa2 f4"
              type="submit">
              Add Note 
              </button>
        </form>
       {/* Notes list  */}
          <div>
            {this.state.notes.map(note => (
              <div key="note.id" className="flex items-center">
                <li className="list pa1 f3">
                  {note.note}
                </li>
                <button className="bg-transparent bn f4">
                <span>&times;</span>
                </button>
              </div>
            ))}
          </div>
       </div>
    );
  }
}

export default withAuthenticator(App, { includeGreetings: true });
