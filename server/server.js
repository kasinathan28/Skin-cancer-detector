const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Create Express app
const app = express();

// Body parser middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://skin:skin@cluster0.tslsoro.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Define a Mongoose schema for the predicted details
const predictionSchema = new mongoose.Schema({
    imageName: String,
    predictedClass: String,
    probability: Number
});

// Define a Mongoose model based on the schema
const Prediction = mongoose.model('Prediction', predictionSchema);

// API endpoint to store predicted details
app.post('/predictions', (req, res) => {
    const { imageName, predictedClass, probability } = req.body;
    console.log(req.body);

    // Create a new Prediction document
    const newPrediction = new Prediction({
        imageName,
        predictedClass,
        probability
    });

    // Save the new prediction to the database
    newPrediction.save()
        .then(() => {
            res.status(201).json({ message: 'Prediction saved successfully' });
        })
        .catch((err) => {
            console.error('Error saving prediction:', err);
            res.status(500).json({ error: 'Failed to save prediction' });
        });
});


// API to Get the predictions in the database.
app.get(`/pred`, async (req, res) =>{
    try {
        const predictions = await Prediction.find();
        console.log("Available predictions",predictions);
        res.status(200).json(predictions);
    } catch(error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
