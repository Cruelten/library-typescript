"use strict";
class BooksRepository {
    createBook(book) {
        // создаем книгу
        console.log("Книга создана успешно");
        return; //Возвращаем созданную книгу
    }
    getBook(id) {
        console.log("Книга получена успешно");
        return; //возвращаем книгу по ID
    }
    getBooks() {
        console.log("Книги получены успешно");
        return; //получаем массив книг
    }
    updateBook(id) {
        // обновление книги
        console.log("Книга успешно обновлена");
        return; //возвращаем обновленную книгу
    }
    deleteBook(id) {
        // удаляем книгу
        console.log("Книга успешно удалена");
    }
}
