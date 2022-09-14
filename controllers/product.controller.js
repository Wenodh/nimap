const db = require('../models');
const Product = db.products;

const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};
// Create and Save a new Product
exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({ message: 'Content can not be empty!' });
        return;
    }

    // Create a Product
    const product = new Product({
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false,
    });

    // Save Product in the database
    product
        .save(product)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    'Some error occurred while creating the Product.',
            });
        });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    const { page, size, title } = req.query;
    var condition = title
        ? { title: { $regex: new RegExp(title), $options: 'i' } }
        : {};

    const { limit, offset } = getPagination(page, size);

    Product.paginate(condition, { offset, limit })
        .then((data) => {
            res.send({
                totalItems: data.totalDocs,
                tutorials: data.docs,
                totalPages: data.totalPages,
                currentPage: data.page - 1,
            });
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    'Some error occurred while retrieving tutorials.',
            });
        });
};

// Find a single Product with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Product.findById(id)
        .then((data) => {
            if (!data)
                res.status(404).send({
                    message: 'Not found Product with id ' + id,
                });
            else res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: 'Error retrieving Product with id=' + id,
            });
        });
};

// Update a Product by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: 'Data to update can not be empty!',
        });
    }

    const id = req.params.id;

    Product.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Product with id=${id}. Maybe Product was not found!`,
                });
            } else res.send({ message: 'Product was updated successfully.' });
        })
        .catch((err) => {
            res.status(500).send({
                message: 'Error updating Product with id=' + id,
            });
        });
};

// Delete a Product with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Product.findByIdAndRemove(id)
        .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Product with id=${id}. Maybe Product was not found!`,
                });
            } else {
                res.send({
                    message: 'Product was deleted successfully!',
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: 'Could not delete Product with id=' + id,
            });
        });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
    Product.deleteMany({})
        .then((data) => {
            res.send({
                message: `${data.deletedCount} Tutorials were deleted successfully!`,
            });
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    'Some error occurred while removing all tutorials.',
            });
        });
};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    Product.paginate({ published: true }, { offset, limit })
        .then((data) => {
            res.send({
                totalItems: data.totalDocs,
                tutorials: data.docs,
                totalPages: data.totalPages,
                currentPage: data.page - 1,
            });
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message ||
                    'Some error occurred while retrieving tutorials.',
            });
        });
};
