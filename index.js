// implement your API here
const express = require("express");
const db = require("./data/db.js");

const server = express();

server.use(express.json());

server.get("/", (request, response) => {
    response.send("Express is running this server!")
});

//calling .find returns a promise that resolves to an array of all the users contained in the database.
//we have two at the moment samwise and frodo.
server.get("/api/users", (request, response) => {
    db.find()
        .then(users => {
            response.status(200).json(users);
        })
        .catch(err => {
            response.status(500).json({ success: false, err })
        })
});

// we need to find our user with ID here (findById)
server.get("/api/users/:id", (request, response) => {
    const { id } = request.params;

    if (!id) {
        response.status(404).json({success: false, error: "The user with the specified ID does not exist."})
    }

    db.findById(id)
        .then(id => {
            response.status(201).json({success: true, id})
        })
        .catch(error => {
        response.status(500).json({success:false, error:"The user information could not be retrieved."})
    })
})

// Creates a user using the information sent inside the request body w .insert
server.post("/api/users", (request, response) => {
    //const { name, bio } = request.body;
    const user = { name, bio } = request.body
    console.log(request.body)

    if (!name || !bio) {
        response.status(400).json({success: false, error: "Please provide name and bio for the user"})
        
    }
    db.insert(user)
        .then(user => {
            response.status(201).json({ success: true, user });
        })
        .catch(err => {
            response.status(500).json({success: false, error: "There was an error saving the user to the database"})
        })
})

server.delete("/api/users/:id", (request, response) => {
    const { id } = request.params;

    if (!id) {
        response.status(404).json({ success: false, error: "The user with the specified ID does not exist." })
    }
    db.remove(id)
        .then(deleted => {
            if (deleted) {
                response.status(204).end();
            } else {
                response.status(404).json({ success: false, message: "The user with the specified ID does not exist." });
            }
        
        })
        .catch(error => {
            response.status(500).json({ success: false, error: "The user could not be removed" })
        })
})

server.put("/api/users/:id", (request, response) => {
    const { id } = request.params;
    const user = { name, bio } = request.body

    if (!id) {
        response.status(404).json({ success: false, error: "The user with the specified ID does not exist." })
    }
    if (!name || !bio) {
        response.status(400).json({ success: false, error: "Please provide name and bio for the user" })

    }
    db.update(id, user)
        .then(updated => {
            if (updated) {
                response.status(200).json({ success: true, updated });
            } else {
                response.status(500).json({
                    success: false,
                    message: "The user info could not be modified"
                });
            }
        })
       
});






server.listen(3000, () => {
    console.log("This server is running on port 3000")
})