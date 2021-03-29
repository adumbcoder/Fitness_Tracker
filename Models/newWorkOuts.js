const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newWorkoutSchema = new Schema( {
    day: new Date().setDate(new Date().getDate()),
    exercises: [
      {
        type: {type: String, trim: true},
        name: {type: String, trim: true},
        duration: {type: Number, trim: true, default: 0},
        weight: {type: Number, trim: true, default: 0},
        reps: {type: Number, trim: true, default: 0},
        sets: {type: Number, trim: true, default: 0}
      }
    ]
});

const WorkOuts = mongoose.model("Workouts", newWorkoutSchema);

module.exports = WorkOuts;