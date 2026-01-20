async function getVehicleInventories(req, res, next) {
    try {
        const inventories = await req.db.query(`
            SELECT 
              vi.id, 
              v.plate,
              CONCAT(v.brand, ' ', v.model, ' ', v.year, ' - ', v.plate) AS vehicle,
              p.name, 
              vi.quantity 
            FROM 
              vehicle_inventories AS vi 
              JOIN vehicles AS v ON vi.vehicle_id = v.id 
              JOIN products AS p ON vi.product_id = p.id
          `);
        return res.status(200).json({
            data: inventories
        })
    } catch (error) {
        next(error)
    }
}

async function getProductStockFromVehicle(req, res, next) {
    try {
        const { product_id, vehicle_id } = req.params
        const stock = await req.db.query('SELECT p.name, vi.quantity FROM vehicle_inventories as vi join vehicles as v join products as p on vi.vehicle_id = v.id and vi.product_id = p.id WHERE vi.product_id = ? and vi.vehicle_id = ?', [product_id, vehicle_id])
        console.log(stock);

        return res.status(200).json({
            data: stock[0]
        })
    } catch (error) {
        next(error)
    }
}

async function adjustVehicleInventory(req, res, next) {
    try {
        const { id, quantity } = req.body
        req.db.beginTransaction()
        const result = await req.db.query(`UPDATE vehicle_inventories SET quantity = ? WHERE id = ?`, [quantity, id])
        const inventoryInfo = await req.db.query('SELECT product_id FROM vehicle_inventories WHERE id = ?', [id])
        // Registrar en el log de inventario
        const result2 = await req.db.query(
            `INSERT INTO inventory_logs 
            (product_id, quantity, type, created_by) 
            VALUES (?, ?, ?, ?)`,
            [
                inventoryInfo[0].product_id,
                quantity,
                'adjustment',
                req.user.id
            ]
        );
        if (result.affectedRows && result2.affectedRows) {
            req.db.commit()
            res.status(200).json({
                message: 'Inventario ajustado correctamente.'
            })
        } else {
            req.db.rollback()
            res.status(400).json({
                message: 'Ocurrió un error en la solicitud.'
            })
        }
    } catch (error) {
        req.db.rollback()
        next(error)
    }
}

module.exports = {
    getVehicleInventories,
    getProductStockFromVehicle,
    adjustVehicleInventory
}
