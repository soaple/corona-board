// src/network/UrlList.js

const BASE_URL = 'https://wuhan-coronavirus-api.laeyoung.endpoint.ainize.ai/';
const API_BASE_URL = BASE_URL + 'jhu-edu';

var UrlList = {
    /**
     * Your App's URLs
     */
    Corona: {
        getBriefUrl: () => {
            return `${API_BASE_URL}/brief`;
        },

        getLatestUrl: () => {
            return `${API_BASE_URL}/latest`;
        },

        getTimeseriesUrl: () => {
            return `${API_BASE_URL}/timeseries`;
        },
    },

}

module.exports = UrlList;
