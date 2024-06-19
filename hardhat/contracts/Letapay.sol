// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Letapay {
    string public name = "Letapay";

    address public owner;

    address private cUsdAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    enum Status {
        AWAITING_PAYMENT,
        COMPLETE
    }

    struct Payment {
        string paymentId;
        uint256 amount;
        Status status;
        address senderAddress;
        address recieverAddress;
    }

    mapping(string => Payment) public payments;

    event PaymentAdded(
        string paymentId,
        address senderAddress,
        address recieverAddress,
        uint256 amount
    );

    event PaymentCompleted(
        string paymentId,
        address senderAddress,
        address recieverAddress,
        uint256 amount
    );

    constructor() {
        owner = msg.sender;
    }

    function addPayment(
        address recieverAddress,
        string memory paymentId,
        uint256 amount
    ) external {
        Payment memory newPayment = Payment({
            paymentId: paymentId,
            amount: amount,
            status: Status.AWAITING_PAYMENT,
            senderAddress: msg.sender,
            recieverAddress: recieverAddress
        });

        payments[paymentId] = newPayment;

        //transfer funds to contract
        require(
            IERC20(cUsdAddress).transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        emit PaymentAdded(paymentId, msg.sender, recieverAddress, amount);
    }

    function completePayment(string memory paymentId) external {
        require(
            msg.sender == owner,
            "Only contract owner can make this transaction"
        );

        require(
            payments[paymentId].status == Status.AWAITING_PAYMENT,
            "Payment must be awaiting payment status"
        );

        // transfer from contract to reciever
        require(
            IERC20(cUsdAddress).transferFrom(
                address(this),
                payments[paymentId].recieverAddress,
                payments[paymentId].amount
            ),
            "Transfer failed"
        );

        payments[paymentId].status = Status.COMPLETE;

        emit PaymentCompleted(
            paymentId,
            payments[paymentId].senderAddress,
            payments[paymentId].recieverAddress,
            payments[paymentId].amount
        );
    }
}
