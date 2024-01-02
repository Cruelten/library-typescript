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

