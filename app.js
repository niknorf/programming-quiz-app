const express = require('express');

const app = express();
const server = require('http').Server(app);
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongodb = require("mongodb");
const ObjectID = mongodb.ObjectID;

const socketio = require('./app/socket');

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'dist/quiz')));

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
let db;

mongodb.MongoClient.connect(
  process.env.MONGODB_URI,
  function (err, database) {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    // Save database object from the callback for reuse.
    // mongo version ^3.0 will return a client object containing the database object
    db = database.db('quiz-app');
    console.log('Database connection ready');

    // Initialize the app.
    const port = process.env.PORT || 2112;
    server.listen(port, () => {
      console.log(`Quiz app listening on port ${port}`);
    });

    // start socket server
    socketio.initSocketServer(server);
  }
);

const API = 'api';
const roomsCollection = 'ROOMS_COLLECTION';
const questionCollection = 'QUESTIONS_COLLECTION';
const categoryCollection = 'CATEGORY_COLLECTION';
const scoreCollection = 'SCORE_COLLECTION';
const answerCollection = 'ANSWER_COLLECTION'
const userCollection = 'USER_COLLECTION';

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log(`ERROR: ${reason}`);
  res.status(code || 500).json({
    "error": message
  });
};

// This will allow Angular to handle the routing
app.get('/', (req, res) => {
  res.sendFile(path.resolve('dist/quiz/index.html'));
});


/* ===== Room API ===== */

app.get(`/${API}/rooms`, function (req, res) {
  db.collection(roomsCollection).find({}).toArray(function (err, docs) {
    if (err) {
      handleError(res, err.message, "Failed.");
    } else {
      res.status(200).json(docs);
    }
  });
});

// app.post(`/${API}/rooms`, function (req, res) {
//   let rooms = req.body;

//   console.log(req.body);

//   db.collection(roomsCollection).insertMany(
//     [{
//         "position": 1,
//         "name": "Routing",
//         "category": "Angular"
//       }, {
//         position: 2,
//         name: 'Store setup',
//         category: 'Magento'
//       },
//       {
//         position: 3,
//         name: 'React basics',
//         category: 'React'
//       },
//       {
//         position: 4,
//         name: 'Module creation',
//         category: 'Magento'
//       },
//       {
//         position: 5,
//         name: 'PHP: Best practices',
//         category: 'PHP'
//       }
//     ],
//     function (err, doc) {
//       if (err) {
//         console.log(doc);
//         handleError(res, err.message, "Failed");
//       } else {
//         console.log("ok");
//         res.status(201).json(doc.ops[0]);
//       }
//     });
// });

/* ===== Category API ===== */

app.get(`/${API}/categories`, function (req, res) {
  db.collection(categoryCollection).find({}).toArray(function (err, docs) {
    if (err) {
      handleError(res, err.message, "Failed.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post(`/${API}/category`, function (req, res) {
  let category = req.body;
  category.createDate = new Date();

  if (!req.body.content) {
    handleError(res, "Invalid request", 400);
  } else {
    db.collection(categoryCollection).insertOne(category, function (err, doc) {
      if (err) {
        handleError(res, err.message, "Failed");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  }
});


/* ===== Question(s) API =====*/

app.get(`/${API}/questions`, function (req, res) {
  db.collection(questionCollection).find({}).toArray(function (err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get questions.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post(`/${API}/question`, function (req, res) {
  let question = req.body.question;
  let answer = req.body.answer;
  question.createDate = new Date();

  if (!req.body.question && !req.body.answer) {
    handleError(res, "Invalid request", 400);
  } else {
    db.collection(questionCollection).insertOne({question: question, answer: answer}, function (err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new question.");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  }
});


/* ===== Answer API ===== */

app.get(`/${API}/answer`, function (req, res) {
  db.collection(answerCollection).find({}).toArray(function (err, docs) {
    if (err) {
      handleError(res, err.message, "Failed.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post(`/${API}/answer`, function (req, res) {
  let answer = req.body;
  answer.createDate = new Date();

  if (!req.body.content) {
    handleError(res, "Invalid request", 400);
  } else {
    db.collection(answerCollection).insertOne(score, function (err, doc) {
      if (err) {
        handleError(res, err.message, "Failed");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  }
});


/* ===== Score API ===== */

app.get(`/${API}/score`, function (req, res) {
  db.collection(scoreCollection).find({}).toArray(function (err, docs) {
    if (err) {
      handleError(res, err.message, "Failed.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post(`/${API}/score`, function (req, res) {
  let score = req.body;
  score.createDate = new Date();

  if (!req.body.content) {
    handleError(res, "Invalid request", 400);
  } else {
    db.collection(scoreCollection).insertOne(score, function (err, doc) {
      if (err) {
        handleError(res, err.message, "Failed");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  }
});

/* ===== User API ===== */

app.get(`/${API}/user`, function (req, res) {
  db.collection(userCollection).find({}).toArray(function (err, docs) {
    if (err) {
      handleError(res, err.message, "Failed.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post(`/${API}/user`, function (req, res) {
  let user = req.body;
  user.createDate = new Date();

  if (!req.body.content) {
    handleError(res, "Invalid request", 400);
  } else {
    db.collection(userCollection).insertOne(user, function (err, doc) {
      if (err) {
        handleError(res, err.message, "Failed");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  }
});
