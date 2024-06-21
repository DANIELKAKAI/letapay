
const { expect } = require("chai");

const { ethers } = require('hardhat');

const {
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Letapay contract", function () {
    async function deployContractFixture() {

        const [owner, sender, reciever] = await ethers.getSigners();

        const payment = { paymentId: "22", recieverAddress: reciever, amount: 10 };

        const letapayContract = await ethers.deployContract("Letapay");

        await letapayContract.waitForDeployment();

        return { payment, letapayContract, owner, sender, reciever };
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const { letapayContract, owner } = await loadFixture(deployContractFixture);
            expect(await letapayContract.owner()).to.equal(owner.address);
        });

    });

    describe("Add Payment", function () {
        it("Sender Can Add Payment", async function () {
            const { payment, letapayContract, sender, reciever } = await loadFixture(deployContractFixture);

            await expect(letapayContract.connect(sender).addPayment(payment.paymentId, reciever.address, payment.amount))
                .to.emit(letapayContract, "PaymentAdded")
                .withArgs(payment.paymentId, sender.address, reciever.address, payment.amount);

            let newPayment = await letapayContract.getPayment(payment.paymentId);

            expect(newPayment.paymentId).to.equal(payment.paymentId);
            expect(newPayment.amount).to.equal(payment.amount);
            expect(newPayment.senderAddress).to.equal(sender.address);
            expect(newPayment.recieverAddress).to.equal(reciever.address);
            expect(newPayment.status).to.equal(0); //AWAITING_TRANSFER
        });
    });

    describe("Complete Payment", function () {
        it("Owner Can Complete Payment", async function () {
            const { payment, letapayContract, owner, sender, reciever } = await loadFixture(deployContractFixture);

            letapayContract.connect(sender).addPayment(payment.paymentId, reciever.address, payment.amount)

            await expect(letapayContract.connect(owner).completePayment(payment.paymentId))
                .to.emit(letapayContract, "PaymentCompleted")
                .withArgs(payment.paymentId, sender.address, reciever.address, payment.amount);

            let newPayment = await letapayContract.getPayment(payment.paymentId);

            expect(newPayment.status).to.equal(1); //COMPLETE
        });
    });

});