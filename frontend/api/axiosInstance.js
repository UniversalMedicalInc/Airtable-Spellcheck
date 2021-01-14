import axios from 'axios';
import { globalConfig } from '@airtable/blocks';



const baseURL = globalConfig.get('baseURL')
const key = globalConfig.get('key')


export default axios.create({
    baseURL: baseURL,
    headers: {
        Authorization: `Bearer ${key}`
    }
})
