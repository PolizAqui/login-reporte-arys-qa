const pool = require('../utils/mysql.connect');
const { PG_KEY } = require('../global/_var');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const verifyUser = async ({ email, password }) => {
    try {
        let msg = {
            status: false,
            message: 'User not found',
            code: 404
        };

        const connection = await pool.getConnection();

        const sqlUser = 'SELECT cedula_rif, nombre, email, tipo_aliado, telefono, direccion, comision, password FROM aliados WHERE email = ?';
        const sqlUser2 = 'SELECT id_usuario, nombre, email, telefono, provider, provider_id, password FROM usuarios WHERE email = ?';
        const [user] = await connection.execute(sqlUser, [email]);
        const [user2] = await connection.execute(sqlUser2, [email]);

        if (user.length > 0) {
            const match = await bcrypt.compare(password, user[0].password);
            if (match) {
                const currentDate = new Date();
                const dateCreated = currentDate.toISOString().split('T')[0];
                const dateExpires = new Date(currentDate.setDate(currentDate.getDate() + 7)).toISOString().split('T')[0];

                const tokenInfo = {
                    cedula_rif: user[0].cedula_rif,
                    nombre: user[0].nombre,
                    email: user[0].email,
                    telefono: user[0].telefono,
                    date_created: dateCreated,
                    date_expires: dateExpires
                };

                const token = jwt.sign(tokenInfo, PG_KEY, { algorithm: 'HS256' });

                msg = {
                    status: true,
                    message: 'Successful login',
                    code: 200,
                    token: token
                };
            } else {
                msg = {
                    status: false,
                    message: 'Incorrect password',
                    code: 401
                };
            }
        } else if (user2.length > 0) {
            const match = await bcrypt.compare(password, user2[0].password);
            if (match) {
                const currentDate = new Date();
                const dateCreated = currentDate.toISOString().split('T')[0];
                const dateExpires = new Date(currentDate.setDate(currentDate.getDate() + 7)).toISOString().split('T')[0];

                const tokenInfo = {
                    id_usuario: user2[0].id_usuario,
                    nombre: user2[0].nombre,
                    email: user2[0].email,
                    telefono: user2[0].telefono,
                    date_created: dateCreated,
                    date_expires: dateExpires
                };

                const token = jwt.sign(tokenInfo, PG_KEY, { algorithm: 'HS256' });

                msg = {
                    status: true,
                    message: 'Successful login',
                    code: 200,
                    token: token
                };
            } else {
                msg = {
                    status: false,
                    message: 'Incorrect password',
                    code: 401
                };
            }
        }

        connection.release();
        return msg;

    } catch (err) {
        return {
            status: false,
            message: 'Server error',
            code: 500,
            error: err
        };
    }
};

module.exports = {
    verifyUser
};
