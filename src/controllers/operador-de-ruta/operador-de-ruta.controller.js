async function registerSale(req, res, next) {
    try {
        const { products, client_id, operator_id, vehicle_id } = req.body

        let total = await getTotalFromProducts(products, req)

        req.db.beginTransaction()
        const insert = await req.db.query('INSERT INTO sales (total, client_id, operator_id, vehicle_id) VALUES (?,?,?,?) RETURNING id', [total, client_id, operator_id, vehicle_id])
        const sale_id = insert[0].id

        const saleDetailsResult = await registerDetails('sale_details', sale_id, vehicle_id, products, req)

        // si el resultado es un string, entonces hubo un error
        if (saleDetailsResult) {
            req.db.rollback()
            return res.status(404).json({
                message: 'No hay suficiente cantidad de productos en el vehículo.'
            })
        }

        req.db.commit()

        return res.status(200).json({
            message: 'Venta registrada correctamente!'
        })
    } catch (error) {
        req.db.rollback()
        next(error)
    }
}

async function registerLoss(req, res, next) {
    try {
        const { products, client_id, operator_id, vehicle_id } = req.body

        let total = await getTotalFromProducts(products, req)

        req.db.beginTransaction()
        const insert = await req.db.query('INSERT INTO losses (total, client_id, operator_id, vehicle_id) VALUES (?,?,?,?) RETURNING id', [total, client_id, operator_id, vehicle_id])
        const loss_id = insert[0].id

        const saleDetailsResult = await registerDetails('loss_details', loss_id, vehicle_id, products, req)

        // si el resultado es un string, entonces hubo un error
        if (saleDetailsResult) {
            req.db.rollback()
            return res.status(404).json({
                message: 'No hay suficiente cantidad de productos en el vehículo.'
            })
        }

        req.db.commit()

        return res.status(200).json({
            message: 'Reemplazo registrado correctamente!'
        })
    } catch (error) {
        req.db.rollback()
        next(error)
    }
}

async function getTotalFromProducts(products, req) {
    let total = 0
    for (const product of products) {
        // Obtener información del producto
        const [productInfo] = await req.db.query(
            'SELECT name, price FROM products WHERE id = ?',
            [product.id]
        );
        total += product.quantity * productInfo.price
    }
    return total
}

async function registerDetails(table, id, vehicle_id, products, req) {
    for (const product of products) {
        try {

            // Obtener información del producto
            const [productInfo] = await req.db.query(
                'SELECT name, price FROM products WHERE id = ?',
                [product.id]
            );

            const total = product.quantity * productInfo.price
            const reference_id = table === 'sale_details' ? 'sale_id' : 'loss_id'


            // Insertar el detalle 
            const insertDetailResult = await req.db.query(
                `INSERT INTO ${table} (${reference_id}, product_id, quantity, unit_price, total) VALUES (?, ?, ?, ?, ?)`,
                [id, product.id, product.quantity, productInfo.price, total]
            );
            if (insertDetailResult.affectedRows === 0) {
                return `Error al registrar el detalle.`
            }

            // Actualizar el inventario del vehículo
            const inventoryUpdateResult = await req.db.query(
                'UPDATE vehicle_inventories SET quantity = quantity - ? WHERE vehicle_id = ? AND product_id = ?',
                [product.quantity, vehicle_id, product.id]
            );
            if (inventoryUpdateResult.affectedRows === 0) {
                return `No hay suficiente cantidad de ${productInfo.name} en el vehículo.`
            }

        } catch (error) {
            console.log(error);
            return 'Error al registrar los detalles.'
        }
    }
}

async function changeVehicle(req, res, next) {
    try {
        const { new_vehicle_id, operator_id } = req.body
        req.db.beginTransaction()
        const updateVehicle = await req.db.query('UPDATE users SET vehicle_id = ? WHERE id = ?', [new_vehicle_id, operator_id])
        if (updateVehicle.affectedRows === 0) {
            req.db.rollback()
            return res.status(404).json({
                message: 'No se pudo actualizar el vehículo.'
            })
        }
        req.db.commit()
        return res.status(200).json({
            message: 'Vehículo actualizado correctamente!'
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    registerSale,
    registerLoss,
    changeVehicle
}   