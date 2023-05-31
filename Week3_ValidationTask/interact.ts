import { ethers, BigNumber, Contract, Wallet } from "ethers";
import { providers } from "ethers";
import LibraryArtifact from "./artifacts/contracts/Library.sol/Library.json";

interface Book {
    bookId: string,
    copies: number,
    title: string
}

async function run() {
    const contractAddress = "ADDRESS_OF_LOCALLY_DEPLOYED_CONTRACT"
    const provider = new providers.JsonRpcProvider("http://127.0.0.1:8545/");
    const libraryContract = new ethers.Contract(contractAddress, LibraryArtifact.abi, provider);
    const account = new ethers.Wallet("PRIVATE_KEY_OF_THE_OWNER_OF_LIBRARY_CONTRACT", provider);
    
    const bookTitle = "TestBook";
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

async function getAvailableBooks(contract: Contract): Promise<Book[]> {
    let counter = 0;
    let currentBookAddress;
    let flag:boolean = false;
    let result:Book[] = [];
    while(!flag) {
        try {
            currentBookAddress = await contract.bookId(counter);
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

async function checkAvailability(bookId: any, contract: Contract): Promise<boolean> {
    let book = await contract.books(bookId);
    if(book.copies > 0) {
        return true;
    } else {
        return false;
    }
}

async function reserveBook(bookId: any, contract: Contract, account: Wallet, provider: providers.JsonRpcProvider) {
    const bookToBeReserved = await contract.books(bookId);
    

    const testTx = await contract.populateTransaction.reserveBook(bookId);
    testTx.nonce = await account.getTransactionCount();
    testTx.gasPrice = await provider.getGasPrice();
    testTx.gasLimit = BigNumber.from(30000000);
    
    const approveTxSigned = await account.signTransaction(testTx);
    const submittedTx = await provider.sendTransaction(approveTxSigned);
    const approveReceipt = await submittedTx.wait();
    
    const reservedBook = await contract.books(bookId);

    if(reservedBook.copies + 1 === bookToBeReserved.copies) {
        console.log("The book was reserved");
    }

}

async function returnBook(bookId: any, contract: Contract, account: Wallet, provider: providers.JsonRpcProvider) {
    
    const testTx = await contract.populateTransaction.returnBook(bookId);
    testTx.nonce = await account.getTransactionCount();
    testTx.gasPrice = await provider.getGasPrice();
    testTx.gasLimit = BigNumber.from(30000000);
    
    const approveTxSigned = await account.signTransaction(testTx);
    const submittedTx = await provider.sendTransaction(approveTxSigned);
    const approveReceipt = await submittedTx.wait();
    
    if (approveReceipt.status != 1) {
        console.log("The book was not returned")
    } else {
        console.log("The book was returned");
    }   
    
}

run()