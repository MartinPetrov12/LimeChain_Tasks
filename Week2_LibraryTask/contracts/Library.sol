// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Library is Ownable {

    struct Book {
        uint8 copies;
        string title;
        address[] bookBorrowedAddresses;
    }

    bytes32[] public bookId;

    mapping(bytes32 => Book) public books;
    mapping(address => mapping(bytes32 => bool)) public borrowedBook;

    event LogAddedBook(string title, uint copies);

    event LogBorrowedBook(string title, address borrower);

    event LogBookReturned(string title, address borrower);

    modifier validBookData(string memory _title, uint8 _copies) {
        bytes memory tempTitle = bytes(_title);
        require(tempTitle.length > 0, "The title of the book can not be empty");
        require(_copies > 0, "The amount of books to be added should be positive");
        _;
    }

    modifier bookDoesNotExist(string memory _title) {
        require(bytes(books[keccak256(abi.encodePacked(_title))].title).length == 0, "This book is already added");
        _;
    }

    function addBooks(string memory _title, uint8 _copies) public onlyOwner validBookData(_title, _copies) bookDoesNotExist(_title) {
        address[] memory borrowed;
        Book memory newBook = Book(_copies, _title, borrowed);
        bytes32 newBookHash = keccak256(abi.encodePacked(_title));
        books[newBookHash] = newBook;
        bookId.push(newBookHash);
        emit LogAddedBook(_title, _copies);
    }

    function reserveBook(bytes32 _desiredBookId) public {
        Book storage book = books[_desiredBookId];

        require(book.copies > 0, "There are no copies left for this book");

        require(!borrowedBook[msg.sender][_desiredBookId], "You have already borrowed the book");

        borrowedBook[msg.sender][_desiredBookId] = true;
        book.bookBorrowedAddresses.push(msg.sender);
        book.copies -= 1;

        emit LogBorrowedBook(book.title, msg.sender);
    }

    function returnBook(bytes32 _bookId) public {
        Book storage book = books[_bookId];

        require(borrowedBook[msg.sender][_bookId], "You can not return a book you haven't borrowed");

        borrowedBook[msg.sender][_bookId] = false;
        book.copies += 1;

        emit LogBookReturned(book.title, msg.sender);
    }

    function getAllAddressBorrowedBook(bytes32 _bookId) public view returns(address[] memory _book) {
        Book memory book = books[_bookId];
        return book.bookBorrowedAddresses;
    }

}