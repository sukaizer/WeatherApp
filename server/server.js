const express = require("express");
const app = express();
const port = 5001; // may change depending on your port
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Function to delete all records in the 'users' table
const clearUsersTable = () => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM users", (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const clearScoresTable = () => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM scores", (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

app.delete("/api/delete", async (req, res) => {
  try {
    await clearUsersTable();
    await clearScoresTable();
    res.json({ message: "Users table and scores table cleared" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear the 'users' table at the start of the server
const initializeServer = async () => {
  // Start the server after clearing the table
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
};

// Connect to SQLite
const db = new sqlite3.Database("userdb.db");

// Create a simple table for users
db.run(
  "CREATE TABLE IF NOT EXISTS users (userID INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, passwordHash TEXT, salt TEXT)"
);

// Second table with the scores
db.run(`
  CREATE TABLE IF NOT EXISTS scores (
    scoreID INTEGER PRIMARY KEY AUTOINCREMENT,
    userID INTEGER,
    time INTEGER,
    city TEXT,
    minTemperature REAL,
    maxTemperature REAL,
    weatherType TEXT,
    clothes TEXT,
    score INTEGER,
    scoreMessage TEXT,
    FOREIGN KEY(userID) REFERENCES users(userID)
  )
`);

// Middleware for parsing JSON requests
app.use(bodyParser.json());

// Define a route for user registration
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  // Check if username is not null and does not contain spaces
  if (!username || username.includes(" ")) {
    return res
      .status(400)
      .json({ error: "Username cannot be null or contain spaces" });
  }

  try {
    // Generate a salt
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert the user into the database
    db.run(
      "INSERT INTO users (username, passwordHash, salt) VALUES (?, ?, ?)",
      [username, passwordHash, salt],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        const token = jwt.sign({ username: username }, "your-secret-key", {
          expiresIn: "1h",
        });
        res.json({ userId: this.lastID, token: token, username: username });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Define a route for user authentication (simple example)
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  // Retrieve the user from the database
  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      try {
        // Compare the entered password with the stored hash
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (passwordMatch) {
          const token = jwt.sign(
            { username: user.username },
            "your-secret-key",
            { expiresIn: "1h" }
          );
          res.json({
            message: "Login successful",
            token: token,
            username: username,
          });
        } else {
          res.status(401).json({ error: "Invalid username or password" });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );
});

app.post("/api/score", async (req, res) => {
  const { username, time, city, minTemperature, maxTemperature, weatherType, clothes, score, scoreMessage } = req.body;
  
  // Convert the clothes array to a string
  const clothesString = JSON.stringify(clothes);

  // Retrieve the user id from the database
  db.get(
    "SELECT userID FROM users WHERE username = ?",
    [username],
    function(err, user) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!user) {
        return res.status(401).json({ error: "Invalid username" });
      }

      const id = user.userID; 
      console.log(id);

      db.run(
        `INSERT INTO scores (userID, time, city, minTemperature, maxTemperature, weatherType, clothes, score, scoreMessage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, time, city, minTemperature, maxTemperature, weatherType, clothesString, score, scoreMessage],
        function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ message: "Score saved successfully" });
        }
      );
    }
  );
});

app.get("/api/scores/:username", (req, res) => {
  const { username } = req.params;

  // Retrieve the user id from the database
  db.get(
    "SELECT userID FROM users WHERE username = ?",
    [username],
    function(err, user) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const id = user.userID;

      db.all(`SELECT * FROM scores WHERE userID = ?`, id, (err, rows) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (rows.length === 0) {
          return res.status(404).json({ error: "No scores found for this user" });
        }
        res.json(rows);
      });
    }
  );
});

// Call the function to initialize the server
initializeServer();
