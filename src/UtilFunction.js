const crypto = require('crypto');
const unirest = require('unirest');
const fetch = require("node-fetch");

class UtilFunction {
    constructor(build) {
        const {
            clientId,
            password,
            apiKey,
            test
        } = build || {};
        this.clientId = clientId;
        this.password = password;
        this.apiKey = apiKey;
        this.test = test;
    }

    getBaseUrl(endpoint) {
        const testServer = "https://beta.mypaga.com/paga-webservices/business-rest/secured/";
        const liveServer = "https://www.mypaga.com/paga-webservices/business-rest/secured/";
        let url = this.test ? testServer : liveServer;
        return `${url}${endpoint}`;
    }

    generateHash(hasParams) {
        let hash = crypto.createHash('sha512');
        let data = hash.update(hasParams, 'utf-8');
        return data.digest('hex');
    }

    checkError(response) {
        const {
            responseCode
        } = response;
        if (parseInt(responseCode) == 0) {
            return {
                error: false,
                response
            }
        } else {
            return {
                error: true,
                response
            }

        }
    }

    buildHeader(hashParams) {
        let pattern = `${hashParams}${this.apiKey}`;
        let hashData = this.generateHash(pattern);
        return {
            'Content-type': 'application/json',
            'Accept': 'application/json',
            "principal": this.clientId,
            "credentials": this.password,
            "hash": hashData
        }
    }

    async postRequest(headers, jsonData, url, flag = undefined) {
        let data = {}
        if (flag == "") {
            data = await unirest(url).headers(headers).field("customer", jsonData).send();
        } else {
            // @ts-ignore
            data = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(jsonData)
            });
        }

        const respStr = await data.text();
        let resp;
        try {
            resp = JSON.parse(respStr);

        } catch (error) {
            resp = respStr
        }

        return resp;
    }

    buildFormHeader(hashParams) {
        let pattern = `${hashParams}${this.apiKey}`;
        let hashData = this.generateHash(pattern);
        return {
            'content-type': 'multipart/form-data',
            'boundary': 'TEIJNCQ5bVQ6ocfU4BSpKzMEZ2nN7t',
            'Accept': 'application/json',
            'principal': this.clientId,
            'credentials': this.password,
            'hash': hashData,
            'Content-Disposition': 'form-data',
            'name': 'customer',
            'filename': 'file',
            'Content-Type': 'application/json',
        }
    }

}

module.exports = UtilFunction;