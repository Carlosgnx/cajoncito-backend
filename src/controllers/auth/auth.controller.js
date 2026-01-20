const { generateToken } = require('../../utils/jwt')
const bcrypt = require('bcrypt')

async function login(req, res) {
    try {
        const { username, password } = req.body
        const user = await req.db.query('SELECT * FROM Users WHERE username = ?', [username])
        console.log(user);

        // Caso el usuario no existe
        if (!user || user.length === 0) {
            return res.status(404).json({
                message: 'El Usuario no existe.'
            })
        }

        // Comparar contraseña con contraseña encriptada
        const passwordMatch = await bcrypt.compare(password, user[0].password_hash)

        // Contraseña correcta
        if (passwordMatch) {
            delete user[0].passwordHash
            const accessToken = generateToken(user[0])
            return res.json({
                message: 'Sesión iniciada con éxito!',
                data: accessToken
            })
        }
        // Contraseña incorrecta
        else {
            return res.status(404).json({
                message: 'Credenciales incorrectas.'
            })
        }
    } catch (error) {
        next(error)
    }
}

async function register(req, res) {
    const { fullname, username, password } = req.body
    const userExists = await req.db.query('SELECT username FROM users WHERE username = ?', [username])

    // Verifica si el usuario ya existe
    if (userExists && userExists.length > 0) {
        return res.status(404).json({
            message: 'El usuario ya existe.'
        })
    }

    // Listo para registrar
    try {
        const hashedPassword = await bcrypt.hash(password, 8)
        await req.db.query('INSERT INTO users (fullname, username , password_hash) VALUES (?, ?, ?)', [fullname, username, hashedPassword])
        return res.status(200).json({
            message: 'Usuario creado correctamente!'
        })
    } catch (error) {
        return res.status(404).json({
            message: 'Hubo un error al crear el usuario en la base de datos',
        })
    }
}

module.exports = {
    login,
    register
}
