const PagaBusiness = require("./src/PagaBusiness");

class PagaBusinessClient {
    constructor() {

    }

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
         * @param {boolean} test
         */
    setIsTest(test) {
        this.test = test;
        return this;
    }
    build() {
        return new PagaBusiness(this);
    }
}

module.exports = PagaBusinessClient;