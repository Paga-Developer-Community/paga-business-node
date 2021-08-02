# PagaBusiness Nodejs API Library v2.0.1

## Business Services exposed by the library

- registerCustomer
- registerCustomerAccountPhoto
- registerCustomerIdentification
- moneyTransfer
- airtimePurchase
- merchantPayment
- validateDepositToBank
- depositToBank
- accountBalance
- transactionHistory
- recentTransactionHistory
- getMerchants
- getMerchantServices
- getBanks
- getOperationStatus
- getMobileOperators
- getDataBundleByOperator
- onboardMerchant
- moneyTransferBulk

For more information on the services listed above, visit the [Paga DEV website](https://mypaga.readme.io/docs/node-library-2)

## How to use

`npm install paga-business`

`For paga-business version = 2.0.1`

```bash
const PagaBusinessClient = require('paga-business')

var pagaBusinessClient = new PagaBusinessClient().
                            .setPrincipal("<publicId>")
                            .setCredential("<password>")
                            .setApiKey("<apiKey>")
                            .setIsTest(true)
                            .build();
```

`For paga-business version <= 1.6.0`

```
const PagaBusinessClient = require('paga-business')

var pagaBusinessClient = PagaBusinessClient.Builder()
                            .setPrincipal("<publicId>")
                            .setCredential("<password>")
                            .setApiKey("<apiKey>")
                            .setIsTest(true)
                            .build();
```

As shown above, you set the principal and credential given to you by Paga, If you pass true as the value for setIsTest(), the library will use the test url as the base for all calls. Otherwise setting it to false will use the live url value you **pass** as the base.

### Business Service Functions

**Register Customer**

The Register Customer operation allows 3rd Parties to register customers on Paga. New customers will be contacted to setup their authentication credentials. To make use of this function, call the **registerCustomer** inside the BusinessClient which will return a JSONObject for the registered customer.

```
pagaBusinessClient.registerCustomer(
    "referenceNumber",
    "customerPhoneNumber",
    "customerEmail",
    "customerFirstName",
    "customerLastName",
    "customerDateOfBirth",
).then(resp => {
    console.log(JSON.stringify(resp))
})
```

**Register Customer Account Photo**

An operation for a business to upload an account photo for a customer account that it has registered. This is useful in case the account photo is not available or the upload fails or is rejected during the initial registration attempt.
To make use of this function, call the **registerCustomerAccountPhoto** function inside the BusinessClient Library which will return a JSONObject.

```
pagaBusinessClient.registerCustomerAccountPhoto("referenceNumber",
    "customerPhoneNumber",
    file).then(resp => {
        console.log(JSON.stringify(resp))
    })
```

**Register Customer Identification**

An operation for a business to upload an identification photo for a customer account that it has registered.
To make use of this function, call the **registerCustomerIdentification** function inside the BusinessClient Library which will return a JSONObject.

```
pagaBusinessClient.registerCustomerIdentification("referenceNumber",
    "customerPhoneNumber",
    "customerIdType",
    "customerIdNumber",
    "customerIdExpirationDate",
    file).then(resp => {
        console.log(JSON.stringify(resp))
    })
```

**Money Transfer**

The Money Transfer operation enables an integrated 3rd party to utilize the Paga platform to transfer funds from a variety of sources to another party. The funds transfer may be executed from the accounts of the integrated 3rd party themselves, or on behalf of another customer with the appropriate authentication. The source of funds may be the sender's Paga account or another source that the sender has pre-registered on the Paga platform.
To make use of this function, call the **moneyTransfer** inside the BusinessClient Library which will return a JSONObject for the money transferred.

```
pagaBusinessClient.moneyTransfer("referenceNumber",
    "amount",
    "currency",
    "destinationAccount",
    "destinationBank",
    "senderPrincipal",
    "senderCredentials",
    "withdrawalCode",
    "sourceOfFunds",
    "transferReference",
    "suppressRecipientMessage",
    "locale",
    "alternateSenderName",
    "minRecipientKYCLevel",
    "holdingPeriod").then(resp => {
        console.log(JSON.stringify(resp))
    })
```

**Airtime Purchase**

The Airtime Purchase operation enables an integrated 3rd party to utilize the Paga platform to purchase airtime for any phone number on any of the major networks. The purchase can be funded by the integrated 3rd party themselves, or on behalf of another customer with the appropriate authentication. The source of funds may be the purchaser's Paga account or another source that the sender has pre-registered on the Paga platform.
To make use of this function, call the **airtimePurchase** function inside the BusinessClient Library which will return a JSONObject for the airtime purchased.

```
pagaBusinessClient.airtimePurchase("referenceNumber",
    "amount",
    "currency",
    "destinationNumber",
    "purchaserPrincipal",
    "purchaserCredentials",
    "sourceOfFunds",
    "locale").then(resp => {
        console.log(JSON.stringify(resp))
    })
```

**Merchant Payment**

The Merchant Payment operation enables an integrated 3rd party to utilize the Paga platform to make payments to registered merchants. The purchase can be funded by the integrated 3rd party themselves, or on behalf of another customer with the appropriate authentication. The source of funds may be the purchaser's Paga account or another source that the sender has pre-registered on the Paga platform. To make use of this function, call the **merchantPayment** function inside the BusinessClient Library which will return a JSONObject for the merchant payment.

```
pagaBusinessClient.merchantPayment("merchantReferenceNumber",
    "amount",
    "merchantAccount",
    "referenceNumber",
    "currency",
    "merchantService",
    "purchaserPrincipal",
    "purchaserCredentials",
    "sourceOfFunds",
    "locale").then(resp => {
        console.log(JSON.stringify(resp))
    })
```

**Validate Deposit to Bank**

The Validate Deposit To Bank operation enables an integrated 3rd party to pre-validate a potential deposit to bank operation using similar parameters that would be provided for the actual deposit to bank operation. This will return a result indicating whether the actual deposit to bank operation using the same parameters is likely to be successful or not, and if not, why not. This will also validate the bank account number for the bank provided and return the account holder name for that account as stored at the bank. This will also return any fees that would be charged as part of the actual deposit to bank operation.To make use of this function, call the **validateDepositToBank** function inside the BusinessClient Library which will return a JSONObject for the validate deposit to bank.

```
pagaBusinessClient.validateDepositToBank("referenceNumber",
    "amount",
    "currency",
    "destinationBankUUID",
    "destinationBankAccountNumber",
    "recipientPhoneNumber",
    "recipientMobileOperatorCode",
    "recipientEmail",
    "recipientName",
    "locale").then(resp => {
        console.log(JSON.stringify(resp))
    })
```

**Deposit To Bank**

The Deposit To Bank operation enables an integrated 3rd party to utilize the Paga platform to deposit funds to any bank account. The funds will be deposited from the businesses Paga account to the bank via the  bank account specified in the operation parameters. To make use of this function, call the **depositToBank** function inside the BusinessClient Library which will return a JSONObject for the deposit to bank.

```
pagaBusinessClient.depositToBank("referenceNumber",
    "amount",
    "currency",
    "destinationBankUUID",
    "destinationBankAccountNumber",
    "recipientPhoneNumber",
    "recipientMobileOperatorCode",
    "recipientEmail",
    "recipientName",
    "alternateSenderName",
    "suppressRecipientMessage",
    "remarks",
    "locale").then(resp => {
        console.log(JSON.stringify(resp))
    })
```

**Account Balance**

The Account Balance operation enables an integrated 3rd party to utilize the Paga platform to check the balance of a Paga account or any other account type pre-registered on the Paga platform, which support balance inquiries. The account balance check may be executed for the account(s) of the integrated 3rd party themselves, or on behalf of another customer with the appropriate authentication. To make use of this function, call the **accountBalance** function inside the BusinessClient Library which will return a JSONObject.

```
pagaBusinessClient.accountBalance("referenceNumber",
    "accountPrincipal",
    "accountCredentials",
    "sourceOfFunds",
    "locale").then(resp => {
        console.log(JSON.stringify(resp))
    })
```

**Transaction History**

The Transaction History operation enables an integrated 3rd party to utilize the Paga platform to check the transaction history of their Paga account between selected date ranges. The transaction history may be executed on the account(s) of the integrated 3rd party, or on behalf of another customer with the appropriate authentication. Transactions results are limited to the most recent 10,000 results. To make use of this function, call the **transactionHistory** function inside the BusinessClient Library which will return a JSONObject for the transaction history.

```
pagaBusinessClient.transactionHistory("referenceNumber",
    "accountPrincipal",
    "accountCredentials",
    "startDateUTC",
    "endDateUTC",
    "locale").then(resp => {
        console.log(JSON.stringify(resp))
    })
```

**Recent Transaction History**

The Recent Transaction History operation enables an integrated 3rd party to utilize the Paga platform to check the last 5 transactions on their Paga account. The  recent transaction history may be executed for the account(s) of the integrated 3rd party or on behalf of another customer with the appropriate authentication. To make use of this function, call the **recentTransactionHistory** function inside the BusinessClient Library which will return a JSONObject for the recent transaction history.

```
pagaBusinessClient.recentTransactionHistory("referenceNumber",
    "accountPrincipal",
    "accountCredentials",
    "locale").then(resp => {
        console.log(JSON.stringify(resp))
    })
```

**Get Merchants**

The Get Merchants operation enables an integrated 3rd party to utilize the Paga platform to obtain a list of registered merchants on the Paga platform, typically for use in parameterizing the merchant payment operation. To make use of this function, call the **getMerchants** function inside the BusinessClient Library which will return a JSONObject.

```
pagaBusinessClient.getMerchants("referenceNumber", "locale")
    .then(resp => {
        console.log(JSON.stringify(resp))
    })
```

**Get Merchant Services**

The Get Merchants Services operation enables an integrated 3rd party to utilize the Paga platform to obtain a list of registered services and service details for a given registered merchant on the Paga platform, typically for use in parameterizing the merchant payment operation. To make use of this function, call the **getMerchantServices** function inside the BusinessClient Library which will return a JSONObject.

```
pagaBusinessClient.getMerchantServices("referenceNumber",
    "merchantPublicId",
    "locale").then(resp => {
        console.log(JSON.stringify(resp))
    })
```

**Get Banks**

The Get Banks operation enables an integrated 3rd party to utilize the Paga platform to obtain a list of available banks on the Paga platform, typically for use in parameterizing the deposit to bank operation. To make use of this function, call the **getBanks** function inside the BusinessClient Library which will return a JSONObject.

```
pagaBusinessClient.getBanks("referenceNumber", "locale")
    .then(resp => {
        console.log(JSON.stringify(resp))
    })
```

**Get Operation Status**

The Get Operation Status operation allows an integrated 3rd party to check on the status of a previous operation using the operation's reference number. To make use of this function, call the **getOperationStatus** function inside the BusinessClient Library which will return a JSONObject.

```
pagaBusinessClient.getOperationStatus("referenceNumber","locale")
  .then(resp => {
        console.log(JSON.stringify(resp))
  })
```

**Get Mobile Operators**

The Get Mobile Operators operation enables an integrated 3rd party to utilize the Paga platform to obtain a list of available mobile operators on the Paga platform, typically for use in parameterizing the various operations of the business api. To make use of this function, call the **getMobileOperators** function inside the BusinessClient Library which will return a JSON Object .

```
pagaBusinessClient.getMobileOperators("referenceNumber","locale")
  .then(resp => {
        console.log(JSON.stringify(resp))
    })
```

**Get Data Bundle By Operator**

The Get Data Bundle By Operator  operation enables an integrated 3rd party to utilize the Paga platform to obtain a list of available data bundles associated with a mobile operator. To make use of this function, call the **getDataBundleOperator** function inside the BusinessClient Library which will return a JSON Object .

```
pagaBusinessClient.getDataBundleByOperator("referenceNumber","operatorPublicId")
  .then(resp => {
        console.log(JSON.stringify(resp))
    })
```

**Bulk Money Transfer**

The Bulk Money Transfer operation enables an integrated 3rd party to utilize the Paga platform to execute the money transfer operation described above to multiple recipients simultaneously. This is limited to 300 payment items per bulk operation. To make use of this function, call the **moneyTransferBulk** function inside the BusinessClient Library which will return a JSON Object.

```
pagaBusinessClient.moneyTransferBulk('bulkReferenceNumber', moneyTransferItems)
    .then(resp => {
        console.log(JSON.stringify(resp))
    })
```

Click  [here](https://mypaga.readme.io/docs/business-rest-api-operations#section-18-bulk-money-transfer) for more info on **MoneyTransferItem**

**Onboard Merchant**

The Onboard Merchant operation, allows Aggregator Organisations to create sub organisations on the paga platform.

**This operation is only available to Merchant aggregators on the Paga platform.**

```
pagaBusinessClient.onboardMerchant(
    'referenceNumber',
    merchantExternalId,
    merchantInfo,
    integration)
    .then(resp => {
        console.log(JSON.stringify(resp))
    })
```

Click [here](https://mypaga.readme.io/docs/business-rest-api-operations#section-17-onboard-merchant) to get more info on **OnboardMerchant**.
