import express from "express";
import session from "express-session";
import http from "http";
import socketIO from "socket.io";
import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from "bcryptjs"; //работаем с паролями
import mongoose from "mongoose"; //работаем с базой
import User from "./models/users"; //Путь к модели пользователей


import errorMiddleware from "./middleware/error";
import indexBoooks from "./routes/index";
import apiBoooks from "./routes/books";


const app = express();
const server = http.Server(app);
const io = socketIO(server);

// Socket IO

io.on('connection', (socket) => {
  const {id} = socket;
  console.log(`Socket connected: ${id}`);

  // работа с комнатами (обсуждаем конкретную книгу)
  const {roomName} = socket.handshake.query;
  console.log(`Socket roomName: ${roomName}`);
  socket.join(roomName);
  socket.on('message-to-room', (msg) => {
      msg.type = `room: ${roomName}`;
      socket.to(roomName).emit('message-to-room', msg);
      socket.emit('message-to-room', msg);
  });

  socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${id}`);
  });
});

// END Socket IO






// Функции для работы с паролями
const hashPassword = async (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

const verifyPassword = async (inputPassword, storedHash) => {
  return bcrypt.compare(inputPassword, storedHash);
};

// Стратегия аутентификации
const verify = async (username, password, done) => {
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      console.log('User not found');
      return done(null, false, { message: 'Неправильное имя пользователя.' });
    }

    const match = await verifyPassword(password, user.password);
    // const match = password.toString() === user.password.toString()
    if (!match) {
      console.log('Wrong password');
      return done(null, false, { message: 'Неправильный пароль.' });
    }

    return done(null, user);
  } catch (err) {
    console.log(err);
    return done(err);
  }
};

passport.use('local', new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, verify));

passport.serializeUser((user, cb) => {
  console.log(user, 'user');
  cb(null, user._id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    console.log(id, 'id');
    const user = await User.findById(id);
    console.log(user, 'user');
    cb(null, user);
  } catch (err) {
    console.log(err, 'Error deserializing user');
    cb(err);
  }
});

// Настройка Express
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'SECRET', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Маршруты
app.get('/api/user/', (req, res) => {
  res.render('home', { user: req.user });
});

app.get('/api/user/signup', (req, res) => {
  res.render('signup');
});

app.get('/api/user/login', (req, res) => {
  res.render('login');
});

app.post('/api/user/login',
  passport.authenticate('local', { failureRedirect: '/api/user/login' }),
  (req, res) => {
    res.redirect('/api/user/');
  }
);

app.get('/api/user/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { 
      return next(err); 
    }
    res.redirect('/api/user/');
  });
});

app.get('/api/user/me', (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/api/user/login');
  }
  next();
}, (req, res) => {
  res.render('profile', { user: req.user });
});

app.post('/api/user/signup', async (req, res) => {
  console.log(req.body)
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.status(400).send('Пользователь уже существует.');
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).send('Пользователь создан. <a href="/api/user/login">Войти</a>');
  } catch (err) {
    res.status(500).send('Ошибка сервера.');
  }
});


app.use('/', indexBoooks) //работаем с книгами
app.use('/api/books', apiBoooks) //работаем с книгами по API
app.use(errorMiddleware);





interface Book  {
    id: string; 
    title: string;
    description: string;
    authors: string;
    favorite: string;
    fileCover: string;
    fileName: string;
}

abstract class BooksRepository {
    createBook(book: Book): Book {
        // создаем книгу
        console.log("Книга создана успешно");
        return; //Возвращаем созданную книгу
    }
    getBook(id: string): Book {
        console.log("Книга получена успешно");
        return; //возвращаем книгу по ID
    }
    getBooks(): Book[] {
        console.log("Книги получены успешно");
        return; //получаем массив книг
    }
    updateBook(id: string): Book {
        // обновление книги
        console.log("Книга успешно обновлена");
        return; //возвращаем обновленную книгу
    }
    deleteBook(id: string) {
        // удаляем книгу
        console.log("Книга успешно удалена");
    }
}




// Подключение к MongoDB и запуск сервера
const PORT = 3000;
const mongoserver = 'root:example@mongo:27017';
const database = 'admin';

// server.listen(3000);
mongoose.connect(`mongodb://${mongoserver}/${database}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB connected!!');
    server.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
  })
  .catch((err) => {
    console.log('Failed to connect to MongoDB', err);
  });