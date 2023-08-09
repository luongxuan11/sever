import db from '../models'

// Read
export const getCategories = () => new Promise(async(resolve, reject) => {
    try {
        const res = await db.Category.findAll({ // raw = true do thằng sequelize sẽ trả về 1 obj nhưng lại chứa thêm các instances nên đặt raw: true để k lấy
            raw: true,
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })  
         resolve({
            err: res ? 0 : 1,
            mess: res ? 'get categories successfully!' : 'failed to get categories',
            categoriesData: res
         })

    } catch (error) {
        reject(error)
    }
})