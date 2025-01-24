import axios from './axios.customize';

const createUserApi = (name, email, password) => {
    const URL_API = "/v1/api/register";
    const data = {
        name, email, password
    }

    return axios.post(URL_API, data)
}

const loginApi = (name, password) => {
    const URL_API = "/v1/api/login";
    const data = {
        name, password
    }

    return axios.post(URL_API, data)
}

export {
    createUserApi, loginApi
}