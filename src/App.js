import { useState, useEffect } from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import { data } from "./data"
import Split from "react-split"
import {nanoid} from "nanoid"

export default function App() {
    const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem('notes')) || [])
    const [currentNoteId, setCurrentNoteId] = useState((notes[0] && notes[0].id) || "")

    useEffect(() => {
        localStorage.setItem('notes', JSON.stringify(notes))
    }, [notes])
    
    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }
    
    function updateNote(text) {
        setNotes(oldNotes => {
            const newNotes = []
            for (let i = 0; i < oldNotes.length; i++) {
                newNotes.push(oldNotes[i])
                if (oldNotes[i].id === currentNoteId) {
                    oldNotes[i].body = text
                    newNotes.splice(i, 1)
                    newNotes.unshift(oldNotes[i])
                }
            }
            return newNotes
        })
    }
    
    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }

    function deleteNote(event, noteId) {
        event.stopPropagation()
        setNotes(prevNotes => prevNotes.filter(note => noteId !== note.id))
    }

    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
