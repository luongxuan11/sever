import db from '../models'

// Read
export const getPrices = () => new Promise(async(resolve, reject) => {
    try {
        const res = await db.Price.findAll({ 
            raw: true,
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })  
         resolve({
            err: res ? 0 : 1,
            mess: res ? 'get Prices successfully!' : 'failed to get prices',
            pricesData: res
         })

    } catch (error) {
        reject(error)
    }
})
// Read
export const getAcreage = () => new Promise(async(resolve, reject) => {
    try {
        const res = await db.Acreage.findAll({ 
            raw: true,
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })  
         resolve({
            err: res ? 0 : 1,
            mess: res ? 'get Acreage successfully!' : 'failed to get Acreage',
            acreageData: res
         })

    } catch (error) {
        reject(error)
    }
})