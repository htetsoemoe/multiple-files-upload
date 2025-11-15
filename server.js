const express = require("express")
const multer = require("multer")
const path = require("path")

const app = express()

// Public uploads folder
app.use("/uploads", express.static("uploads"))

// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => 
        cb(
            null,
            Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
        )
})

// Filter uploaded file types
const fileFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    allowed.includes(file.mimetype)
        ? cb(null, true)
        : cb(new Error("Only image files allowed!"), false)
}

// Returns a Multer instance that provides several methods for generating middleware that process files uploaded in multipart/form-data format.
// Creates multer instance
const upload = multer({
    storage,
    fileFilter, 
    limits: {fileSize: 5 * 1024 * 1024} // 5MB
})

app.get("/", (req, res) => {
    res.send("Hello from multiple files upload project!")
})

// Route for multiple upload
app.post("/upload", upload.array("photos", 10), (req, res) => {
    const files = req.files.map(file => ({
        filename: file.filename,
        url: `/uploads/${file.filename}`
    }))

    res.json({
        message: "Uploaded successfully!",
        files
    })
})

app.listen(3500, () => console.log(`Server is running on port 3500`))