import React, { Component } from 'react';
//adding authentication for react app
import { withAuthenticator } from 'aws-amplify-react';

class App extends Component {

  state= {
    notes:[
      {
        id: 1,
        note: "Hello world"
      }
    ]
  }

  render() {
    return (
       <div className="flex flex-column 
       items-center justify-center 
       pa3 bg-washed-red">
       <h1 className="code f2-1">Amplify NoteTaker</h1>
       {/* Note Form */}
        <form className="mb3">
            <input type="text"
              className="pa2 f4"
              placeholder="Write Your Note"/>
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
