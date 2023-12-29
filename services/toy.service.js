
import fs from 'fs'
import { utilService } from './util.service.js'
import { loggerService } from './logger.service.js'

export const toyService = {
    query,
    getById,
    remove,
    save
}

const toys = utilService.readJsonFile('data/toy.json')

function query(filterBy = { name: '', price: Infinity }) {
    const regex = new RegExp(filterBy.name, 'i')
    var toysToReturn = toys.filter(toy => regex.test(toy.name))
    if (filterBy.price) {
        toysToReturn = toysToReturn.filter(toy => toy.price <= filterBy.price)
    }
    return Promise.resolve(toysToReturn)
}

function getById(toyId) {
    const toy = toys.find(toy => toy._id === toyId)
    return Promise.resolve(toy)
}

// function remove(toyId, loggedinUser) {
function remove(toyId) {
    const idx = toys.findIndex(toy => toy._id === toyId)
    if (idx === -1) return Promise.reject('No Such Toy')
    // const toy = toys[idx]
    // if (!loggedinUser.isAdmin &&
    //     toy.owner._id !== loggedinUser._id) {
    //     return Promise.reject('Not your toy')
    // }
    toys.splice(idx, 1)
    return _saveToysToFile()
}

// // function save(car, loggedinUser) {
// function save(toy) {
//     if (toy._id) {
//         const toyToUpdate = toys.find(currToy => currToy._id === toy._id)
//         // if (!loggedinUser.isAdmin &&
//         //     toyToUpdate.owner._id !== loggedinUser._id) {
//         //     return Promise.reject('Not your toy')
//         // }
//         toy._id = toy._id || utilService.makeId()
//         toyToUpdate.name = toy.name || ''
//         toyToUpdate.price = toy.price || 0
//         toyToUpdate.labels = toy.labels || []
//         toyToUpdate.inStock = toy.inStock || false
//         toy = toyToUpdate
//         toys.push(toy)

//     }

//     return _saveToysToFile().then(() => toy)
// }

// function save(toy) {
//     let idx = toys.findIndex(currToy => currToy._id === toy._id);
//     if (idx === -1) {
//         // If toy doesn't exist, create new
//         toy._id = utilService.makeId();
//         // Ensure all fields are accounted for here
//         toy.name = toy.name || 'Unnamed Toy';
//         toy.price = toy.price || 0;
//         toy.labels = toy.labels || [];
//         toy.inStock = toy.inStock || false;
//         toys.push(toy);
//     } else {
//         // If toy exists, update it
//         toys[idx] = { ...toys[idx], ...toy };
//     }

//     return _saveToysToFile().then(() => toy).catch(err => {
//         loggerService.error('Failed to save the toy', err);
//         throw err;
//     });
// }


// function save(car, loggedinUser) {
async function save(toy) {
    if (toy._id) {
        const toyToUpdate = toys.find(currToy => currToy._id === toy._id)

        // if (!loggedinUser.isAdmin &&
        //     toyToUpdate.owner._id !== loggedinUser._id) {
        //     return Promise.reject('Not your toy')
        // }
        console.log(`Toy updated ID:${toy._id}`)


        toyToUpdate.name = toy.name || 'Unnamed Toy'
        toyToUpdate.price = toy.price || 0
        toyToUpdate.labels = toy.labels || []
        toyToUpdate.inStock = toy.inStock || true

        toy = toyToUpdate
    } else {
        toy._id = utilService.makeId()
        console.log(`New toy created ID:${toy._id}`)

        // toy.owner = {
        //     fullname: loggedinUser.fullname,
        //     score: loggedinUser.score,
        //     _id: loggedinUser._id,
        //     isAdmin: loggedinUser.isAdmin
        // }
        toys.push(toy)
    }


    try {
        // Wait for the file to be saved before proceeding
        await _saveToysToFile()
        // If successful return the toy
        return toy
    } catch (err) {
        loggerService.error('Cannot save toy', err)
        throw err
    }
    // return _saveToysToFile().then(() => toy)
}



function _saveToysToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(toys, null, 4)
        fs.writeFile('data/toy.json', data, (err) => {
            if (err) {
                loggerService.error('Cannot write to toys file', err)
                return reject(err)
            }
            resolve()
        })
    })
}
