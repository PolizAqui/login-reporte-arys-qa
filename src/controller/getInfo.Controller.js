const { verifyUser } = require('../models/auth');

const controller = {};

controller.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        const user = await verifyUser({ email, password });
        console.log(user);
        if (!user.status) {
            if (user.code === 404) {
                res.status(404).json({ error: 'Usuario no encontrado' });
            } else if (user.code === 401) {
                res.status(401).json({ error: 'Contraseña incorrecta' });
            } else {
                res.status(500).json({ error: 'Error en el servidor' });
            }
        } else {
            res.status(user.code).json(user);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

module.exports = controller;
