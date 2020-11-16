import app from "./express"

const port = 8000

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})
