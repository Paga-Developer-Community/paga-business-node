const axios = require('axios')
const sha512 = require('js-sha512').sha512;
const unirest = require('unirest');

class PagaBusinessClient {
    /**
     * @param {Object} build
     */
    constructor(build) {
        const { clientId, password, apiKey, test } = build;

        this.principal = clientId;
        this.password = password;
        this.hash = apiKey;
        this.test = test;

        const test_server = "https://beta.mypaga.com";
        const live_server = "https://www.mypaga.com";
        const service_url = "/paga-webservices/business-rest/";

        /**
         * @param {string} uri
         * @param {string} hash
         * @param {Object} body
         */
        this.buildRequest = (uri, hash, body) => {
            // @ts-ignore
            return axios({
                method: 'post',
                url: uri,
                headers: {
                    'content-type': 'application/json',
                    'Accept': 'application/json',
                    'principal': this.principal,
                    'credentials': this.password,
                    'hash': hash
                },
                data: body,

                timeout: 120000,
            });
        };

        this.arr = /**
         * @param {any[]} ele
         */


            function (...ele) {
                let list = [];
                if (ele == null || "") {
                    return null;
                }
                ele.forEach(function (element) {
                    list.push(element);
                });
                return list;
            };

        /**
         * @param {string} uri
         * @param {string} hash
         * @param {Object} body
         */
        this.buildFormRequest = (uri, hash, body) => {
            // return axios({
            //     method: 'post',
            //     url: uri,
            //     headers: {
            //         'content-type': 'multipart/form-data',
            //         'boundary' : 'TEIJNCQ5bVQ6ocfU4BSpKzMEZ2nN7t',
            //         'boundary': '6o2knFse3p53ty9dmcQvWAIx1zInP11uCfbm',
            //         'Accept': 'application/json',
            //         'principal' : this.principal,
            //         'credentials': this.password,
            //         'hash': hash,
            //         'Content-Disposition': 'form-data',
            //         'name': 'customer',
            //         'filename': 'file',
            //         'Content-Type' : 'application/json',
            //         'Accept': 'application/json'
            //     },
            //     data:  body,       
            //     timeout: 120000,
            //   });
            unirest.post(uri)
                .headers({
                    'content-type': 'multipart/form-data',
                    'boundary': 'TEIJNCQ5bVQ6ocfU4BSpKzMEZ2nN7t',
                    // 'boundary': '6o2knFse3p53ty9dmcQvWAIx1zInP11uCfbm',
                    'Accept': 'application/json',
                    'principal': this.principal,
                    'credentials': this.password,
                    'hash': hash,
                    'Content-Disposition': 'form-data',
                    'name': 'customer',
                    'filename': 'file',
                    'Content-Type': 'application/json',
                })
                .field("customer", body) // Form field

                // .attach('file', '/tmp/file') // Attachment
                .end(
                    function (response) {
                        console.log(response.body);
                    });
        };

        /**
         * @param {string | number | Date} date
         * @param {string} separator
         */
        this.formatDate = (date, separator) => {
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
         * @param {import("js-sha512").Message} message
         * @param {number} iterations
         * @param {boolean} returnHex
         */
        this.createHashSHA512 = (message, iterations, returnHex) => {
            let hash = sha512.create();
            hash.update(message);
            let digest;
            if (iterations == 1) {
                digest = hash.digest()
            } else {
                
                for (var i = 1; i < iterations; i++) {
                    let byteTemp = hash.digest();
                    hash.update(byteTemp);
                }
                digest = hash.digest();
            }
            return (returnHex)  ? hash.hex() : digest;

        };

        // /**
        //  * @param   {string}  referenceNumber        A unique reference number for this request. This same reference number will be returned in the response.
        //  * @param   {string}  customerPhoneNumber    The phone number of the new customer. This number must not belong to an existing registered customer
        //  * @param   {string}   customerEmail         The email of the new customer  
        //  * @param   {string}  customerFirstName      The first name of the customer
        //  * @param   {string}  customerLastName       The Last name of the customer
        //  * @param   {string}  customerDateOfBirth    Birth date of the customer
        //  * @param   {string}  customerGender       The gender of the new customer. Must be on of (FEMALE, MALE)
        //  * @param   {Object}  customerAddress       The Address of the new customer
        //  * @param   {string}  customerAddress.country     The country of the address. Must be provided is address is provided
        //  * @param   {string}  customerAddress.region       The region/state of the address. Must be provided is address is provided
        //  * @param   {string}  customerAddress.county       The county/zone of the address.
        //  * @param   {string}  customerAddress.city       The city of the address.
        //  * @param   {string}  customerAddress.localGovernmentArea       The local government area/district of the address.
        //  * @param   {string}  customerAddress.streetAddress       The street address of the address
        //  * @param   {string}  customerAddress.postalCode       The postal code of the address
        //  * @param   {string}  customerAddress.landmark       A landmark for the the address
        //  * @param   {string}  customerAddress.freeformAddress     A free-form description of the address
        //  * @param   {string}  customerMaritalStatus    The marital status of the new customer. Must be one of (SINGLE, MARRIED, DIVORCED)
        //  * @param   {string}  customerPreferredLanguageISOCode         The ISO 639-1 code of the new customer’s preferred language. Must be a valid ISO 639-1 code. See: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
        //  * @param   {string}  customerReferredByPhoneNumber              The phone number of the person who referred the new customer
        //  * @param   {string}  customerReferredByFirstName            The first name of the person who referred the new customer
        //  * @param   {string}  customerReferredByLastName           The last name of the person who referred the new customer
        //  * @param   {string}  customerIdType           The type of identification captured for th new customer. Must be one of (DRIVERS_LICENCE, NATIONAL_ID, PASSPORT, VOTERS_CARD)
        //  * @param   {string}  customerIdNumber            The number of the identification captured for the new customer. This must be provided if customerIdType is provided
        //  * @param   {string}  customerIdExpirationDate           The expiration date of the identification captured for th new customer. Format must be YYYY-MM-DD
        //  * @param   {Boolean}  optinForWalletSavings            If the customer opted in for transactional savings wallet
        //  * @param   {Object}  customerSupplementaryDetails            A name/value map of additional customer details captured
        //  * @param   {String}  customerSupplementaryDetails.nextOfKinLastName            A name/value map of additional customer details captured
        //  * @param   {String}  customerSupplementaryDetails.nextOfKinFirstName            A name/value map of additional customer details captured
        //  * @param   {String}  customerSupplementaryDetails.nextOfKinType            A name/value map of additional customer details captured
        //  * @param   {String}  customerSupplementaryDetails.nextOfKinPhoneNumber            A name/value map of additional customer details captured
        //  * 
        //  * @return {Promise}                         A Promise Object thats receives the response
        //  *         Sample Successful response =>    {
        //                                                 "message":"Thank for registering to paga. We will send SMS to +251911010862 with a registeration code. Please use www.mypaga.com or dial 636 to set up your user PIN.",
        //                                                 "referenceNumber":"",
        //                                                 "responseCode":0,
        //                                                 "pagaAccountNumber: 123456789"
        //                                             }
        //  */
        // this.registerCustomerWithKYC = async (
        //             referenceNumber,        
        //             customerPhoneNumber,             
        //             customerFirstName,      
        //             customerLastName,
        //             customerEmail,       
        //             customerDateOfBirth,    
        //             customerGender,
        //             customerAddressCountry,
        //             customerAddressRegion,
        //             customerAddressCounty, 
        //             customerAddressCity,
        //             customerAddressLocalGovernmentArea,
        //             customerAddressStreetAddress,
        //             customerAddressPostalCode, 
        //             customerAddressLandmark,
        //             customerAddressFreeformAddress,
        //             customerMaritalStatus,
        //             customerPreferredLanguageISOCode, 
        //             customerReferredByFirstName,      
        //             customerReferredByLastName, 
        //             customerReferredByPhoneNumber,
        //             customerIdType,
        //             customerIdNumber,
        //             customerIdExpirationDate, 
        //             optinForWalletSavings,
        //             customerSupplementaryDetailsNextOfKinLastName, 
        //             customerSupplementaryDetailsNextOfKinFirstName,
        //             customerSupplementaryDetailsNextOfKinType,
        //             customerSupplementaryDetailsNextOfKinPhoneNumber ) => {
        //         var dob = (customerDateOfBirth != null) ? this.formatDate(customerDateOfBirth,'/'): null;
        //         var doe = (customerIdExpirationDate != null) ? this.formatDate(customerIdExpirationDate,'/'): null;
        //         var server = (this.test) ? test_server : live_server;
        //         var obj = {
        //             "referenceNumber": referenceNumber,
        //             "customerPhoneNumber": customerPhoneNumber,
        //             "customerFirstName": customerFirstName,
        //             "customerLastName": customerLastName,
        //             "customerEmail": customerEmail,
        //             "customerDateOfBirth" : ((dob != null) ? dob : null),
        //             "customerGender": customerGender,
        //             "customerAddress": { 
        //                 "country": customerAddressCountry,
        //                 "region": customerAddressRegion,
        //                 "county" : customerAddressCounty,
        //                 "city" : customerAddressCity,
        //                 "localGovernmentArea": customerAddressLocalGovernmentArea,
        //                 "streetAddress": customerAddressStreetAddress,
        //                 "postalCode" : customerAddressPostalCode,
        //                 "landmark": customerAddressLandmark,
        //                 "freeformAddress": customerAddressFreeformAddress,
        //             },
        //             "customerMaritalStatus": customerMaritalStatus,
        //             "customerPreferredLanguageISOCode": customerPreferredLanguageISOCode,
        //             "customerReferredByFirstName": customerReferredByFirstName,
        //             "customerReferredByLastName": customerReferredByLastName,
        //             "customerReferredByPhoneNumber": customerReferredByPhoneNumber,
        //             "customerIdType": customerIdType,
        //             "customerIdNumber": customerIdNumber,
        //             "customerIdExpirationDate": ((doe != null) ? doe : null),
        //             "optinForWalletSavings": optinForWalletSavings,
        //             "customerSupplementaryDetails":{ 
        //                 "NextOfKinLastName": customerSupplementaryDetailsNextOfKinLastName,
        //                 "NextOfKinFirstName": customerSupplementaryDetailsNextOfKinFirstName,
        //                 "NextOfKinType": customerSupplementaryDetailsNextOfKinType,
        //                 "NextOfKinPhoneNumber": customerSupplementaryDetailsNextOfKinPhoneNumber
        //             }
        //         }
        //         var sBuilder = []
        //         sBuilder.push(referenceNumber + customerPhoneNumber + customerFirstName + customerLastName + this.hash)
        //         sBuilder.join("")
        //         var hashString = this.createHashSHA512(sBuilder.toString(), 1, true).toString();
        //         var response
        //         try {
        //             response = await this.buildFormRequest(server + service_url + "secured/registerCustomerWithKYC", hashString, obj)
        //         } catch (error) {
        //             response = {
        //                 "errorCode" : -1,
        //                 "exception" : error,
        //             }
        //         } finally {
        //             return response;
        //         }
        //     }
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
        this.registerCustomer = async (
            referenceNumber,
            customerPhoneNumber,
            customerEmail,
            customerFirstName,
            customerLastName,
            customerDateOfBirth
        ) => {
            let dob = (customerDateOfBirth != null) ? this.formatDate(customerDateOfBirth, '/') : null;

            let server = (this.test) ? test_server : live_server;
            let obj = {
                referenceNumber,
                customerPhoneNumber,
                customerFirstName,
                customerLastName,
                customerEmail,
                "customerDateOfBirth": dob,
            };

            let sBuilder = [];

            sBuilder.push(referenceNumber + customerPhoneNumber + customerFirstName + customerLastName + this.hash);
            sBuilder.join("");

            let hashString = this.createHashSHA512(sBuilder.toString(), 1, true).toString();

            let response;
            try {
                response = await this.buildRequest(server + service_url + "secured/registerCustomer", hashString, obj);
            } catch (error) {
                response = {
                    "errorCode": -1,
                    "exception": error,
                };
            } finally {
                return response;
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
        this.registerCustomerAccountPhoto = async (
            referenceNumber,
            customerPhoneNumber, customerAccountPhoto) => {

            let server = (this.test) ? test_server : live_server;

            let obj = {
                referenceNumber,
                customerPhoneNumber,
                customerAccountPhoto
            };

            let sBuilder = [];
            sBuilder.push(referenceNumber + customerPhoneNumber + this.hash);
            sBuilder.join("");

            let hashString = this.createHashSHA512(sBuilder.toString(), 1, true).toString();

            let response;
            try {
                response = await this.buildFormRequest(server + service_url + "secured/registerCustomerAccountPhoto", hashString, obj);
            } catch (error) {
                response = {
                    "errorCode": -1,
                    "exception": error,
                };
            } finally {
                return response;
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
        this.registerCustomerIdentification = async (
            referenceNumber,
            customerPhoneNumber,
            customerIdType,
            customerIdNumber,
            customerIdExpirationDate,
            customerIdPhoto) => {

            let server = (this.test) ? test_server : live_server;

            const obj = {
                referenceNumber,
                customerPhoneNumber,
                customerIdType,
                customerIdNumber,
                customerIdExpirationDate
            };

            let sBuilder = [];
            sBuilder.push(referenceNumber + customerPhoneNumber + customerIdType + customerIdNumber + customerIdExpirationDate + this.hash);
            sBuilder.join("");

            let hashString = this.createHashSHA512(sBuilder.toString(), 1, true).toString();

            let response;
            try {
                response = await this.buildFormRequest(server + service_url + "secured/registerCustomerIdentification", hashString, obj);
            } catch (error) {
                response = {
                    "errorCode": -1,
                    "exception": error,
                };
            } finally {
                return response;
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
        this.moneyTransfer = async (
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
            holdingPeriod) => {

            let server = (this.test) ? test_server : live_server;

            // var obj = {
            //     "referenceNumber" : referenceNumber,
            //     "amount" : amount,
            //     "currency" : currency,
            //     "destinationAccount" : destinationAccount,
            //     "destinationBank" : destinationBank,
            //     "senderPrincipal" : senderPrincipal,
            //     "senderCredentials" :senderCredentials,
            //     "sendWithdrawalCode" : withdrawalCode,
            //     "sourceOfFunds" : sourceOfFunds,
            //     "transferReference" : transferReference,
            //     "suppressRecipientMsg" : suppressRecipientMsg,
            //     "locale" : locale,
            //     "alternateSenderName" : alternateSenderName,
            //     "minRecipientKYCLevel" : minRecipientKYCLevel,
            //     "holdingPeriod" : holdingPeriod
            // }
            const obj = {
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

            let sBuilder = [];
            sBuilder.push(referenceNumber + amount + destinationAccount + this.hash);
            sBuilder.join("");

            let hashString = this.createHashSHA512(sBuilder.toString(), 1, true).toString();

            let response;
            try {
                response = await this.buildRequest(server + service_url + "secured/moneyTransfer", hashString, obj);
            } catch (error) {
                response = {
                    "errorCode": -1,
                    "exception": error,
                };
            } finally {
                return response;
            }

        };


        /**
         * @param   {string}    referenceNumber             A unique reference number provided by the business, identifying the transaction. This reference number will be preserved on the Paga platform to reconcile the operation across systems and will be returned in the response.
         * @param   {number}    amount                      The amount of airtime to purchase.
         * @param   {number}    currency                    The currency of the operation, if being executed in a foreign currency.
         * @param   {string}    destinationPhoneNumber      The phone number for which airtime is being purchased. If null, and ­­­­Principal is specified, then the airtime will be purchased for the phone number of the purchaserPrincipal. Must be provided if the purchaserPrincipal is null.
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
        this.airtimePurchase = async (
            referenceNumber,
            amount,
            currency,
            destinationPhoneNumber,
            purchaserPrincipal,
            purchaserCredentials,
            sourceOfFunds,
            locale) => {

            let server = (this.test) ? test_server : live_server;

            const obj = {
                referenceNumber,
                amount,
                currency,
                destinationPhoneNumber,
                purchaserPrincipal,
                purchaserCredentials,
                sourceOfFunds,
                locale
            };

            let sBuilder = [];
            sBuilder.push(referenceNumber + amount + destinationPhoneNumber + this.hash);
            sBuilder.join("");

            let hashString = this.createHashSHA512(sBuilder.toString(), 1, true).toString();

            let response;
            try {
                response = await this.buildRequest(server + service_url + "secured/airtimePurchase", hashString, obj);
            } catch (error) {
                response = {
                    "errorCode": -1,
                    "exception": error,
                };
            } finally {
                return response;
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
        this.merchantPayment = async (
            merchantReferenceNumber,
            amount,
            merchantAccount,
            referenceNumber,
            currency,
            merchantService,
            purchaserPrincipal,
            purchaserCredentials,
            sourceOfFunds,
            locale) => {

            let server = (this.test) ? test_server : live_server;

            let obj = {
                merchantReferenceNumber,
                amount,
                merchantAccount,
                referenceNumber,
                currency,
                "merchantService": this.arr(merchantService),
                purchaserPrincipal,
                purchaserCredentials,
                sourceOfFunds,
                locale
            };

            let sBuilder = [];
            sBuilder.push(referenceNumber + amount + merchantAccount + merchantReferenceNumber + this.hash);
            sBuilder.join("");

            let hashString = this.createHashSHA512(sBuilder.toString(), 1, true).toString();

            let response;
            try {
                response = await this.buildRequest(server + service_url + "secured/merchantPayment", hashString, obj);
            } catch (error) {
                response = {
                    "errorCode": -1,
                    "exception": error,
                };
            } finally {
                return response;
            }

        };




        /**
         * @param   {string}    referenceNumber                     A unique reference number provided by the business, identifying the transaction. This reference number will be preserved on the Paga platform to reconcile the operation across systems and will be returned in the response.
         * @param   {number}    amount                              The amount of money to deposit to the destination bank and bank account provided. Your Paga account must contain sufficient funds to cover this amount plus any fees.
         * @param   {number}    currency                            The currency of the operation, if being executed in a foreign currency. The currency must be one of the currencies supported by the platform. For supported currencies, check with Paga integration operations support.
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
        this.validateDepositToBank = async (
            referenceNumber,
            amount,
            currency,
            destinationBankUUID,
            destinationBankAccountNumber,
            recipientPhoneNumber,
            recipientMobileOperatorCode,
            recipientEmail,
            recipientName,
            locale) => {

            let server = (this.test) ? test_server : live_server;

            const obj = {
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

            let sBuilder = [];
            sBuilder.push(referenceNumber + amount + destinationBankUUID + destinationBankAccountNumber + this.hash);
            sBuilder.join("");

            let hashString = this.createHashSHA512(sBuilder.toString(), 1, true).toString();

            let response;
            try {
                response = await this.buildRequest(server + service_url + "secured/validateDepositToBank", hashString, obj);
            } catch (error) {
                response = {
                    "errorCode": -1,
                    "exception": error,
                };
            } finally {
                return response;
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
        this.depositToBank = async (
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
            locale) => {

            let server = (this.test) ? test_server : live_server;

            const obj = {
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

            let sBuilder = [];
            sBuilder.push(referenceNumber + amount + destinationBankUUID + destinationBankAccountNumber + this.hash);
            sBuilder.join("");

            let hashString = this.createHashSHA512(sBuilder.toString(), 1, true).toString();

            let response;
            try {
                response = await this.buildRequest(server + service_url + "secured/depositToBank", hashString, obj);
            } catch (error) {
                response = {
                    "errorCode": -1,
                    "exception": error,
                };
            } finally {
                return response;
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
        this.accountBalance = async (
            referenceNumber,
            accountPrincipal,
            accountCredentials,
            sourceOfFunds,
            locale) => {

            let server = (this.test) ? test_server : live_server;

            const obj = {
                referenceNumber,
                accountPrincipal,
                accountCredentials,
                sourceOfFunds,
                locale
            };

            let sBuilder = [];
            sBuilder.push(referenceNumber + this.hash);
            sBuilder.join("");

            let hashString = this.createHashSHA512(sBuilder.toString(), 1, true).toString();

            let response;
            try {
                response = await this.buildRequest(server + service_url + "secured/accountBalance", hashString, obj);
            } catch (error) {
                response = {
                    "errorCode": -1,
                    "exception": error,
                };
            } finally {
                return response;
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
        this.transactionHistory = async (
            referenceNumber,
            accountPrincipal,
            accountCredentials,
            startDateUTC,
            endDateUTC,
            locale) => {

            let server = (this.test) ? test_server : live_server;

            const obj = {
                referenceNumber,
                accountPrincipal,
                accountCredentials,
                startDateUTC,
                endDateUTC,
                locale
            };

            let sBuilder = [];
            sBuilder.push(referenceNumber + this.hash);
            sBuilder.join("");

            let hashString = this.createHashSHA512(sBuilder.toString(), 1, true).toString();

            let response;
            try {
                response = await this.buildRequest(server + service_url + "secured/transactionHistory", hashString, obj);
            } catch (error) {
                response = {
                    "errorCode": -1,
                    "exception": error,
                };
            } finally {
                return response;
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
        this.recentTransactionHistory = async (
            referenceNumber,
            accountPrincipal,
            accountCredentials,
            locale) => {

            let server = (this.test) ? test_server : live_server;

            const obj = {
                referenceNumber,
                accountPrincipal,
                accountCredentials,
                locale
            };

            let sBuilder = [];
            sBuilder.push(referenceNumber + this.hash);
            sBuilder.join("");

            let hashString = this.createHashSHA512(sBuilder.toString(), 1, true).toString();

            let response;
            try {
                response = await this.buildRequest(server + service_url + "secured/recentTransactionHistory", hashString, obj);
            } catch (error) {
                response = {
                    "errorCode": -1,
                    "exception": error,
                };
            } finally {
                return response;
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
        this.getMerchants = async (
            referenceNumber,
            locale) => {

            let server = (this.test) ? test_server : live_server;

            const obj = {
                referenceNumber,
                locale
            };

            let sBuilder = [];
            sBuilder.push(referenceNumber + this.hash);
            sBuilder.join("");

            let hashString = this.createHashSHA512(sBuilder.toString(), 1, true).toString();

            let response;
            try {
                response = await this.buildRequest(server + service_url + "secured/getMerchants", hashString, obj);
            } catch (error) {
                response = {
                    "errorCode": -1,
                    "exception": error,
                };
            } finally {
                return response;
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
        this.getMerchantServices = async (
            referenceNumber,
            merchantPublicId,
            locale) => {

            let server = (this.test) ? test_server : live_server;

            const obj = {
                referenceNumber,
                merchantPublicId,
                locale
            };

            let sBuilder = [];
            sBuilder.push(referenceNumber + merchantPublicId + this.hash);
            sBuilder.join("");

            let hashString = this.createHashSHA512(sBuilder.toString(), 1, true).toString();

            let response;
            try {
                response = await this.buildRequest(server + service_url + "secured/getMerchantServices", hashString, obj);
            } catch (error) {
                response = {
                    "errorCode": -1,
                    "exception": error,
                };
            } finally {
                return response;
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
        this.getBanks = async (
            referenceNumber,
            locale) => {

            let server = (this.test) ? test_server : live_server;

            const obj = {
                referenceNumber,
                locale
            };

            let sBuilder = [];
            sBuilder.push(referenceNumber + this.hash);
            sBuilder.join("");

            let hashString = this.createHashSHA512(sBuilder.toString(), 1, true).toString();

            let response;
            try {
                response = await this.buildRequest(server + service_url + "secured/getBanks", hashString, obj);
            } catch (error) {
                response = {
                    "errorCode": -1,
                    "exception": error,
                };
            } finally {
                return response;
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
        this.getOperationStatus = async (
            referenceNumber,
            locale) => {

            let server = (this.test) ? test_server : live_server;

            const obj = {
                referenceNumber,
                locale
            };

            let sBuilder = [];
            sBuilder.push(referenceNumber + this.hash);
            sBuilder.join("");

            let hashString = this.createHashSHA512(sBuilder.toString(), 1, true).toString();

            let response;
            try {
                response = await this.buildRequest(server + service_url + "secured/getOperationStatus", hashString, obj);
            } catch (error) {
                response = {
                    "errorCode": -1,
                    "exception": error,
                };
            } finally {
                return response;
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
        this.getMobileOperators = async (
            referenceNumber,
            locale) => {

            let server = (this.test) ? test_server : live_server;

            const obj = {
                referenceNumber,
                locale
            };

            let sBuilder = [];
            sBuilder.push(referenceNumber + this.hash);
            sBuilder.join("");

            let hashString = this.createHashSHA512(sBuilder.toString(), 1, true).toString();

            let response;
            try {
                response = await this.buildRequest(server + service_url + "secured/getMobileOperators", hashString, obj);
            } catch (error) {
                response = {
                    "errorCode": -1,
                    "exception": error,
                };
            } finally {
                return response;
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
        this.moneyTransferBulk = async (
            bulkReferenceNumber,
            moneyTransferItems) => {

            let server = (this.test) ? test_server : live_server;
            let {
                referenceNumber: moneyTransferItemsReferenceNumber,
                amount: moneyTransferItemsAmount,
                destinationAccount: moneyTransferItemsDestinationAccount
            } = moneyTransferItems;

            let obj = {
                bulkReferenceNumber,
                moneyTransferItems
            };

            let sBuilder = [];
            sBuilder.push(moneyTransferItemsReferenceNumber + moneyTransferItemsAmount + moneyTransferItemsDestinationAccount + obj.moneyTransferItems.length + this.hash);
            sBuilder.join("");

            let hashString = this.createHashSHA512(sBuilder.toString(), 1, true).toString();

            let response;
            try {
                response = await this.buildRequest(server + service_url + "secured/moneyTransferBulk", hashString, obj);
            } catch (error) {
                response = {
                    "errorCode": -1,
                    "exception": error,
                };
            } finally {
                return response;
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
        this.onboardMerchant = async (referenceNumber,
            merchantExternalId,
            merchantInfo,
            integration) => {

            let server = (this.test) ? test_server : live_server;

            let { name: merchantInfoLegalEntityName } = merchantInfo.legalEntity;
            let {
                phone: merchantInfoLegalEntityRepresentativePhone,
                email: merchantInfoLegalEntityRepresentativeEmail
            } = merchantInfo.legalEntityRepresentative;
            const obj = {
                "reference": referenceNumber,
                merchantExternalId,
                merchantInfo,
                integration
            };

            let sBuilder = [];
            sBuilder.push(referenceNumber + merchantExternalId + merchantInfoLegalEntityName + merchantInfoLegalEntityRepresentativePhone +
                merchantInfoLegalEntityRepresentativeEmail + this.hash);
            sBuilder.join("");

            let hashString = this.createHashSHA512(sBuilder.toString(), 1, true).toString();

            let response;
            try {
                response = await this.buildRequest(server + service_url + "secured/onboardMerchant", hashString, obj);
            } catch (error) {
                response = {
                    "errorCode": -1,
                    "exception": error,
                };
            } finally {
                return response;
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
        this.getMerchantAccountDetails = async (
            referenceNumber,
            merchantAccount,
            merchantReferenceNumber,
            merchantServiceProductCode
        ) => {

            let server = (this.test) ? test_server : live_server;

            const obj = {
                referenceNumber,
                merchantAccount,
                merchantReferenceNumber,
                merchantServiceProductCode
            };

            let sBuilder = [];
            sBuilder.push(referenceNumber + merchantAccount + merchantReferenceNumber + merchantServiceProductCode + this.hash);
            sBuilder.join("");

            let hashString = this.createHashSHA512(sBuilder.toString(), 1, true).toString();

            let response;
            try {
                response = await this.buildRequest(server + service_url + "secured/getMerchantAccountDetails", hashString, obj);
            } catch (error) {
                response = {
                    "errorCode": -1,
                    "exception": error,
                };
            } finally {
                return response;
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
                                            this.registerPersistentPaymentAccount = async (
                                                referenceNumber,
                                                phoneNumber,
                                                firstName,
                                                lastName,                                                                                                                                                                                                                                           
                                                accountName,
                                                financialIdentificationNumber,
                                                accountReference
                                                ) => {
                                    
                                                let server = (this.test) ? test_server : live_server;
                                                const obj = {
                                                    referenceNumber,
                                                    phoneNumber,
                                                    firstName,
                                                    lastName,                                                                                                                                                                                                                                           
                                                    accountName,
                                                    financialIdentificationNumber,
                                                    accountReference
                                                };
                                    
                                                let sBuilder = [];
                                                sBuilder.push(referenceNumber + phoneNumber+ this.hash);
                                                sBuilder.join("");
                                    
                                                let hashString = this.createHashSHA512(sBuilder.toString(), 1, true).toString();
                                    
                                                let response;
                                                try {
                                                    response = await this.buildRequest(server + service_url + "secured/registerPersistentPaymentAccount", hashString, obj);
                                                } catch (error) {
                                                    response = {
                                                        "errorCode": -1,
                                                        "exception": error,
                                                    };
                                                } finally {
                                                    return response;
                                                }
                                    
                                            };
                                    
                                    
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
                                            this.getPersistentPaymentAccountActivity = async (
                                                referenceNumber,
                                                accountNumber,
                                                getLatestSingleActivity,
                                                startDate,
                                                endDate,
                                                accountReference,
                                               ) => {
                                    
                                                let server = (this.test) ? test_server : live_server;
                                    
                                                const obj = {
                                                    referenceNumber,
                                                    accountNumber,
                                                    getLatestSingleActivity,
                                                    startDate,
                                                    endDate,
                                                    accountReference
                                                };
                                    
                                                let sBuilder = [];
                                                sBuilder.push(referenceNumber + this.hash);
                                                sBuilder.join("");
                                    
                                                let hashString = this.createHashSHA512(sBuilder.toString(), 1, true).toString();
                                    
                                                let response;
                                                try {
                                                    response = await this.buildRequest(server + service_url + "secured/getPersistentPaymentAccountActivity", hashString, obj);
                                                } catch (error) {
                                                    response = {
                                                        "errorCode": -1,
                                                        "exception": error,
                                                    };
                                                } finally {
                                                    return response;
                                                }
                                    
                                            };


    }
    static Builder() {
        class Builder {
            /**
             * @param {string} clientId
             */
            setPrincipal(clientId) {
                this.clientId = clientId;
                return this;
            }
            /**
              * @param {string} password
              */
            setCredential(password) {
                this.password = password;
                return this;
            }
            /**
              * @param {string} apiKey
              */
            setApiKey(apiKey) {
                this.apiKey = apiKey;
                return this;
            }
            /**
              * @param {boolean} flag
              */
            setIsTest(flag) {
                this.test = flag;
                return this;
            }
            build() {
                return new PagaBusinessClient(this);
            }
        }
        return new Builder();
    }
}


  

module.exports = PagaBusinessClient