import fetchDog from '@bitbrother/fetch-dog'
import httpConfig from './http.config.json'

const httpAgent = fetchDog(httpConfig)

export default httpAgent
