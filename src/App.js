import React, { Component } from 'react';
//adding authentication for react app
import { withAuthenticator } from 'aws-amplify-react';
//using api configuration for graphQl 
import { API, graphqlOperation } from 'aws-amplify';
// brining mutation module 
import { createNote, deleteNote, updateNote } from './graphql/mutations';
import { listNotes } from './graphql/queries';

class App extends Component {

  state = {
    termnote:"",
    notes:[],
    id: ''
  }

  handleChange = (event) => {
    this.setState({ termnote: event.target.value })
  }
  // checking if the note is already there that we are updating , if there we will update else add
  hasExistingNote = () => {
    const { notes, id } = this.state;
    if(id) {
      // is there a note with the valid id?
      const isNote = notes.findIndex(note => note.id === id) > -1 
      return isNote;
    }
    return false;
  }

  handleAddNote = async (event) => {
    event.preventDefault();
    const { termnote, notes } = this.state;
    // check if we have an existing note, if so we update it else add new one 
    if (this.hasExistingNote()) {
      this.handleUpdateNote()
    } else {
      //input configuration for mutation
      const input = { note: termnote }
      const result = await API.graphql(graphqlOperation( createNote, { input }));
      const newNote = result.data.createNote
      //adding the notes to the notes array taking previous notes+newnote
      const updatedNotes = [ newNote, ...notes ]
      this.setState({ notes: updatedNotes, termnote: '' })
    }
  }

  handleUpdateNote = async () => {
    const { id, termnote , notes } = this.state;
    const input = { id, note: termnote }
    const result = await API.graphql(graphqlOperation( updateNote, { input }));
    const updatedNote = result.data.updateNote;
    // updating the notes on the same position in the notes list
    //taking the notes index and checking with the position of updated note
    const index = notes.findIndex(note => note.id === updatedNote.id )
    //
    const updatedNotes = [
      ...notes.slice(0, index),
      updatedNote,
      ...notes.slice(index + 1 )
    ]
  
  }
   // once the component mounts it shows all the listed notes using graphQl query
  componentDidMount = async() =>{
    const result = await API.graphql(graphqlOperation(listNotes))
    this.setState({ notes: result.data.listNotes.items })
  }

  //Deleting any notes 
  handleDelete = async (noteid) => {
    const { notes } = this.state;
    //input config for mutation
    const input = { id: noteid };
    const result = await API.graphql(graphqlOperation( deleteNote, { input }));
    //getting the deleted note
    const deletedNoteId = result.data.deleteNote.id;
    const updatedNotes = notes.filter(note => note.id !== deletedNoteId )
    this.setState({ notes: updatedNotes })
  }
  // updating note 
  updateNotes = ({ note, id }) => {
    this.setState({ termnote: note , id })
  }

  render() {
    return (
       <div className="flex flex-column 
       items-center justify-center 
       pa3 bg-washed-red">
       <h1 className="code f2-1">Amplify NoteTaker</h1>
       {/* Note Form */}
        <form className="mb3" onSubmit={this.handleAddNote}>
            <input type="text"
              className="pa2 f4"
              placeholder="Write Your Note"
              onChange={this.handleChange}
              value={this.state.termnote}
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
                <li onClick={()=>this.updateNotes(note)} className="list pa1 f3">
                  {note.note}
                </li>
                <button  onClick={()=>this.handleDelete(note.id)} className="bg-transparent bn f4">
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
