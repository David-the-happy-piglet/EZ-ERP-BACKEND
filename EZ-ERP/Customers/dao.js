import Customer from './model.js';
import { v4 as uuidv4 } from 'uuid';

class CustomerDAO {
    // Create a new customer
    async createCustomer(customerData) {
        try {
            const customer = new Customer({
                ...customerData,
                _id: customerData._id || `CUST-${uuidv4().substring(0, 8)}`,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            return await customer.save();
        } catch (error) {
            throw new Error(`Error creating customer: ${error.message}`);
        }
    }

    // Get all customers
    async getAllCustomers() {
        try {
            return await Customer.find({}).sort({ createdAt: -1 });
        } catch (error) {
            throw new Error(`Error fetching customers: ${error.message}`);
        }
    }

    // Get customer by ID
    async getCustomerById(id) {
        try {
            return await Customer.findById(id);
        } catch (error) {
            throw new Error(`Error finding customer: ${error.message}`);
        }
    }

    // Search customers by name or company
    async searchCustomers(query) {
        try {
            const searchRegex = new RegExp(query, 'i');
            return await Customer.find({
                $or: [
                    { companyName: searchRegex },
                    { name: searchRegex }
                ]
            }).sort({ createdAt: -1 });
        } catch (error) {
            throw new Error(`Error searching customers: ${error.message}`);
        }
    }

    // Update customer
    async updateCustomer(id, updateData) {
        try {
            const customer = await Customer.findByIdAndUpdate(
                id,
                {
                    ...updateData,
                    updatedAt: new Date()
                },
                { new: true, runValidators: true }
            );
            return customer;
        } catch (error) {
            throw new Error(`Error updating customer: ${error.message}`);
        }
    }

    // Delete customer
    async deleteCustomer(id) {
        try {
            const customer = await Customer.findByIdAndDelete(id);
            return customer;
        } catch (error) {
            throw new Error(`Error deleting customer: ${error.message}`);
        }
    }

    // Get customer by email
    async getCustomerByEmail(email) {
        try {
            return await Customer.findOne({ email: email.toLowerCase() });
        } catch (error) {
            throw new Error(`Error finding customer by email: ${error.message}`);
        }
    }
}

export default new CustomerDAO(); 