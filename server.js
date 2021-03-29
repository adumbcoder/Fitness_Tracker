const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const path = require('path');

const PORT = process.env.PORT || 8080;

const db= require('./Models');

const app = express();

app.use(logger('dev'));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/workout', {useNewUrlParser: true});

//this will use the aggregate method to take a field in the table and using '$sum' add them together.
app.get('/api/workouts', (req, res) => {
    db.Workouts.aggregate([
        {
            $addFields: {
                totalDuration: {
                    $sum: '$exercises.duration'
                }
            }
        }
    ]).then(dbWorkout => {
    res.json(dbWorkout);
    }).catch(err => {
        res.json(err);
    })
});

//get last workout
app.get("/api/workouts/range", (req, res) => {
    db.Workouts.aggregate([
      {
        $addFields: {
          totalDuration: { $sum: "$exercises.duration"}
        }
      },
   ]).sort({_id: -1}).limit(7)
      .then(dbWorkout => {
        console.log(dbWorkout)
        res.json(dbWorkout);
      })
      .catch(err => {
        res.json(err);
      });
  });
  
app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname + '/public/exercise.html'));
});
    
app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname + '/public/stats.html'));
});

app.put("/api/workouts/:id", (req, res) => {
    console.log(req.params.id)
    db.Workouts.updateOne({_id: req.params.id}, {
        $push: {exercises: {
            type: req.body.type,
            name: req.body.name,
            distance: req.body.distance,
            duration: req.body.duration,
            weight: req.body.weight,
            reps: req.body.reps,
            sets: req.body.sets,
        }}
    
    })
    .then(dbWorkout => {
        res.json(dbWorkout);
    })
    .catch(err => {
        res.json(err);
    });
});
  
app.post("/api/workouts", ({data}, res) => {
    
    db.Workouts.create(data)
    .then(dbWorkout => {
        console.log(dbWorkout)
        console.log("hello")
        res.json(dbWorkout);
    })
})


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`);
  });