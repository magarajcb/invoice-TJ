const express=require("express")
const {
  getCustomers,
  createCustomer,
  deleteCustomer,
  updateCustomer,
  getCustomerById
} = require("./customer.controller");
const router=express.Router()
router.post("/",createCustomer)
router.get("/",getCustomers)
router.get("/:id", getCustomerById);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);
module.exports = router;