import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path, {dirname} from 'path'

import { toyService } from './services/toy.service.js'
// import { userService } from './services/user.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

// Express Config:
const corsOptions = {
    origin: [
        'http://127.0.0.1:8080',
        'http://localhost:8080',
        'http://127.0.0.1:5173',
        'http://localhost:5173',
    ],
    credentials: true
}
app.use(cors(corsOptions))
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())


// // Express Routing:
// app.get('/puki', (req, res) => {
//     var visitCount = req.cookies.visitCount || 0
//     visitCount++
//     res.cookie('visitCount', visitCount)
//     res.cookie('lastVisitedToyId', 'c101', { maxAge: 60 * 60 * 1000 })
//     res.send('Hello Puki')
// })
// app.get('/nono', (req, res) => res.redirect('/'))

// REST API for Toys

// Toy LIST
app.get('/api/toy', async (req, res) => {
    const filterBy = {
        name: req.query.name || '',
        price: +req.query.price || 0,
    }

    var toys = await toyService.query(filterBy)
    try {
        res.send(toys)
    } catch (err) {
        loggerService.error('Cannot get toys', err)
        res.status(400).send('Cannot get toys')
    }
})
// app.get('/api/toy', (req, res) => {
//     const filterBy = {
//         name: req.query.name || '',
//         price: +req.query.price || 0,
//     }

//     toyService.query(filterBy)
//         .then((toys) => {
//             res.send(toys)
//         })
//         .catch((err) => {
//             loggerService.error('Cannot get toys', err)
//             res.status(400).send('Cannot get toys')
//         })
// })

// Toy READ
app.get('/api/toy/:toyId', async (req, res) => {
    const { toyId } = req.params
    var toy = await toyService.getById(toyId)
    try {
        res.send(toy)
    } catch (err) {
        loggerService.error('Cannot get toy', err)
        res.status(400).send('Cannot get toy')
    }
})
// app.get('/api/toy/:toyId', (req, res) => {
//     const { toyId } = req.params
//     toyService.getById(toyId)
//         .then((toy) => {
//             res.send(toy)
//         })
//         .catch((err) => {
//             loggerService.error('Cannot get toy', err)
//             res.status(400).send('Cannot get toy')
//         })
// })

// Toy CREATE
app.post('/api/toy', async (req, res) => {
    // console.log('req.body', req.body)

    // const loggedinUser = userService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Cannot add toy')
    const toy = {
        name: req.body.name,
        labels: req.body.labels,
        inStock: req.body.inStock,
        price: +req.body.price,
        // speed: +req.body.speed,
    }
    // toyService.save(toy, loggedinUser)
    var savedToy = await toyService.save(toy)
    try {
        res.send(savedToy)
    } catch (err) {
        loggerService.error('Cannot save toy', err)
        res.status(400).send('Cannot save toy')
    }
})
// app.post('/api/toy', (req, res) => {
//     console.log('req.body', req.body)

//     // const loggedinUser = userService.validateToken(req.cookies.loginToken)
//     // if (!loggedinUser) return res.status(401).send('Cannot add toy')
//     const toy = {
//         name: req.body.name,
//         labels: req.body.labels,
//         inStock: req.body.inStock,
//         price: +req.body.price,
//         // speed: +req.body.speed,
//     }
//     // toyService.save(toy, loggedinUser)
//     toyService.save(toy)
//         .then((savedToy) => {
//             res.send(savedToy)
//         })
//         .catch((err) => {
//             loggerService.error('Cannot save toy', err)
//             res.status(400).send('Cannot save toy')
//         })

// })

