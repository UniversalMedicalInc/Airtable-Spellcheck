import axios from 'axios';

// export default axios.create({
//     baseURL: 'http://localhost:5000/',
// });

export default axios.create({
    baseURL: 'https://api.airtable.com/v0/appusgdTzlNjHH5Pv/library',
    headers: {
        Authorization: 'Bearer keyHyLPdaCbr7AoxH'
    }
})
