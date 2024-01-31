import mongoose, { ConnectOptions } from "mongoose";


mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
} as ConnectOptions)
  .then(() => {
    console.log('MongoDB connected!!');
  })
  .catch((err) => {
    console.log('Failed to connect to MongoDB', err);
  });