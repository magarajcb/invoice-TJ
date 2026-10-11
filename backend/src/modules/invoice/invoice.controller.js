
const invoiceService = require("./invoice.service");

const createInvoice = async (req, res) => {
  try {
    const invoice = await invoiceService.createInvoice(req.body);

    res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: invoice,
    });
  } catch (error) {
    const status = error.message.includes("not found") ? 404 : 400;

    res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

const getInvoices = async (req, res) => {
  try {
    const invoices = await invoiceService.getInvoices();

    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch invoices",
    });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id);

    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    const status =
      error.message === "Invoice not found" ? 404 : 400;

    res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

const updateInvoice = async (req, res) => {
  try {
    const invoice = await invoiceService.updateInvoice(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Invoice updated successfully",
      data: invoice,
    });
  } catch (error) {
    const status =
      error.message === "Invoice not found" ? 404 : 400;

    res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    await invoiceService.deleteInvoice(req.params.id);

    res.status(200).json({
      success: true,
      message: "Draft invoice deleted successfully",
    });
  } catch (error) {
    const status =
      error.message === "Invoice not found" ? 404 : 400;

    res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
};