// Toy UPDATE
app.put('/api/toy', async (req, res) => {
    // const loggedinUser = userService.validateToken(req.cookies.loginToken)
    // if (!loggedinUser) return res.status(401).send('Cannot update toy')
    const toy = {
        _id: req.body._id,
        name: req.body.name,
        labels: req.body.labels,
        inStock: req.body.inStock,
        // speed: +req.body.speed,
        price: +req.body.price,
    }
    // toyService.save(toy, loggedinUser)
    var savedToy = await toyService.save(toy)
    try {
        res.send(savedToy)
    } catch (err) {
        loggerService.error('Cannot save toy', err)
        res.status(400).send('Cannot save toy')
    }
})
// app.put('/api/toy', (req, res) => {
//     // const loggedinUser = userService.validateToken(req.cookies.loginToken)
//     // if (!loggedinUser) return res.status(401).send('Cannot update toy')
//     const toy = {
//         _id: req.body._id,
//         name: req.body.name,
//         labels: req.body.labels,
//         inStock: req.body.inStock,
//         // speed: +req.body.speed,
//         price: +req.body.price,
//     }
//     // toyService.save(toy, loggedinUser)
//     toyService.save(toy)
//         .then((savedToy) => {
//             res.send(savedToy)
//         })
//         .catch((err) => {
//             loggerService.error('Cannot save toy', err)
//             res.status(400).send('Cannot save toy')
//         })

// })

// Toy DELETE
app.delete('/api/toy/:toyId', async (req, res) => {
    // const loggedinUser = userService.validateToken(req.cookies.loginToken)
    // loggerService.info('loggedinUser toy delete:', loggedinUser)
    // if (!loggedinUser) {
    //     loggerService.info('Cannot remove toy, No user')
    //     return res.status(401).send('Cannot remove toy')
    // }

    const { toyId } = req.params
    // toyService.remove(toyId, loggedinUser)
    var toy = await toyService.remove(toyId)
    try {
        loggerService.info(`Toy ${toyId} removed`)
        res.send('Removed!')
    } catch (err) {
        loggerService.error('Cannot remove toy', err)
        res.status(400).send('Cannot remove toy')
    }
})
// app.delete('/api/toy/:toyId', (req, res) => {
//     // const loggedinUser = userService.validateToken(req.cookies.loginToken)
//     // loggerService.info('loggedinUser toy delete:', loggedinUser)
//     // if (!loggedinUser) {
//     //     loggerService.info('Cannot remove toy, No user')
//     //     return res.status(401).send('Cannot remove toy')
//     // }

//     const { toyId } = req.params
//     // toyService.remove(toyId, loggedinUser)
//     toyService.remove(toyId)
//         .then(() => {
//             loggerService.info(`Toy ${toyId} removed`)
//             res.send('Removed!')
//         })
//         .catch((err) => {
//             loggerService.error('Cannot remove toy', err)
//             res.status(400).send('Cannot remove toy')
//         })

// })


// // AUTH API
// app.get('/api/user', (req, res) => {
//     userService.query()
//         .then((users) => {
//             res.send(users)
//         })
//         .catch((err) => {
//             loggerService.error('Cannot load users', err)
//             res.status(400).send('Cannot load users')
//         })
// })

// app.post('/api/auth/login', (req, res) => {
//     const credentials = req.body
//     userService.checkLogin(credentials)
//         .then(user => {
//             if (user) {
//                 const loginToken = userService.getLoginToken(user)
//                 res.cookie('loginToken', loginToken)
//                 res.send(user)
//             } else {
//                 loggerService.info('Invalid Credentials', credentials)
//                 res.status(401).send('Invalid Credentials')
//             }
//         })
// })

// app.post('/api/auth/signup', (req, res) => {
//     const credentials = req.body
//     userService.save(credentials)
//         .then(user => {
//             if (user) {
//                 const loginToken = userService.getLoginToken(user)
//                 res.cookie('loginToken', loginToken)
//                 res.send(user)
//             } else {
//                 loggerService.info('Cannot signup', credentials)
//                 res.status(400).send('Cannot signup')
//             }
//         })
// })

// app.post('/api/auth/logout', (req, res) => {
//     res.clearCookie('loginToken')
//     res.send('logged-out!')
// })


// app.put('/api/user', (req, res) => {
//     const loggedinUser = userService.validateToken(req.cookies.loginToken)
//     if (!loggedinUser) return res.status(400).send('No logged in user')
//     const { diff } = req.body
//     if (loggedinUser.score + diff < 0) return res.status(400).send('No credit')
//     loggedinUser.score += diff
//     return userService.save(loggedinUser).then(user => {
//         const token = userService.getLoginToken(user)
//         res.cookie('loginToken', token)
//         res.send(user)
//     })
// })


app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})


// const PORT = 3030
const port = process.env.PORT || 3030
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)
