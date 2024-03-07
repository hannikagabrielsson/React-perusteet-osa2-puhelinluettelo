
import { useState, useEffect } from 'react';
import {
  createPerson as createPerson, 
  getAllPersons as getAllPersons,
  deletePerson as deletePerson,
  replaceNumber,
  } from "./persons/managePerson.js"


const Filter = ({ filterInput, setFilterInput }) => {
  
  return (
      <div>
          <label>Filter</label>
          <input 
          type="text" 
          value={filterInput}
          onChange={(event) => setFilterInput(event.target.value)}/>
      </div>
  )
}

const PersonsForm = ({ newName, newPhone, handleNameChange, handlePhoneChange, handleClick }) => {

  return (
  <form onSubmit={handleClick}>
  <div>
    <label htmlFor="">name: </label>
    <input type="text" onChange={handleNameChange} value={newName}/>
  </div>
  <div>
    <label htmlFor="">phone: </label>
    <input type="text" onChange={handlePhoneChange} value={newPhone}/>
  </div>
  <div>
    <button type="submit">add</button>
  </div>
</form>
  )
} 


const Persons = ({ persons, handleDelete }) => {
  return (
    <>
    {persons.map((person, id) => (   
        <Person key={id} person={person} handleDelete={handleDelete}/>
    ))}
    </>
  )
}

const Person = ({ person, handleDelete }) => {
  const onClickDelete = () => {
    handleDelete(person.id, person.name);
  };
  return (
    <div>
      <p>{person.name} {person.number}
      <button className='deleteButton' onClick={onClickDelete}>delete</button>
      </p>
    </div>
  )
}

const Notification = ({ message, error }) => {
  if (message) {
    return (
  <div className={message ? "success" : ""}>
  {message}
  </div>
    )
}

  else if (error) {
    return (
    <div className={error ? "error" : ""}>
      {error}
    </div>
    )
  }

  return null

}


const App = () => {

const [persons, setPersons] = useState([]);
const [newName, setNewName] = useState('');
const [newPhone, setNewPhone] = useState('');
const [filterInput, setFilterInput] = useState('');
const [loading, setLoading] = useState(false);
const [successMessage, setSuccessMessage] = useState("");
const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    getAllPersons()
      .then((persons) => {
        setPersons(persons);
        setLoading(false);
    })
      .catch(error => console.error("Error fetching persons:", error));
  }, []);

const handleNameChange = (event) => {
    setNewName(event.target.value)
  };
  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value)
  };
  
const handleClick = (event) => {
  event.preventDefault(); 

  const newPerson = {
    name: newName,
    number: newPhone,
    userId: 1
  }

  
      // Check if name exists
  const checkIfPersonExists = persons.map(person => person.name).includes(newPerson.name) 
  console.log("checkIfPersonExists" + checkIfPersonExists)
  
    // Check if a person exists with the same name and same number
  const checkIfNameAndNumberMatch = persons.some(person => person.number === newPerson.number && person.name === newPerson.name);
  console.log("checkIfNameAndNumberMatch" + checkIfNameAndNumberMatch)

  // If a person with same name and same number exists
  if (checkIfNameAndNumberMatch) {
    alert(`${newName} is already added to phonebook with number ${newPhone}`);
    setNewName("");
    setNewPhone("");

  // if true, exit without change
    return
  }

  // If person existe with a different number
  else if (checkIfPersonExists) {

    // Asks if user wants to replace the number of the existing person
    const replaceConfirm = window.confirm(`${newName} is already added to the phonebook. Replace the old number with the new one?`)

      // If the user wants to change the number
      if (replaceConfirm) {
        // Saves the person to be replaced in a variable
        const personToUpdate = persons.find(person => person.name === newPerson.name);
        console.log("personToUpdate " + personToUpdate);
        // Calls the function that replaces the old person with the new one
        replaceNumber({ id: personToUpdate.id, newPerson: {...personToUpdate, number: newPerson.number} })
        // Renders the updated persons array
        .then(updatedPerson => {
          setPersons(persons.map(person => person.id !== updatedPerson.id ? person : updatedPerson));
        })
        .catch(error => {
                      
          setErrorMessage(
            `The person with the name ${newName} has already been deleted from the phonebook.`
          )
          console.log("This is the error: " +error)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000);
          
        }); 
          // setPersons(persons.filter(person => person.id !== updatedPerson.id))
      }
      // If the user doesn't want to change the number
      else {
        console.log("User canceled addition.");
        return
      }
  }

  else {
  

    // call function createPerson in managePerson file and adds the newPerson to the JSON-file
    createPerson(newPerson)

      // Näyttää succes-viestin 5 sekunnin timeoutilla
      .then((newPerson) => {
        // If the person with the same number doesn't exist, it renders the newPerson
        setPersons((prevPersons) => [...prevPersons, newPerson]);
        console.log("persons" + persons)
        setSuccessMessage(
          `Added ${newName}`
        )
        setTimeout(() => {
          setSuccessMessage(null) 
        }, 5000);
        
      })
    
      .catch(error => console.error("Error creating person:", error)); 

    
  }

  // Tyhjentää input-kentät
  setNewName("");
  setNewPhone("");
  

};


const handleDelete = (id, name) => {
  console.log("Deleting person with ID:", id);
  const deleteConfirmation = window.confirm(`Delete ${name} ?`)
  if (deleteConfirmation) {
    console.log("User confirmed deletion.");
    deletePerson(id)
      .then(() => {
        setPersons(prevPersons => prevPersons.filter(person => person.id !== id));
      })
      .catch(error => console.error('Error deleting person:', error));
  } else {
    console.log("User canceled deletion.");
  }
};
  

  const filteredPersons = persons.filter(person =>                      
    person.name.toLowerCase().includes(filterInput.toLowerCase())
    );  


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification 
        message={successMessage}
        error={errorMessage}/>

      <Filter 
        filterInput={filterInput}
        setFilterInput={setFilterInput}
      />
      <h2>Add new</h2>
      <PersonsForm 
        newName={newName}
        newPhone={newPhone}
        handleNameChange={handleNameChange}
        handlePhoneChange={handlePhoneChange}
        handleClick={handleClick}
      />
      <h2>Numbers</h2>
      <Persons 
        persons={filteredPersons}
        handleDelete={handleDelete}
      />
    </div>
  )
}

export default App