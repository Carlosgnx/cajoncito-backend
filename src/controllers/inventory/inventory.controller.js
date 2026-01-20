async function getInventories(req, res, next) {
    try {
        const inventories = await req.db.query('SELECT i.id, s.name as storage, p.name as product, i.quantity FROM inventories as i join products as p on i.product_id = p.id join storages as s on i.storage_id = s.id')

        return res.status(200).json({
            data: inventories
        })
    } catch (error) {
        next(error)
    }
}

async function adjustInventory(req, res, next) {
    try {
        const { id, quantity } = req.body
        req.db.beginTransaction()
        const result = await req.db.query(`UPDATE inventories SET quantity = ? WHERE id = ?`, [quantity, id])
        const inventoryInfo = await req.db.query('SELECT product_id FROM inventories WHERE id = ?', [id])
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

async function registerInbound(req, res, next) {
    try {
        const { storage_id, product_list } = req.body;

        // Validación básica de los datos recibidos
        if (!storage_id || !product_list?.length) {
            return res.status(400).json({
                message: 'Datos incompletos.'
            });
        }

        req.db.beginTransaction();

        // Iterar sobre cada producto en la lista
        for (const product of product_list) {

            // Actualizar inventario para el producto actual
            await req.db.query(
                'UPDATE inventories SET quantity = quantity + ? WHERE product_id = ? AND storage_id = ?',
                [product.quantity, product.id, storage_id]
            );

            // Registrar en el log de inventario
            await req.db.query(
                `INSERT INTO inventory_logs 
                (product_id, quantity, type, origin_type, destination_type, destination_id, created_by) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    product.id,
                    product.quantity,
                    'inbound',
                    'external',
                    'storage',
                    storage_id,
                    req.user.id
                ]
            );
        }

        req.db.commit();

        return res.status(200).json({
            message: 'Entrada registrada correctamente!'
        });
    } catch (error) {
        req.db.rollback();
        next(error)
    }
}

async function getProductStock(req, res, next) {
    try {
        const { product_id, storage_id } = req.params
        const stock = await req.db.query('SELECT p.name, i.quantity FROM inventories as i join products as p on i.product_id = p.id WHERE i.product_id = ? and i.storage_id = ?', [product_id, storage_id]);
        return res.status(200).json({
            data: stock[0]
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error en el servidor.'
        })
    }
}

async function registerOutbound(req, res, next) {
    try {
        const { product_id, storage_id, quantity } = req.body

        req.db.beginTransaction()
        try {
            await req.db.query('UPDATE inventories SET quantity = quantity - ? WHERE product_id = ? and storage_id = ?', [quantity, product_id, storage_id]);
        } catch (error) {
            req.db.rollback()
            return res.status(404).json({
                message: 'No hay suficiente cantidad en almacen.'
            })
        }
        await req.db.query('INSERT INTO inventory_logs (product_id, quantity, type, origin_type, origin_id, destination_type, created_by) VALUES (?,?,?,?,?,?,?)', [product_id, quantity, 'outbound', 'storage', storage_id, 'external', req.user.id])
        req.db.commit()

        return res.status(200).json({
            message: 'Salida registrada correctamente!'
        })
    } catch (error) {
        req.db.rollback()
        next(error)
    }
}

async function outboundToVehicle(req, res, next) {
    try {
        const { vehicle_id, storage_id, product_list, created_by } = req.body;
        console.log('outboundToVehicle', req.body);

        // Validación básica de los datos recibidos 
        if (!vehicle_id || !product_list?.length || !created_by) {
            return res.status(400).json({
                message: 'Datos incompletos.'
            });
        }

        req.db.beginTransaction();

        try {
            // Iterar sobre cada producto en la lista
            for (const product of product_list) {

                // 1. Verificar y reducir inventario en almacén
                const updateStorage = await req.db.query(
                    'UPDATE inventories SET quantity = quantity - ? WHERE product_id = ? AND storage_id = ? AND quantity >= ?',
                    [product.quantity, product.id, storage_id, product.quantity]
                );

                if (updateStorage.affectedRows === 0) {
                    const productInfo = await req.db.query(
                        'SELECT name FROM products WHERE id = ?',
                        [product.id]
                    );
                    throw new Error(`No hay suficiente cantidad en almacén para el producto: ${productInfo[0].name}`);
                }

                await req.db.query(
                    'UPDATE vehicle_inventories SET quantity = quantity + ? WHERE product_id = ? AND vehicle_id = ?',
                    [product.quantity, product.id, vehicle_id]
                );

                // 3. Registrar en el log de inventario
                await req.db.query(
                    `INSERT INTO inventory_logs 
                    (product_id, quantity, type, origin_type, origin_id, destination_type, destination_id, created_by) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        product.id,
                        product.quantity,
                        'outbound',
                        'storage',
                        storage_id,
                        'vehicle',
                        vehicle_id,
                        created_by
                    ]
                );
            }

            req.db.commit();

            return res.status(200).json({
                message: 'Salida registrada correctamente!',
            });

        } catch (error) {
            req.db.rollback();
            next(error)
        }

    } catch (error) {
        req.db.rollback();
        next(error)
    }
}

module.exports = {
    getInventories,
    registerInbound,
    registerOutbound,
    outboundToVehicle,
    getProductStock,
    adjustInventory
}   