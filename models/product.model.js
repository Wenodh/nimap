// module.exports = (mongoose) => {
//     const Product = mongoose.model(
//         'product',
//         mongoose.Schema(
//             {
//                 title: String,
//                 description: String,
//                 published: Boolean,
//             },
//             { timestamps: true }
//         )
//     );

//     return Product;
// };
module.exports = (mongoose, mongoosePaginate) => {
    var schema = mongoose.Schema(
        {
            title: String,
            description: String,
            published: Boolean,
        },
        { timestamps: true }
    );

    schema.method('toJSON', function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });
    schema.plugin(mongoosePaginate);
    const Product = mongoose.model('product', schema);
    return Product;
};
