
const mongoose = require("mongoose");
const Customer = require("../customer/customer.model");
const Product = require("../product/product.model");
const invoiceRepository = require("./invoice.repository");

const roundMoney = (value) =>
  Math.round((value + Number.EPSILON) * 100) / 100;

// Generate invoice number
const generateInvoiceNumber = () =>
  `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// Calculate invoice totals
const calculateTotals = (
  items,
  discountPercentage = 0,
  taxPercentage = 0
) => {
  if (!items.length) {
    throw new Error("An invoice must contain at least one item");
  }

  if (
    !Number.isFinite(discountPercentage) ||
    discountPercentage < 0 ||
    discountPercentage > 100
  ) {
    throw new Error("Discount percentage must be between 0 and 100");
  }

  if (
    !Number.isFinite(taxPercentage) ||
    taxPercentage < 0 ||
    taxPercentage > 100
  ) {
    throw new Error("Tax percentage must be between 0 and 100");
  }

  const subtotal = roundMoney(
    items.reduce((sum, item) => sum + item.lineTotal, 0)
  );

  const discountAmount = roundMoney(
    (subtotal * discountPercentage) / 100
  );

  const taxableAmount = roundMoney(subtotal - discountAmount);

  const taxAmount = roundMoney(
    (taxableAmount * taxPercentage) / 100
  );

  const grandTotal = roundMoney(taxableAmount + taxAmount);

  return {
    subtotal,
    discountPercentage,
    discountAmount,
    taxPercentage,
    taxAmount,
    grandTotal,
  };
};

// Validate products and create price snapshots
const prepareItems = async (requestedItems) => {
  if (!Array.isArray(requestedItems) || requestedItems.length === 0) {
    throw new Error("Provide at least one invoice item");
  }

  const preparedItems = [];

  for (const item of requestedItems) {
    if (!mongoose.isValidObjectId(item.product)) {
      throw new Error("Invalid product ID");
    }

    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new Error("Quantity must be a positive whole number");
    }

    const product = await Product.findById(item.product);

    if (!product) {
      throw new Error(`Product not found: ${item.product}`);
    }

    if (product.isActive === false) {
      throw new Error(`Product is inactive: ${product.name}`);
    }

    const unitPrice = roundMoney(product.price);

    preparedItems.push({
      product: product._id,
      name: product.name,
      sku: product.sku,
      quantity: item.quantity,
      unitPrice,
      lineTotal: roundMoney(unitPrice * item.quantity),
    });
  }

  return preparedItems;
};

// Validate customer
const validateCustomer = async (customerId) => {
  if (!mongoose.isValidObjectId(customerId)) {
    throw new Error("A valid customer ID is required");
  }

  const customer = await Customer.findById(customerId);

  if (!customer) {
    throw new Error("Customer not found");
  }

  return customer;
};

// CREATE invoice
const createInvoice = async (data) => {
  const customer = await validateCustomer(data.customer);
  const items = await prepareItems(data.items);

  const totals = calculateTotals(
    items,
    data.discountPercentage ?? 0,
    data.taxPercentage ?? 0
  );

  return invoiceRepository.create({
    invoiceNumber: generateInvoiceNumber(),
    customer: customer._id,
    items,
    ...totals,
    amountPaid: 0,
    paymentStatus: "Unpaid",
    status: "Draft",
    dueDate: data.dueDate || undefined,
  });
};

// READ all invoices
const getInvoices = async () => {
  return invoiceRepository.findAll();
};

// READ one invoice
const getInvoiceById = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new Error("Invalid invoice ID");
  }

  const invoice = await invoiceRepository.findById(id);

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  return invoice;
};

// UPDATE draft invoice
const updateInvoice = async (id, data) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new Error("Invalid invoice ID");
  }

  const invoice = await invoiceRepository.findById(id);

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  if (invoice.status !== "Draft") {
    throw new Error("Only draft invoices can be edited");
  }

  const customerId = data.customer ?? invoice.customer._id ?? invoice.customer;
  const customer = await validateCustomer(customerId);

  const requestedItems =
    data.items ??
    invoice.items.map((item) => ({
      product: item.product._id ?? item.product,
      quantity: item.quantity,
    }));

  const items = await prepareItems(requestedItems);

  const totals = calculateTotals(
    items,
    data.discountPercentage ?? invoice.discountPercentage,
    data.taxPercentage ?? invoice.taxPercentage
  );

  invoice.customer = customer._id;
  invoice.items = items;
  Object.assign(invoice, totals);

  if (data.dueDate !== undefined) {
    invoice.dueDate = data.dueDate || undefined;
  }

  return invoiceRepository.update(invoice);
};

// DELETE draft invoice only
const deleteInvoice = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new Error("Invalid invoice ID");
  }

  const invoice = await invoiceRepository.findById(id);

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  if (invoice.status !== "Draft") {
    throw new Error("Only draft invoices can be deleted");
  }

  return invoiceRepository.deleteById(id);
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
};
