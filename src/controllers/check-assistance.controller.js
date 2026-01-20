async function registerCheck(req, res, next) {
    try {
        const { user_id, date, time } = req.body;

        const query = `
            INSERT INTO check_logs (user_id, date, time)
            VALUES (?, ?, ?)
        `;
        await req.db.execute(query, [user_id, date, time]);

        res.status(201).json({ message: 'Asistencia registrada correctamente' });
    } catch (error) {
        next(error);
    }
}

async function registerFaceprint(req, res, next) {
    try {
        const { user_id, faceprint } = req.body;

        const query = `
            UPDATE users SET faceprint = ? WHERE user_id = ?
        `;
        await req.db.execute(query, [faceprint, user_id]);

        res.status(201).json({ message: 'Datos faciales registrados correctamente' });
    } catch (error) {
        next(error);
    }
}

async function getFaceprints(req, res, next) {
    try {
        const query = `SELECT faceprint FROM users WHERE faceprint != null`
        const data = await req.db.query(query)
        res.status(200).json({ data })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    registerCheck,
    registerFaceprint,
    getFaceprints
};