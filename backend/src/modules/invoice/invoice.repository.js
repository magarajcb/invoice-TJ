
const Invoice = require("./invoice.model");

const create = (data) => Invoice.create(data);

const findAll = () =>
  Invoice.find()
    .populate("customer", "name phone email")
    .sort({ createdAt: -1 });

const findById = (id) =>
  Invoice.findById(id).populate(
    "customer",
    "name phone email address"
  );

const update = (invoice) => invoice.save();

const deleteById = (id) =>
  Invoice.findByIdAndDelete(id);

module.exports = {
  create,
  findAll,
  findById,
  update,
  deleteById,
};
