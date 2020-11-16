import express from "express"
import morgan from "morgan"
import cors from "cors"
import bodyParser from "body-parser"
import fileUpload from "express-fileupload"

// Initialise Express
const app = express()

// Add logging
app.use(morgan('dev'));
// Add cors
app.use(cors());
// Add body-parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// Add file upload
app.use(fileUpload({
    createParentPath: true
}));

export default app;