const Customer=require("./customer.model")
const createCustomer=async (data)=>{
return await Customer.create(data)
}
const getCustomers=async ()=>{
    return await Customer.find().sort({createdAt:-1})
}
const getCustomerById = async (id) => {
  return await Customer.findById(id);
}
const updateCustomer=async (id,data)=>{
    return await Customer.findByIdAndUpdate(id,data,{
         new:true,
         runValidators:true   
    })
}
const deleteCustomer = async (id) => {
  return await Customer.findByIdAndDelete(id);
}
module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};