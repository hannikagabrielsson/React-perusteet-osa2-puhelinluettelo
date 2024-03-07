import axios from 'axios';

export const getAllPersons = () => {
    return axios
        .get('http://localhost:3001/persons')
        .then((response) => {
          const { data } = response;
          return data;
        })
        .catch((error) => {
            throw error; // Rethrow the error for handling in the calling function
        });
}

export const createPerson = ({name, number, userId}) => {
    return axios
    .post('http://localhost:3001/persons', {name, number, userId})
    .then((response) => {
        const { data } = response;
        return data;
    })
    .catch((error) => {
        throw error; // Rethrow the error for handling in the calling function
    });
}

export const deletePerson = (id) => {

    console.log(id);

    return axios
        .delete(`http://localhost:3001/persons/${id}`)
        .then((response) => {
            const { data } = response;
            return data;
        })
        .catch((error) => {
            throw error; // Rethrow the error for handling in the calling function
        });
}

export const replaceNumber = ({ newPerson, id }) => {
    return axios
        .put(`http://localhost:3001/persons/${id}`, newPerson) // Send name and number as data in the request body
        .then((response) => {
            const { data } = response;
            return data;
        })
        .catch(error => {
            console.log("Error creating person.", error)
          })
        
};
       

