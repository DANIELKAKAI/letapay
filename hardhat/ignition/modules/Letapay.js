const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const LetapayModule = buildModule("LetapayModule", (m) => {
    const letapay = m.contract("LetapayV2");

    return { letapay };
});

module.exports = LetapayModule;