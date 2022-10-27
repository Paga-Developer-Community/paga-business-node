const UtilFunction = require("./UtilFunction");
const Builder = require("../PagaBusinessClient");

const requestType = {
    FORM_DATA: "formData"
}

class PagaBusiness extends UtilFunction {
    constructor(build) {
        super(build);
    }

    /**
     * @param {string | number | Date} date
     * @param {string} separator
     */
    formatDate(date, separator) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        // @ts-ignore
        return [year - month - day].join(separator);
    };


    /**
         * @param   {string}  referenceNumber        A unique reference number for this request. This same reference number will be returned in the response.
         * @param   {string}  customerPhoneNumber    The phone number of the new customer. This number must not belong to an existing registered customer
         * @param   {string}   customerEmail         The email of the new customer
         * @param   {string}  customerFirstName      The first name of the customer
         * @param   {string}  customerLastName       The Last name of the customer
         * @param   {string}  customerDateOfBirth    Birth date of the customer
         * @return {Promise}                         A Promise Object thats receives the response
         *         Sample Successful response =>    {
                                                        "message":"Thank for registering to paga. We will send SMS to +251911010862 with a registeration code. Please use www.mypaga.com or dial 636 to set up your user PIN.",
                                                        "referenceNumber":"",
                                                        "responseCode":0,
                                                        "pagaAccountNumber: 123456789"
                                                    }
         */
    async registerCustomer(
        referenceNumber,
        customerPhoneNumber,
        customerEmail,
        customerFirstName,
        customerLastName,
        customerDateOfBirth
    ) {
        try {
            let dob = (customerDateOfBirth != null) ? this.formatDate(customerDateOfBirth, '/') : null;

            const data = {
                referenceNumber,
                customerPhoneNumber,
                customerFirstName,
                customerLastName,
                customerEmail,
                "customerDateOfBirth": dob,
            };

            const hashParams = `${referenceNumber}${customerPhoneNumber}${customerFirstName}${customerLastName} `
            const header = this.buildHeader(hashParams);
            const response = await this.postRequest(header, data, this.getBaseUrl("registerCustomer"));
            return this.checkError(response);

        } catch (error) {
            throw new Error(error);
        }

    };

    /**
     * @param   {string}  referenceNumber               A unique reference number for this request. This same reference number will be returned in the response
     * @param   {string}  customerPhoneNumber           The phone number of the customer. This number must belong to an existing customer the YOU registered
     *
     *
     * @return  {Promise}                               A Promise Object thats receives the response
     *
     *  * Sample Successful Response =>    {
     *                                          "message" : "Photo upload failed: User account photo has already been set",
                                                "referenceNumber" : null
                                            }
                                                    
     */
    /**
     * @param {any} customerAccountPhoto
     */
    async registerCustomerAccountPhoto(
        referenceNumber,
        customerPhoneNumber, customerAccountPhoto) {

        try {

            let data = {
                referenceNumber,
                customerPhoneNumber,
                customerAccountPhoto
            };

            const hashParams = `${referenceNumber}${customerPhoneNumber}`;
            const header = this.buildFormHeader(hashParams);

            const response = await this.postRequest(header, data, this.getBaseUrl("registerCustomerAccountPhoto"), requestType.FORM_DATA);
            return this.checkError(response);
        } catch (error) {
            return new Error(error);
        }

    };


    /**
     * @param   {Object}  customer                The customer’s details
     * @param   {File}  customerIdPhoto           Photograph of the customer identification document Must be one of image types (). Image sze be ⇐ 500kb
     *
     *
     * @return  {Promise}                               A Promise Object thats receives the response
     *
     *  * Sample Successful Response =>    {
     *                                          "message" : "Photo upload failed: User account photo has already been set",
                                                "referenceNumber" : null
                                            }
                                                    
     */
    /**
     * @param {any} referenceNumber
     * @param {any} customerPhoneNumber
     * @param {any} customerIdType
     * @param {any} customerIdNumber
     * @param {any} customerIdExpirationDate
     */
    async registerCustomerIdentification(
        referenceNumber,
        customerPhoneNumber,
        customerIdType,
        customerIdNumber,
        customerIdExpirationDate,
        customerIdPhoto) {
        try {
            const data = {
                referenceNumber,
                customerPhoneNumber,
                customerIdType,
                customerIdNumber,
                customerIdExpirationDate
            };

            const hashParams = `${referenceNumber}${customerPhoneNumber}${customerIdType}${customerIdNumber}${customerIdExpirationDate}`;

            const header = this.buildFormHeader(hashParams);
            const response = await this.postRequest(header, data, this.getBaseUrl("registerCustomerIdentification"), requestType.FORM_DATA);
            return this.checkError(response);
        } catch (error) {
            return new Error(error);
        }


    };

    /**
     * @param   {string}  referenceNumber               A unique reference number provided by the business, identifying the transaction. This reference number will be preserved on the Paga platform to reconcile the operation across systems and will be returned in the response.
     * @param   {number}  amount                        The amount of money to transfer to the recipient.
     * @param   {number}  currency                      The currency of the operation, if being executed in a foreign currency.
     * @param   {string}  destinationAccount            The account identifier for the recipient receiving the money transfer. This account identifier may be a phone number, account nickname, or any other unique account identifier supported by the Paga platform. If destinationBank is specified, this is the bank account number.
     * @param   {string}  destinationBank               For money transfers to a bank account, this is the destination bank code.
     * @param   {string}  senderPrincipal               The authentication principal for the user sending money if the money is being sent on behalf of a user. If null, the money transfer will be processed from the 3rd parties own account.
     * @param   {string}  senderCredentials             The authentication credentials for the user sending money if the money is being sent on behalf of a user.
     * @param   {boolean} sendWithdrawalCode            If the cash is being sent on behalf of the third party itself (i.e. sender principal is null), then this indicates whether confirmation messages for funds sent to non Paga customers will include the withdrawal code in the message (true) or omit it (false). If false, then the withdrawal code will be returned in the withdrawalCode response parameter. For funds sent to Paga customers, the funds are deposited directly into the customer's account so no withdrawal code is necessary. Defaults to true.
     * @param   {string}  sourceOfFunds                 The name of a source account for funds. If null, the source sender's Paga account will be used as the funding source.
     * @param   {string}  transferReference             Additional transfer-specific reference information that may be required for transfer processing.
     * @param   {boolean} suppressRecipientMessage      Whether to prevent sending an SMS to the recipient of the money transfer. This can be used in cases where the business wishes to perform their own messaging. Defaults to false, meaning that messages are NOT suppressed.
     * @param   {string}  locale                        The language/locale to be used in messaging. If provided, this must conform to the IETF language tag standard.
     * @param   {string}  alternateSenderName           If the cash is being sent on behalf of the third party itself (i.e. sender principal is null), then an alternative name-of-sender can be specified here for use in the message sent to the money transfer recipient. This field is ignored if money transfer is sent on behalf of another user. This can be 16 characters in length.
     * @param   {number}  holdingPeriod                 The number of days with which the recipient's KYC must have before it is reverted back to the sender. It is only valid if the minKYCLevel is set and it's default to 120 days. If minKYCLevel is set and the recipient?s KYC is below it, then this will be the number of days it should wait to meet the minKYC Level provided. If the target KYC is not upgraded within this period the fund will be returned back to the sender?s account.
     * @param   {string}  minRecipientKYCLevel         The minimum target KYC level the money transfer transaction recipient's paga account must have, can be one of KYC1, KYC2, and KYC3.
                                                    
                                                    
     *
     * @return {Promise}                                A Promise Object thats receives the response
     *
     * Sample Successful Response =>    {
                                            "message":"Thank for registering to paga. We will send SMS to +251911010862 with a registeration code. Please use www.mypaga.com or dial 636 to set up your user PIN.",
                                            "responseCode":0, "referenceNumber": "","withdrawalCode": "",
                                            "transactionId": "",  "fee": "", "receiverRegistrationStatus": "",
                                            "currency": "", "exchangeRate": ""
                                        }
     *
     *
     */
    async moneyTransfer(
        referenceNumber,
        amount,
        currency,
        destinationAccount,
        destinationBank,
        senderPrincipal,
        senderCredentials,
        sendWithdrawalCode,
        sourceOfFunds,
        transferReference,
        suppressRecipientMessage,
        locale,
        alternateSenderName,
        minRecipientKYCLevel,
        holdingPeriod) {

        try {
            const data = {
                referenceNumber,
                amount,
                currency,
                destinationAccount,
                destinationBank,
                senderPrincipal,
                senderCredentials,
                sendWithdrawalCode,
                sourceOfFunds,
                transferReference,
                suppressRecipientMessage,
                locale,
                alternateSenderName,
                minRecipientKYCLevel,
                holdingPeriod
            };

            const hashParams = `${referenceNumber}${amount}${destinationAccount}`;
            const header = this.buildHeader(hashParams);
            const response = await this.postRequest(header, data, this.getBaseUrl("moneyTransfer"));
            return this.checkError(response);
        } catch (error) {
            throw new Error(error);
        }


    };


    /**
     * @param   {string}    referenceNumber             A unique reference number provided by the business, identifying the transaction. This reference number will be preserved on the Paga platform to reconcile the operation across systems and will be returned in the response.
     * @param   {number}    amount                      The amount of airtime to purchase.
     * @param   {number}    currency                    The currency of the operation, if being executed in a foreign currency.
     * @param   {string}    destinationPhoneNumber      The phone number for which airtime is being purchased. If null, and ­­­­Principal is specified, then the airtime will be purchased for the phone number of the purchaserPrincipal. Must be provided if the purchaserPrincipal is null.
     * @param   {Boolean}   isDataBundle                Default is False but signify as True to purchase data
     * @param   {string}    mobileOperatorServiceId     For Data purchase parse the value of mobileOperatorServiceId to indicate the preferred data package
     * @param   {string}    mobileOperatorPublicId      Parse the mobile operator public ID - not compulsory 
     * @param   {string}    purchaserPrincipal          The authentication principal for the user purchasing airtime if the airtime is being purchased on behalf of a user. If null, the airtime will be processed from the 3rd parties own account.
     * @param   {string}    purchaserCredentials        The authentication credentials for the user purchasing the airtime if the airtime is being purchased on behalf of a user.
     * @param   {string}    sourceOfFunds               The name of a source account for funds. If null, the source purchaser's Paga account will be used as the funding source.
     * @param   {string}    locale                      The language/locale to be used in messaging. If provided, this must conform to the IETF language tag standard.
     
     * @return {Promise}                                A Promise Object thats receives the response
                                                    
        Sample Successful Response =>   {
                                            "referenceNumber":"+251911314250",
                                            "message":"Airtime purchase request made successfully",
                                            "responseCode":0, ,”transactionId”:”At34”,”fee”:50.0,
                                            ”currency”:null,“exchangeRate”:null
                                        }
                                                    
                                                    
     */
    async airtimePurchase(
        referenceNumber,
        amount,
        currency,
        destinationPhoneNumber,
        isDataBundle,
        mobileOperatorServiceId,
        mobileOperatorPublicId,
        purchaserPrincipal,
        purchaserCredentials,
        sourceOfFunds,
        locale) {

        try {
            const data = {
                referenceNumber,
                amount,
                currency,
                destinationPhoneNumber,
                isDataBundle,
                mobileOperatorServiceId,
                mobileOperatorPublicId,
                purchaserPrincipal,
                purchaserCredentials,
                sourceOfFunds,
                locale
            };

            const hashParams = `${referenceNumber}${amount}${destinationPhoneNumber}`;
            const header = this.buildHeader(hashParams);
            const response = await this.postRequest(header, data, this.getBaseUrl("airtimePurchase"));
            return this.checkError(response);
        } catch (error) {
            throw new Error(error);
        }


    };





    /**
     * @param   {string}    referenceNumber             A unique reference number provided by the business, identifying the transaction. This reference number will be preserved on the Paga platform to reconcile the operation across systems and will be returned in the response.
     * @param   {number}    amount                      The amount of the merchant payment.
     * @param   {number}    currency                    The currency of the operation, if being executed in a foreign currency.
     * @param   {string}    merchantAccount             The account number identifying the merchant (eg. merchant Id, UUID).
     * @param   {string}    merchantReferenceNumber     The account/reference number identifying the customer on the merchant's system.
     * @param   {string}    merchantService             The list of merchant service codes specifying which of the merchant's services are being paid for.
     * @param   {string}    purchaserPrincipal          The authentication principal for the user paying the merchant if the payment is being made on behalf of a user. If null, the airtime will be processed from the 3rd parties own account.
     * @param   {string}    purchaserCredentials        The authentication credentials for the user paying the merchant if the payment is being made on behalf of a user.
     * @param   {string}    sourceOfFunds               The name of a source account for funds. If null, the source purchaser's Paga account will be used as the funding source.
     * @param   {string}    locale                      The language/locale to be used in messaging. If provided, this must conform to the IETF language tag standard.
     
     * @return {Promise}                                A Promise Object thats receives the response
                                                    
        Sample Successful Response =>   {
                                            "referenceNumber":"+251911314250", "merchantTransactionReference": "",
                                            "message":"Airtime purchase request made successfully","responseCode":0,
                                            ”transactionId”:”At34”,”fee”:50.0,”currency”:null,“exchangeRate”:null
                                        }
                                                    
     */
    async merchantPayment(
        merchantReferenceNumber,
        amount,
        merchantAccount,
        referenceNumber,
        currency,
        merchantService,
        purchaserPrincipal,
        purchaserCredentials,
        sourceOfFunds,
        locale) {

        try {
            const data = {
                merchantReferenceNumber,
                amount,
                merchantAccount,
                referenceNumber,
                currency,
                "merchantService": merchantService.split(','),
                purchaserPrincipal,
                purchaserCredentials,
                sourceOfFunds,
                locale
            };

            const hashParams = `${referenceNumber}${amount}${merchantAccount}${merchantReferenceNumber}`;
            const header = this.buildHeader(hashParams);
            const response = await this.postRequest(header, data, this.getBaseUrl("merchantPayment"));
            return this.checkError(response);
        } catch (error) {
            throw new Error(error);
        }

    };




    /**
     * @param   {string}    referenceNumber                     A unique reference number provided by the business, identifying the transaction. This reference number will be preserved on the Paga platform to reconcile the operation across systems and will be returned in the response.
     * @param   {number}    amount                              The amount of money to deposit to the destination bank and bank account provided. Your Paga account must contain sufficient funds to cover this amount plus any fees.
     * @param   {string}    currency                            The currency of the operation, if being executed in a foreign currency. The currency must be one of the currencies supported by the platform. For supported currencies, check with Paga integration operations support.
     * @param   {string}    destinationBankUUID                 The Paga bank UUID identifying the bank to which the deposit will be made. In order to get the list of supported banks and bank UUIDs, execute the getBanks operation defined in this document. Bank codes will not change though additional banks may be added to the list in the future.
     * @param   {string}    destinationBankAccountNumber        The ten digit NUBAN bank account number for the account to which the deposit will be made. This number should be a valid account number for the destination bank as specified by the destinationBankCode parameter above. Executing operation will validate this number and if valid, return the account holder name as stored at the bank for this account.
     * @param   {string}    recipientPhoneNumber                The mobile phone number of the recipient of the deposit to bank transaction. Either one or both of this parameter and the recipientEmail parameter must be provided. If this parameter is provided, this operation will validate that it is a valid phone number.
     * @param   {string}    recipientMobileOperatorCode         Ignored if recipientPhoneNumber parameter is not provided. This describes the mobile operator that the recipientPhoneNumber belongs to. If recipientPhoneNumber is provided, but this parameter is not, a default mobile operator will selected based on the phone number pattern, but this may not be correct due to number portability of mobile phone numbers and may result in delayed or failed delivery of any SMS messages to the recipient.
     * @param   {string}    recipientEmail                      The email address of the recipient of the deposit to bank transaction. Either one or both of this parameter and the recipientPhoneNumber parameter must be provided. If this parameter is provided, this operation will validate that it is a valid email address format.
     * @param   {string}    recipientName                       The name of the recipient. This parameter is currently bot validated.
     * @param   {string}    locale                              The language/locale to be used in messaging. If provided, this must conform to the IETF language tag standard.
     
     * @return {Promise}                                        A Promise Object thats receives the response
                                                    
        Sample Successful Response =>   {
                                            "referenceNumber":"+251911314250",
                                            "message":"Airtime purchase request made successfully",
                                            "responseCode":0, , "fee":50.0, "destinationAccountHolderNameAtBank":null
                                        }
                                                    
     */
    async validateDepositToBank(
        referenceNumber,
        amount,
        currency,
        destinationBankUUID,
        destinationBankAccountNumber,
        recipientPhoneNumber,
        recipientMobileOperatorCode,
        recipientEmail,
        recipientName,
        locale) {

        try {
            const data = {
                referenceNumber,
                amount,
                currency,
                destinationBankUUID,
                destinationBankAccountNumber,
                recipientPhoneNumber,
                recipientMobileOperatorCode,
                recipientEmail,
                recipientName,
                locale
            };

            const hashParams = `${referenceNumber}${amount}${destinationBankUUID}${destinationBankAccountNumber}`;
            const header = this.buildHeader(hashParams);
            const response = await this.postRequest(header, data, this.getBaseUrl("validateDepositToBank"));
            return this.checkError(response);
        } catch (error) {
            throw new Error(error);
        }


    };





    /**
     * @param   {string}    referenceNumber                     A unique reference number provided by the business, identifying the transaction. This reference number will be preserved on the Paga platform to reconcile the operation across systems and will be returned in the response.
     * @param   {number}    amount                              The amount of money to deposit to the destination bank and bank account provided. Your Paga account must contain sufficient funds to cover this amount plus any fees.
     * @param   {string}    currency                            The currency of the operation, if being executed in a foreign currency. The currency must be one of the currencies supported by the platform. For supported currencies, check with Paga integration operations support.
     * @param   {string}    destinationBankUUID                 The Paga bank UUID identifying the bank to which the deposit will be made. In order to get the list of supported banks and bank UUIDs, execute the getBanks operation defined in this document. Bank codes will not change though additional banks may be added to the list in the future.
     * @param   {string}    destinationBankAccountNumber        The ten digit NUBAN bank account number for the account to which the deposit will be made. This number should be a valid account number for the destination bank as specified by the destinationBankCode parameter above. Executing operation will validate this number and if valid, return the account holder name as stored at the bank for this account.
     * @param   {string}    recipientPhoneNumber                The mobile phone number of the recipient of the deposit to bank transaction. Either one or both of this parameter and the recipientEmail parameter must be provided. If this parameter is provided, this operation will validate that it is a valid phone number.
     * @param   {string}    recipientMobileOperatorCode         Ignored if recipientPhoneNumber parameter is not provided. This describes the mobile operator that the recipientPhoneNumber belongs to. If recipientPhoneNumber is provided, but this parameter is not, a default mobile operator will selected based on the phone number pattern, but this may not be correct due to number portability of mobile phone numbers and may result in delayed or failed delivery of any SMS messages to the recipient.
     * @param   {string}    recipientEmail                      The email address of the recipient of the deposit to bank transaction. Either one or both of this parameter and the recipientPhoneNumber parameter must be provided. If this parameter is provided, this operation will validate that it is a valid email address format.
     * @param   {string}    recipientName                       The name of the recipient. This parameter is currently bot validated.
     * @param   {string}    alternateSenderName                 In notifications sent to the recipient, your business display name (if set), or business name (if display name not set) is included. If you wish notifications to indicate the deposit to bank as coming from an alternate name, you may set the alternate name in this parameter. This parameter length is limited to 20 characters and will be truncated if longer.
     * @param   {string}    suppressRecipientMessage            If this field is set to true, no notification message (SMS or email) will be sent to the recipient. IF omitted or set to false, an email or SMS will be sent to recipient as described above.
     * @param   {string}    remarks                             Additional bank transfer remarks that you may wish to appear on your bank statement record for this transaction. Remarks are limited to 30 characters and will be truncated if longer.
     * @param   {string}    locale                              The language/locale to be used in messaging. If provided, this must conform to the IETF language tag standard.
     
     * @return {Promise}                                        A Promise Object thats receives the response
                                                    
        Sample Successful Response =>   {
                                            "referenceNumber":"+251911314250",
                                            "message":"Airtime purchase request made successfully",
                                            "responseCode":0, "transactionId":  "", "fee":50.0,
                                            "currency": "", "exchangeRate": "", "destinationAccountHolderNameAtBank":null
                                        }
                                                    
                                                    
     */
    async depositToBank(
        referenceNumber,
        amount,
        currency,
        destinationBankUUID,
        destinationBankAccountNumber,
        recipientPhoneNumber,
        recipientMobileOperatorCode,
        recipientEmail,
        recipientName,
        alternateSenderName,
        suppressRecipientMessage,
        remarks,
        locale) {

        try {
            const data = {
                referenceNumber,
                amount,
                currency,
                destinationBankUUID,
                destinationBankAccountNumber,
                recipientPhoneNumber,
                recipientMobileOperatorCode,
                recipientEmail,
                recipientName,
                alternateSenderName,
                suppressRecipientMessage,
                remarks,
                locale
            };

            let hashParams = `${referenceNumber}${amount}${destinationBankUUID}${destinationBankAccountNumber}`;
            const header = this.buildHeader(hashParams);
            const response = await this.postRequest(header, data, this.getBaseUrl("depositToBank"));
            return this.checkError(response);
        } catch (error) {
            throw new Error(error);
        }

    };



    /**
     * @param   {string}    referenceNumber         A unique reference number provided by the business, identifying the transaction. This reference number will be preserved on the Paga platform to reconcile the operation across systems and will be returned in the response.
     * @param   {string}    accountPrincipal        The authentication principal for the user who's balance is being inquired, if the inquiry is being made on behalf of a user. If null, the balance inquiry will be processed from the 3rd parties own account.
     * @param   {string}    accountCredentials      The authentication credentials for the user who's balance is being inquired, if the inquiry is being made on behalf of a user.
     * @param   {string}    sourceOfFunds           The name of a source account on which to check the balance. If null, the Paga account balance with be retrieved.
     * @param   {string}    locale                  The language/locale to be used in messaging. If provided, this must conform to the IETF language tag standard.
     
     * @return {Promise}                            A Promise Object thats receives the response
                                                    
        Sample Successful Response =>   {
                                            "referenceNumber":"+251911314250", "message":"Airtime purchase request made successfully",
                                            "responseCode":0, ,”totalBalance”:”100.0”,”availableBalance”:50.0,
                                            ”currency”:null,“balanceDateTimeUTC”:null
                                        }
                                                    
     */
    async accountBalance(
        referenceNumber,
        accountPrincipal,
        accountCredentials,
        sourceOfFunds,
        locale) {
        try {

            const data = {
                referenceNumber,
                accountPrincipal,
                accountCredentials,
                sourceOfFunds,
                locale
            };

            const hashParams = referenceNumber;
            const header = this.buildHeader(hashParams);
            const response = await this.postRequest(header, data, this.getBaseUrl("accountBalance"));
            return this.checkError(response);
        } catch (error) {
            throw new Error(error);
        }

    };






    /**
     * @param   {string}    referenceNumber         A unique reference number provided by the business, identifying the transaction. This reference number will be preserved on the Paga platform to reconcile the operation across systems and will be returned in the response.
     * @param   {string}    accountPrincipal        The authentication principal for the user who's transaction history is being retrieved, if the inquiry is being made on behalf of a user. If null, the balance inquiry will be processed from the 3rd parties own account.
     * @param   {string}    accountCredentials      The authentication credentials for the user who's transaction history is being retrieved, if the inquiry is being made on behalf of a user.
     * @param   {Date}      startDateUTC            The start date of the interval for which transaction history results should be returned. The results are inclusive of this date and it should include hour, minute and second values in addition to the date.
     * @param   {Date}      endDateUTC              The start date of the interval for which transaction history results should be returned. The results are exclusive of this date and it should include hour, minute and second values in addition to the date.
     * @param   {string}    locale                  The language/locale to be used in messaging. If provided, this must conform to the IETF language tag standard.
     
     *@return   {Promise}                           A Promise Object thats receives the response
                                                    
        Sample Successful Response =>   {
                                            "referenceNumber":"+251911314250", "message":"Airtime purchase request made successfully",
                                            "responseCode":0, "recordCount": 0,
                                            items:
                                                [{
                                                    "itemNumber": "", "dateUTC": "",
                                                    "description": "", "amount": "", "status": "",
                                                    "referenceNumber": "+251911314250", "transactionId": "At34",
                                                    "currency":null, "exchangeRate":null
                                                }],
                                            "currency": ""
                                        }
                                                    
     */
    async transactionHistory(
        referenceNumber,
        accountPrincipal,
        accountCredentials,
        startDateUTC,
        endDateUTC,
        locale) {

        try {
            const data = {
                referenceNumber,
                accountPrincipal,
                accountCredentials,
                startDateUTC,
                endDateUTC,
                locale
            };

            const hashParams = referenceNumber;
            const header = this.buildHeader(hashParams);
            const response = await this.postRequest(header, data, this.getBaseUrl("transactionHistory"));
            return this.checkError(response);
        } catch (error) {
            throw new Error(error);
        }


    };








    /**
     * @param   {string}    referenceNumber         A unique reference number provided by the business, identifying the transaction. This reference number will be preserved on the Paga platform to reconcile the operation across systems and will be returned in the response
     * @param   {string}    accountPrincipal        The authentication principal for the user who's transaction history is being retrieved, if the inquiry is being made on behalf of a user. If null, the balance inquiry will be processed from the 3rd parties own account.
     * @param   {string}    accountCredentials      The authentication credentials for the user who's transaction history is being retrieved, if the inquiry is being made on behalf of a user.
     * @param   {string}    locale                  The language/locale to be used in messaging. If provided, this must conform to the IETF language tag standard
     
     * @return {Promise}                            A Promise Object thats receives the response
                                                    
        Sample Successful Response =>   {
                                            "referenceNumber":"+251911314250", "message":"Airtime purchase request made successfully",
                                            "responseCode":0, "recordCount": 0,
                                            items:
                                                [{
                                                    "itemNumber": "", "dateUTC": "", "description": "", "amount": "",
                                                    "status": "", "referenceNumber": "+251911314250",
                                                    "transactionId": "At34","currency":null, "exchangeRate":null
                                                }],
                                            "currency": ""
                                        }
                                                    
     */
    async recentTransactionHistory(
        referenceNumber,
        accountPrincipal,
        accountCredentials,
        locale) {

        try {
            const data = {
                referenceNumber,
                accountPrincipal,
                accountCredentials,
                locale
            };
            const hashParams = referenceNumber;
            const header = this.buildHeader(hashParams);
            const response = await this.postRequest(header, data, this.getBaseUrl("recentTransactionHistory"));
            return this.checkError(response);
        } catch (error) {
            throw new Error(error);
        }


    };



    /**
     * @param   {string}    referenceNumber         A unique reference number provided by the business, identifying the transaction. This reference number will be preserved on the Paga platform to reconcile the operation across systems and will be returned in the response
     * @param   {string}    locale                  The language/locale to be used in messaging. If provided, this must conform to the IETF language tag standard
     
     * @return {Promise}                            A Promise Object thats receives the response
                                                    
        Sample Successful Response =>   {
                                            "referenceNumber":"+251911314250", "message":"Airtime purchase request made successfully",
                                            "responseCode":0,
                                            "merchants":
                                                [{
                                                    "name": "", "uuid": "", "id": "", "code": ""
                                                }]
                                        }
                                                    
     */
    async getMerchants(
        referenceNumber,
        locale) {

        try {

            const data = {
                referenceNumber,
                locale
            };

            const hashParams = referenceNumber;
            console.log(hashParams);
            const header = this.buildHeader(hashParams);
            console.log(header);
            const response = await this.postRequest(header, data, this.getBaseUrl("getMerchants"));
            const sam = await this.checkError(response);
            return sam;
        } catch (error) {
            throw new Error(error);
        }

    };





    /**
     * @param   {string}    referenceNumber         A unique reference number provided by the business, identifying the transaction. This reference number will be preserved on the Paga platform to reconcile the operation across systems and will be returned in the response
     * @param   {string}    merchantPublicId             The identifier which uniquely identifies the merchant on the Paga platform. May be the merchant UUID, id, or code.
     * @param   {string}    locale                  The language/locale to be used in messaging. If provided, this must conform to the IETF language tag standard
     
     * @return {Promise}                            A Promise Object thats receives the response
                                                    
        Sample Successful Response =>   {
                                            "referenceNumber":"+251911314250",
                                            "message":"Airtime purchase request made successfully",
                                            "responseCode":0,
                                            "services":
                                                [{
                                                    "name": "", "price": "", "shortCode": "", "code": ""
                                                }]
                                        }
                                                    
     */
    async getMerchantServices(
        referenceNumber,
        merchantPublicId,
        locale) {

        try {
            const data = {
                referenceNumber,
                merchantPublicId,
                locale
            };

            const hashParams = `${referenceNumber}${merchantPublicId}`;
            const header = this.buildHeader(hashParams);
            const response = await this.postRequest(header, data, this.getBaseUrl("getMerchantServices"));
            return this.checkError(response);
        } catch (error) {
            throw new Error(error);
        }




    };





    /**
     * @param   {string}    referenceNumber         A unique reference number provided by the business, identifying the transaction. This reference number will be preserved on the Paga platform to reconcile the operation across systems and will be returned in the response
     * @param   {string}    locale                  The language/locale to be used in messaging. If provided, this must conform to the IETF language tag standard
     
     * @return {Promise}                            A Promise Object thats receives the response
                                                    
        Sample Successful Response =>   {
                                            "referenceNumber":"+251911314250",
                                            "message":"Airtime purchase request made successfully",
                                            "responseCode":0,
                                            "bank":
                                                [{"name": "", "uuid": "" }]
                                        }
                                                    
     */
    async getBanks(
        referenceNumber,
        locale) {
        try {
            const data = {
                referenceNumber,
                locale
            };

            const hashParams = referenceNumber;
            const header = this.buildHeader(hashParams);
            const response = await this.postRequest(header, data, this.getBaseUrl("getBanks"));
            return this.checkError(response);
        } catch (error) {
            throw new Error(error);
        }


    };






    /**
     * @param   {string}    referenceNumber         The reference number provided with the original operation for which the status is being queried
     * @param   {string}    locale                  The language/locale to be used in messaging. If provided, this must conform to the IETF language tag standard
     
     * @return {Promise}                            A Promise Object thats receives the response
                                                    
        Sample Successful Response =>   {
                                            "referenceNumber":"+251911314250",
                                            "message":"Airtime purchase request made successfully",
                                            "responseCode":0, "transactionId": , "fee": 5.0
                                        }
                                                    
     */
    async getOperationStatus(
        referenceNumber,
        locale) {
        try {
            const data = {
                referenceNumber,
                locale
            };

            const hashParams = referenceNumber;
            const header = this.buildHeader(hashParams);
            const response = await this.postRequest(header, data, this.getBaseUrl("getOperationStatus"));
            return this.checkError(response);
        } catch (error) {
            throw new Error(error);
        }

    };




    /**
     * @param   {string}    referenceNumber         A unique reference number provided by the business, identifying the transaction. This reference number will be preserved on the Paga platform to reconcile the operation across systems and will be returned in the response
     * @param   {string}    locale                  The language/locale to be used in messaging. If provided, this must conform to the IETF language tag standard
     
     * @return {Promise}                            A Promise Object thats receives the response
                                                    
        Sample Successful Response =>   {
                                            "referenceNumber":"+251911314250",
                                            "message":"Airtime purchase request made successfully",
                                            "responseCode":0,
                                            "mobileOperator":
                                                [{"name": "", " mobileOperatorCode ": "" }]
                                        }
                                                    
     */
    async getMobileOperators(
        referenceNumber,
        locale) {

        try {
            const data = {
                referenceNumber,
                locale
            };
            const hashParams = referenceNumber;
            const header = this.buildHeader(hashParams);
            const response = await this.postRequest(header, data, this.getBaseUrl("getMobileOperators"));
            return await this.checkError(response);
        } catch (error) {
            throw new Error(error);
        }

    };

    /**
       * @param   {string}    referenceNumber         A unique reference number provided by the business, identifying the transaction. This reference number will be preserved on the Paga platform to reconcile the operation across systems and will be returned in the response
       * @param   {string}    operatorPublicId        Mobile Operator publicId
       
       * @return {Promise}                            A Promise Object thats receives the response
                                                      
          Sample Successful Response =>   {
    "responseCode": 0,
    "message": null,
    "mobileOperatorServices": [
        {
            "mobileOperatorId": 6,
            "servicePrice": 100.0,
            "serviceName": "MTN 10MB 24 HRS (100)",
            "serviceId": 148
        },
        {
            "mobileOperatorId": 6,
            "servicePrice": 150.0,
            "serviceName": "MTN 25MB 24 HRS (150)",
            "serviceId": 153
        },
        {
            "mobileOperatorId": 6,
            "servicePrice": 200.0,
            "serviceName": "MTN 50MB 24 HRS (200)",
            "serviceId": 160
        }]
    }
                                                      
       */
    async getDataBundleByOperator(
        referenceNumber,
        operatorPublicId) {

        try {
            const data = {
                referenceNumber,
                operatorPublicId
            };
            const hashParams = `${referenceNumber}${operatorPublicId}`;
            const header = this.buildHeader(hashParams);
            const response = await this.postRequest(header, data, this.getBaseUrl("getDataBundleByOperator"));
            return this.checkError(response);
        } catch (error) {
            throw new Error(error);
        }

    };


    /**
     * @param   {Object}    moneyTransferItems        A list of the money transfer items included in this bulk operation
     * @param   {string}    bulkReferenceNumber A unique bulk reference number provided by the business, identifying the transaction. This reference number will be preserved on the Paga platform to reconcile the operation across systems and will be returned in the response
     
     * @return {Promise}                            A Promise Object thats receives the response
    {
       "bulkReferenceNumber":"1232452525",
       "message":"Successful bulk money transfer. 1 of 1 items successful",
       "results":[
          {
             "referenceNumber":"2345",
             "withdrawalCode":null,
             "exchangeRate":null,
             "fee":50,
             "receiverRegistrationStatus":"REGISTERED",
             "currency":"AED",
             "message":"You have successfully sent N3,000.00 to 12345. Paga Txn ID: MSGHB. Thank you for using Paga!",
             "transactionId":"MSGHB",
             "responseCode":0
          }
       ],
       "responseCode":0
    }
                                                    
     */
    async moneyTransferBulk(
        bulkReferenceNumber,
        moneyTransferItems) {

        try {
            const {
                referenceNumber: moneyTransferItemsReferenceNumber,
                amount: moneyTransferItemsAmount,
                destinationAccount: moneyTransferItemsDestinationAccount
            } = moneyTransferItems;

            const data = {
                bulkReferenceNumber,
                moneyTransferItems
            };

            const hashParams = `${moneyTransferItemsReferenceNumber}${moneyTransferItemsAmount}${moneyTransferItemsDestinationAccount}${data.moneyTransferItems.length}`;
            const header = this.buildHeader(hashParams);
            const response = await this.postRequest(header, data, this.getBaseUrl("moneyTransferBulk"));
            return this.checkError(response)
        } catch (error) {
            throw new Error(error)
        }


    };




    /**
     * @param   {string}    referenceNumber               A unique reference number provided by the business, identifying the transaction. This reference number will be preserved on the Paga platform to reconcile the operation across systems and will be returned in the response
     * @param   {string}    merchantExternalId      A unique reference number provided by the business, identifying the specific Organization account to be created.
     * @param   {Object}    merchantInfo            Containing information about the Organization to be created.
     * @param   {Object}    integration             Contains information about the type of notification to be used for notification of received payments.
     *
     * sample MerchantInfo Object:
     * {
              "legalEntity": {
                    "name" : "Example Sub Merchant 1",
                    "description": "business",
                    "addressLine1": "35 Yabas Road",
                    "addressLine2": "Somewhere",
                    "addressCity": "Lagos",
                    "addressState": "Lagos",
                    "addressZip": "xxxx",
                    "addressCountry": "Nigeria"
          },
          "legalEntityRepresentative": {
                "firstName": "John",
                "lastName": "Doe",
                "dateOfBirth": "1995-05-02T07:45:37.726+03:00",
                "phone": "+2348188215379",
                "email": "primarycontact@email.com"
          },
            "additionalParameters": {
            "establishedDate": "2014-03-13T19:53:37.726+03:00",
            "websiteUrl": "http://www.example.com",
            "displayName": "Life is Good"
          }
       }
     *
     * @param   {Object}    integration             Contains information about the type of notification to be used for notification of received payments. There are 2 integration types. EMAIL_NOTIFICATION and MERCHANT_NOTIFICATION_REVERSE_API. Each integration type requires a different set of parameters. See The Merchant Notification API Document for more details on the Reverse Notification API. e.g
     * Sample Integration Object :
     *  {
     *       "type" : "EMAIL_NOTIFICATION",
     *       "financeAdminEmail": "gfinance@apposit.com"
     *  }
     *
     * @return {Promise}                            A Promise Object thats receives the response
     *
     *      Sample Successful Response =>   {
                                                "responseCode": 0,
                                                "onboardingUpdate": {
                                                    "status": "succeeded",
                                                    "credentials": {
                                                    "merchantPublicId": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXXX",
                                                    "merchantSecretKey": "xxxxxxxxxxxxxxxx",
                                                    "merchantHmac": "b3c15a3b8xxxxxxxxc06c86e2394xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx0fc374d898aed5a3a86xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx9e67c1c969f1b8"
                                                    }
                                                }
                                            }
     *
     */
    async onboardMerchant(referenceNumber,
        merchantExternalId,
        merchantInfo,
        integration) {
        try {
            const {
                name: merchantInfoLegalEntityName
            } = merchantInfo.legalEntity;
            const {
                phone: merchantInfoLegalEntityRepresentativePhone,
                email: merchantInfoLegalEntityRepresentativeEmail
            } = merchantInfo.legalEntityRepresentative;
            const data = {
                "reference": referenceNumber,
                merchantExternalId,
                merchantInfo,
                integration
            };

            const hashParams = `${referenceNumber}${merchantExternalId}${merchantInfoLegalEntityName}${merchantInfoLegalEntityRepresentativePhone}
                ${merchantInfoLegalEntityRepresentativeEmail}`;
            const header = this.buildHeader(hashParams);
            const response = await this.postRequest(header, data, this.getBaseUrl("onboardMerchant"));
            return this.checkError(response);
        } catch (error) {
            throw new Error(error);
        }



    };


    /**
     * @param   {string}    referenceNumber                       A unique reference number provided by the business, identifying the transaction. This reference number will be preserved on the Paga platform to reconcile the operation across systems and will be returned in the response
     * @param   {string}    merchantReferenceNumber               The Organization public ID for which you want to get customer account details
     * @param   {string}    merchantServiceProductCode            Customer account Number at the Organization
     * @param   {string}    merchantServiceProductCode            Merchant service code specifying which of the merchant's services are being paid for
     *
     * @return {Promise}                                          A Promise Object thats receives the response
                                                    
      Sample Successful Response =>  {
                    "responseCode":0,
                    "message":"Success",
                    "customerName":"Mock User",
                    "phoneNumber":null,
                    "accountNumber":"Mock User",
                    "details":{
                        "First Name":"Mock",
                        "details":"Mock User",
                        "Last Name":"User",
                        "customerName":"Mock User",
                        "merchantAccountDetails":"Mock User"
                    }
    }
                                                    
     */
    /**
     * @param {string} merchantAccount
     */
    async getMerchantAccountDetails(
        referenceNumber,
        merchantAccount,
        merchantReferenceNumber,
        merchantServiceProductCode
    ) {

        try {
            const data = {
                referenceNumber,
                merchantAccount,
                merchantReferenceNumber,
                merchantServiceProductCode
            };

            const hashParams = `${referenceNumber}${merchantAccount}${merchantReferenceNumber}${merchantServiceProductCode}`;
            const header = this.buildHeader(hashParams);
            const response = await this.postRequest(header, data, this.getBaseUrl("getMerchantAccountDetails"));
            return this.checkError(response);
        } catch (error) {
            throw new Error(error);
        }



    };

    /**
                                                     * @param   {string}  referenceNumber               A unique reference number provided by the business, identifying the transaction. This reference number will be preserved on the Paga platform to reconcile the operation across systems and will be returned in the response.
                                                     * @param   {string}  phoneNumber                        The amount of money to transfer to the recipient.
                                                     * @param   {string}  firstName                      The currency of the operation, if being executed in a foreign currency.
                                                     * @param   {string}  lastName           The account identifier for the recipient receiving the money transfer. This account identifier may be a phone number, account nickname, or any other unique account identifier supported by the Paga platform. If destinationBank is specified, this is the bank account number.
                                                     * @param   {string}  accountName               For money transfers to a bank account, this is the destination bank code.
                                                     * @param   {string}  financialIdentificationNumber               The authentication principal for the user sending money if the money is being sent on behalf of a user. If null, the money transfer will be processed from the 3rd parties own account.
                                                     * @param   {string}  accountReference            The authentication credentials for the user sending money if the money is being sent on behalf of a user
                                                     *
                                                     * @return {Promise}                                A Promise Object thats receives the response
                                                     *
                                                     * Sample Successful Response =>    {
                                                                                        "responseCode": 0,
                                                                                        "message": null,
                                                                                        "referenceNumber": "0053459875439143453000",
                                                                                        "accountReference": "123467891334",
                                                                                        "accountNumber": "3414743183"
                                                                                        }
                                                     *
                                                     *
                                                     */
    async registerPersistentPaymentAccount(
        referenceNumber,
        phoneNumber,
        firstName,
        lastName,
        accountName,
        financialIdentificationNumber,
        accountReference
    ) {
        try {
            const data = {
                referenceNumber,
                phoneNumber,
                firstName,
                lastName,
                accountName,
                financialIdentificationNumber,
                accountReference
            };

            const hashParams = `${referenceNumber}${phoneNumber}`;
            const header = this.buildHeader(hashParams);
            const response = this.postRequest(header, data, this.getBaseUrl("registerPersistentPaymentAccount"));
            return this.checkError(response);
        } catch (error) {
            throw new Error(error);
        }
    }




    /**
                                                                                         * @param   {string}    referenceNumber             A unique reference number provided by the business, identifying the transaction. This reference number will be preserved on the Paga platform to reconcile the operation across systems and will be returned in the response.
                                                                                         * @param   {string}    accountNumber               A valid Persistent Payment Account Number.
                                                                                         * @param   {boolean}   getLatestSingleActivity     A flag if set to true would return only the last activity on the Persistent Payment Account
                                                                                         * @param   {Date}      startDate                   The start date for which records are to be returned.
                                                                                         * @param   {Date}      endDate                     The end of the time frame for the records to be returned.
                                                                                         * @param   {string}    accountReference            This is a unique reference number provided by the Organization which identifies the persistent account Number. It should have a minimum length of 12 characters and a maximum length of 30 characters
                                                                                         
                                                                                         * @return {Promise}                                A Promise Object thats receives the response
                                                                                        
                                                                                            Sample Successful Response =>   {
                                                                                            "responseCode": 0,
                                                                                            "message": "1 items returned",
                                                                                            "referenceNumber": "45345987543914345346",
                                                                                            "recordCount": 1,
                                                                                            "accountNumber": "2741938938",
                                                                                            "accountReference":"324324999212",
                                                                                            "accountName": null,
                                                                                            "phoneNumber": "+2347057683124",
                                                                                            "firstName": "Tangio",
                                                                                            "lastName": "Succor",
                                                                                            "email": "tangio@gmail.com",
                                                                                            "financialIdentificationNumber": null,
                                                                                            "items": [
                                                                                            {
                                                                                                "itemNumber": 1,
                                                                                                "amount": null,
                                                                                                "currencyCode": "NGN",
                                                                                                "paymentDate": "2021-02-10T15:17:55",
                                                                                                "paymentMethod": "BANK_TRANSFER",
                                                                                                "paymentReference": "PAGA|00010400|XY48L9638399205M",
                                                                                                "transactionReference": "DFB-U_20210210151755353_1235466_J1D0B",
                                                                                                "transactionServiceIdentifier": "J1D0B",
                                                                                                "status": "SUCCESSFUL",
                                                                                                "paymentBank": "Access Bank",
                                                                                                "paymentFee": "4.30",
                                                                                                "paymentNarration": "Pay for my Uber",
                                                                                                "isInstantSettlement": "true",
                                                                                                "instantSettlementAmount": "341.95",
                                                                                                "instantSettlementFee": "53.75"
                                                                                            }
                                                                                        ]
                                                                                }
                                                                                        
                                                                                        
                                                                                         */
    async getPersistentPaymentAccountActivity(
        referenceNumber,
        accountNumber,
        getLatestSingleActivity,
        startDate,
        endDate,
        accountReference,
    ) {
        try {
            const data = {
                referenceNumber,
                accountNumber,
                getLatestSingleActivity,
                startDate,
                endDate,
                accountReference
            };

            const hashParams = referenceNumber;
            const header = this.buildHeader(hashParams);
            const response = this.postRequest(header, data, this.getBaseUrl("getPersistentPaymentAccountActivity"))
            return this.checkError(response);
        } catch (error) {
            throw new Error(error);
        }

    };

    static Builder() {
        return new Builder();
    }

}

module.exports = PagaBusiness;