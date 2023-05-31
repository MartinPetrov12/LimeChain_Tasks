import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Library", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployLibrary() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const LibraryFactory = await ethers.getContractFactory("Library");
    const library = await LibraryFactory.deploy();

    return { library, owner, otherAccount };
  }

  async function deployLibraryAndOneBook() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const LibraryFactory = await ethers.getContractFactory("Library");
    const library = await LibraryFactory.deploy();
    const bookTitle = "Harry Potter I";
    const bookCopies = 1;

    await library.addBooks(bookTitle, bookCopies);

    const keccak256 = require('keccak256')
    const titleHash = keccak256(bookTitle);

    return { library, owner, otherAccount, titleHash, bookTitle };
  }

  async function deployLibraryAndManyBooks() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const LibraryFactory = await ethers.getContractFactory("Library");
    const library = await LibraryFactory.deploy();
    const bookTitle = "Harry Potter I";
    const bookCopies = 3;

    await library.addBooks(bookTitle, bookCopies);

    const keccak256 = require('keccak256')
    const titleHash = keccak256(bookTitle);

    return { library, owner, otherAccount, titleHash, bookTitle };
  }

  describe("Deployment", function () {
    
    it("Should set the right owner", async function () {
      const { library, owner } = await loadFixture(deployLibrary);

      expect(await library.owner()).to.equal(owner.address);
    });

  });

  describe("Addition of books", function () {
    it("Should add book on correct input and credentials", async function () {
      const { library, owner } = await loadFixture(deployLibrary);

      await expect(library.connect(owner).addBooks("Winnie the Pooh", 10))
        .to.emit(library,"LogAddedBook")
        .withArgs("Winnie the Pooh", 10);
    });

    it("Should revert on adding the same book twice", async function () {
      const { library, owner } = await loadFixture(deployLibrary);

      await library.connect(owner).addBooks("Winnie the Pooh", 10);

      await expect(library.connect(owner).addBooks("Winnie the Pooh", 5))
        .to.be.revertedWith("This book is already added");
    })

    it("Should revert on adding a book with an empty title", async function () {
      const { library, owner } = await loadFixture(deployLibrary);

      await expect(library.connect(owner).addBooks("", 10))
        .to.be.revertedWith("The title of the book can not be empty");
    });

    it("Should revert on adding a book with a non-positive amount of copies", async function () {
      const { library, owner } = await loadFixture(deployLibrary);

      await expect(library.connect(owner).addBooks("Winnie the Pooh", 0))
        .to.be.revertedWith("The amount of books to be added should be positive");
    });

    it("Should revert on non-owner trying to add a book", async function () {
      const { library, otherAccount } = await loadFixture(deployLibrary);

      await expect(library.connect(otherAccount).addBooks("Winnie the Pooh", 10))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Reservation of books", function () {
    it("Should reserve a book on correct input", async function () {
      const { library, owner, bookTitle, titleHash } = await loadFixture(deployLibraryAndOneBook);

      await expect(library.connect(owner).reserveBook(titleHash))
        .to.emit(library,"LogBorrowedBook")
        .withArgs(bookTitle, owner.address);
    });

    it("Should revert on no copies", async function () {
      const { library, owner, otherAccount, titleHash } = await loadFixture(deployLibraryAndOneBook);

      await library.connect(owner).reserveBook(titleHash);

      await expect(library.connect(otherAccount).reserveBook(titleHash))
        .to.be.revertedWith("There are no copies left for this book");
    });

    it("Should revert on reserving the same book two times", async function () {
      const { library, owner, titleHash } = await loadFixture(deployLibraryAndManyBooks);

      await library.connect(owner).reserveBook(titleHash);

      await expect(library.connect(owner).reserveBook(titleHash))
        .to.be.revertedWith("You have already borrowed the book");
    });
  });

  describe("Return of books", function () {
    it("Should return a book on correct input", async function () {
      const { library, owner, bookTitle, titleHash } = await loadFixture(deployLibraryAndManyBooks);

      await library.connect(owner).reserveBook(titleHash);

      await expect(library.connect(owner).returnBook(titleHash))
        .to.emit(library,"LogBookReturned")
        .withArgs(bookTitle, owner.address);
    });

    it("Should revert on returning a non-borrowed book", async function () {
      const { library, owner, bookTitle, titleHash } = await loadFixture(deployLibraryAndManyBooks);

      await expect(library.connect(owner).returnBook(titleHash))
        .to.be.revertedWith("You can not return a book you haven't borrowed");
    });
  });

  describe("Books borrowers getter", function () {
    it("Should return all borrowers of a book", async function () {
      const { library, owner, otherAccount, titleHash } = await loadFixture(deployLibraryAndManyBooks);

      await library.connect(owner).reserveBook(titleHash);

      await library.connect(otherAccount).reserveBook(titleHash);

      await expect((await library.getAllAddressBorrowedBook(titleHash)).length)
        .to.equal(2);
    })
  })
  
});
