import app from "./express.js";

const port = 8000

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})
