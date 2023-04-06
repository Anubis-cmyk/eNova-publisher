import React from "react";
import {BrowserRouter,Routes,Route} from "react-router-dom";
import './App.css';
import AddBook from './addBook/addBook';
import Login from './login/login';
import Book from './addBook/book'

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login/>}/>
        <Route  path="/addBook" element={<AddBook/>}/>
      </Routes>
      </BrowserRouter>
      </div>
  );
}

export default App;
