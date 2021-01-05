import axios from 'axios';
import { globalConfig } from '@airtable/blocks';


// export default axios.create({
//     baseURL: 'http://localhost:5000/',
// });

const baseURL = globalConfig.get('baseURL')
console.log(baseURL)
const key = globalConfig.get('key')
console.log(key)

// export default axios.create({
//     baseURL: 'https://api.airtable.com/v0/appusgdTzlNjHH5Pv/library',
//     headers: {
//         Authorization: `Bearer keyHyLPdaCbr7AoxH`
//     }
// })
export default axios.create({
    baseURL: baseURL,
    headers: {
        Authorization: `Bearer ${key}`
    }
})
