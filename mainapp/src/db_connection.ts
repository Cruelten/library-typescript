import mongoose from "mongoose";


// server.listen(3000);
mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB connected!!');
  })
  .catch((err) => {
    console.log('Failed to connect to MongoDB', err);
  });