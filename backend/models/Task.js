// const mongoose = require('mongoose');

// const TaskSchema = new mongoose.Schema({
//   slNo: { type: Number, required: true },
//   projectId: { type: String, required: true },
//   fixtureNumber: { type: String, required: true },
//   category: { type: String, required: true },
//   personHandling: { type: String, required: true },
//   supportedPerson: { type: String, required: true },
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
// }, { timestamps: true });

// module.exports = mongoose.model('Task', TaskSchema);

const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  slNo: { type: Number, required: true },
  projectId: { type: String, required: true },
  fixtureNumber: { type: String, required: true },
  category: { type: String, required: true },
  personHandling: { type: String, required: true },
  supportedPerson: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  task: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  plannedHrs: { type: Number, required: true },
  actualHrs: { type: Number, default: 0 },
  status: { type: String, enum: ['Pending', 'Ongoing', 'Completed'], required: true },
  daysTaken: { type: Number },
  remarks: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
