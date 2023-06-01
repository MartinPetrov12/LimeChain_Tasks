import { ethers, BigNumber, Contract, Wallet } from "ethers";
import { providers } from "ethers";
import LibraryArtifact from "./artifacts/contracts/Library.sol/Library.json";

interface Book {
    bookId: string,
    copies: number,
    title: string
}

async function run() {
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    const provider = new providers.JsonRpcProvider("http://127.0.0.1:8545/");
    const libraryContract = new ethers.Contract(contractAddress, LibraryArtifact.abi, provider);
    const account = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
    
    const bookTitle = "TestBook12";
    const bookCopies = 5;
    const addedBook = await addBook(bookTitle, bookCopies, libraryContract, account, provider);
    
    const availableBooks = await getAvailableBooks(libraryContract);
    availableBooks.forEach(x => console.log(x));
    
    await reserveBook(addedBook.bookId, libraryContract, account, provider);
    await returnBook(addedBook.bookId, libraryContract, account, provider);
    const bookAvailabiltiy = await checkAvailability(addedBook.bookId, libraryContract);
    if(bookAvailabiltiy) {
        console.log("The book is available");
    } else {
        console.log("The book is not available");
    }
}

/**
 * The function sends a transaction to the contract, which aims to add a book.
 * 
 * @param title - title of the book
 * @param copies - amount of copies of the book
 * @param contract - instance of the library contract
 * @param account - account of the sender of the transaction. It needs to be the owner of the contract, 
 *                  since he is the only one who can add new books
 * @param provider - the provider of the network
 * @returns - an object of interface Book 
 */
async function addBook(title: string, copies: number, contract: Contract, account: Wallet, provider: providers.JsonRpcProvider): Promise<Book> {

    const testTx = await contract.populateTransaction.addBooks(title, copies);
    testTx.nonce = await account.getTransactionCount();
    testTx.gasPrice = await provider.getGasPrice();
    testTx.gasLimit = BigNumber.from(30000000);
    
    const approveTxSigned = await account.signTransaction(testTx);
    const submittedTx = await provider.sendTransaction(approveTxSigned);
    const approveReceipt = await submittedTx.wait();
    if (approveReceipt.status != 1) {
        throw Error("Book was not created");
    } else {
        console.log("Book with title " + title + " was created.");
        let bookId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(title));
        return {bookId: bookId, title: title, copies: copies};
    }    
}

/**
 * The function returns an array of the books available to reserve.
 * Since the array of books in the library is an dynamic array and 
 * the size of the array is unknown, we are iterating through the array
 * until we reach an index out of bounds. 
 * 
 * @param contract - an instance of the library contract
 * @returns - a promise of array of available books
 */
async function getAvailableBooks(contract: Contract): Promise<Book[]> {
    let counter = 0;
    let flag:boolean = false;
    let result:Book[] = [];
    while(!flag) {
        try {
            let currentBookAddress = await contract.bookId(counter);
            counter++;
            let currentBook = await contract.books(currentBookAddress);
            if(currentBook.copies > 0) {
                result.push({bookId: currentBookAddress, title: currentBook.title, copies: currentBook.copies})
            }
        } catch {
            flag=true;
        }
    }
    return result;
}

/**
 * The function checks if a book is available to be reserved.
 * 
 * @param bookId - the id of the book 
 * @param contract - an instance of the library contract
 * @returns - a promise of type boolean, stating whether the book is available
 */
async function checkAvailability(bookId: any, contract: Contract): Promise<boolean> {
    let book;

    try {
        book = await contract.books(bookId);
    } catch {
        throw Error("There was an error while checking the availability of book with id: " + bookId );
    }

    if(book.copies > 0) {
        return true;
    } else {
        return false;
    }
}

/**
 * The function sends a transaction to the contract, which aims to reserve a book.
 * 
 * @param bookId - the id of the book to be reserved 
 * @param contract - an instance of the library contract 
 * @param account - a wallet of the account reserving the book
 * @param provider - the provider of the network
 */
async function reserveBook(bookId: any, contract: Contract, account: Wallet, provider: providers.JsonRpcProvider) {
    const bookToBeReserved = await contract.books(bookId);
    

    const testTx = await contract.populateTransaction.reserveBook(bookId);
    testTx.nonce = await account.getTransactionCount();
    testTx.gasPrice = await provider.getGasPrice();
    testTx.gasLimit = BigNumber.from(30000000);
    
    const approveTxSigned = await account.signTransaction(testTx);
    const submittedTx = await provider.sendTransaction(approveTxSigned);
    const approveReceipt = await submittedTx.wait();

    if (approveReceipt.status != 1) {
        throw Error("There was an error while reserving book with id: " +  bookId);
    } else {
        const reservedBook = await contract.books(bookId);
        if(reservedBook.copies + 1 === bookToBeReserved.copies) {
            console.log("Book with id " + bookId + " was reserved.");
        }
    }
}

/**
 * The function sends a transaction to the contract, which aims to return a book. 
 * 
 * @param bookId - the id of the book to be returned
 * @param contract - an instance of the library contract
 * @param account - a wallet of the account returning the book
 * @param provider - the provier of the network
 */
async function returnBook(bookId: any, contract: Contract, account: Wallet, provider: providers.JsonRpcProvider) {
    
    const testTx = await contract.populateTransaction.returnBook(bookId);
    testTx.nonce = await account.getTransactionCount();
    testTx.gasPrice = await provider.getGasPrice();
    testTx.gasLimit = BigNumber.from(30000000);
    
    const approveTxSigned = await account.signTransaction(testTx);
    const submittedTx = await provider.sendTransaction(approveTxSigned);
    const approveReceipt = await submittedTx.wait();
    
    if (approveReceipt.status != 1) {
        throw Error("There was an error while return book with id: " + bookId);
    } else {
        console.log("The book with id " + bookId + " was returned.");
    }   
    
}

run()