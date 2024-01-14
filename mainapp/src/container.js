import "reflect-metadata";
import { Container } from "inversify";
import { BooksRepository } from "./book/book.repository";

const container = new Container();
container.bind(BooksRepository).toSelf();
