import { USElection__factory } from "./../typechain-types/factories/Election.sol/USElection__factory";
import { USElection } from "./../typechain-types/Election.sol/USElection";
import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

describe("USElection", function () {
  let usElectionFactory;
  let usElection: USElection;
  let owner: SignerWithAddress;
  let otherAccount: SignerWithAddress;

  beforeEach(async () => {
    usElectionFactory = await ethers.getContractFactory("USElection");

    usElection = await usElectionFactory.deploy();

    [owner, otherAccount] = await ethers.getSigners();

    await usElection.deployed();
  });

  it("Should return the current leader before submit any election results", async function () {
    expect(await usElection.currentLeader()).to.equal(0); // NOBODY
  });

  it("Should return the election status", async function () {
    expect(await usElection.electionEnded()).to.equal(false); // Not Ended
  });

  it("Should submit state results and get current leader", async function () {
    const stateResults = ["California", 1000, 900, 32];

    const submitStateResultsTx = await usElection.submitStateResult(
      stateResults
    );

    await submitStateResultsTx.wait();

    expect(await usElection.currentLeader()).to.equal(1); // BIDEN
  });

  it("Should throw when try to submit already submitted state results", async function () {
    const stateResults = ["California", 1000, 900, 32];

    expect(await usElection.submitStateResult(stateResults)).to.be.revertedWith(
      "This state result was already submitted!"
    );
  });

  it("Should submit state results and get current leader", async function () {
    const stateResults = ["Ohaio", 800, 1200, 33];

    const submitStateResultsTx = await usElection.submitStateResult(
      stateResults
    );

    await submitStateResultsTx.wait();

    expect(await usElection.currentLeader()).to.equal(2); // TRUMP
  });

  //TODO: ADD YOUR TESTS
  it("Should throw on non-owner trying to submit state results", async function () {
    const stateResults = ["Wyoming", 800, 1200, 50];

    await expect(usElection.connect(otherAccount).submitStateResult(stateResults)).to.be.revertedWith(
      "Not invoked by the owner"
    );
  });

  it("Should throw when try to submit results on ended election", async function () {
    const endElectionTransaction = await usElection.endElection();

    await endElectionTransaction.wait();
    
    const stateResults = ["Alaska", 700, 1000, 60];
    
    await expect(usElection.submitStateResult(stateResults)).to.be.revertedWith(
      "The election has ended already"
    );
  });

  it("Should end the elections, get the leader and election status", async function () {
    const endElectionTx = await usElection.endElection();

    await endElectionTx.wait();

    expect(await usElection.currentLeader()).to.equal(0); // TRUMP

    expect(await usElection.electionEnded()).to.equal(true); // Ended
  });

  it("Should throw on non-positive amount of state seats", async function () {
    const stateResults = {name: "Washington", votesBiden: 700, votesTrump: 1000, stateSeats: 0};

    await expect(usElection.submitStateResult(stateResults)).to.be.revertedWith(
      "States must have at least 1 seat"
    );
  });

  it("Should throw on equal amount of votes for both parties", async function () {
    const stateResults = {name: "South Dakota", votesBiden: 100, votesTrump: 100, stateSeats: 100};
    await expect(usElection.submitStateResult(stateResults)).to.be.revertedWith(
      "There cannot be a tie"
    );
  });

  it("Should throw on results for a state with submitted results", async function () {
    const stateResults1 = {name: "Hawaii", votesBiden: 1000, votesTrump: 500, stateSeats: 20};

    const stateResults2 = {name: "Hawaii", votesBiden: 1001, votesTrump: 500, stateSeats: 20}

    await usElection.submitStateResult(stateResults1);

    await expect(usElection.submitStateResult(stateResults2)).to.be.revertedWith(
      "This state result was already submitted!"
    );
  });

  it("Should throw on non-owner trying to end election", async function () {
    await expect(usElection.connect(otherAccount).endElection()).to.be.revertedWith(
      "Not invoked by the owner"
    );
  })

  it("Should throw on trying to end an already ended election", async function () {
    await usElection.endElection();

    await expect(usElection.endElection()).to.be.revertedWith(
      "The election has ended already"
    );
  })

});
