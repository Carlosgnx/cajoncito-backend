const { db } = require('../../app');

async function getRoles(user) {
    try {
        const userRolesObjArray = await db.query(`SELECT r.name
            FROM roles r
            JOIN user_roles ur ON r.id = ur.role_id
            WHERE ur.user_id = ${user.id}`)
        const userRolesArray = userRolesObjArray.map(({ name }) => name)
        return userRolesArray
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getRoles
}