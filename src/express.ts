import express from "express"
import morgan from "morgan"
import cors from "cors"
import bodyParser from "body-parser"
import fileUpload from "express-fileupload"
import path from "path"

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

// Serve the static files from the React app
app.use(express.static(path.join(path.dirname('..'), 'client/build')));

export default app;