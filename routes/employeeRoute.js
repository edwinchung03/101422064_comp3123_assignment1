// Importing all required libraries at the beginning
const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');
const { body } = require('express-validator')

router.get("/employees", async (req, res) => {
  try {
    // will find all employees in the database
    const employees = await Employee.find({});

    return res.status(200).json(
      // function to replace for loop
      employees.map((emp) => ({
        employee_id: emp._id,
        first_name: emp.first_name,
        last_name: emp.last_name,
        email: emp.email,
        position: emp.position,
        salary: emp.salary,
        date_of_joining: emp.date_of_joining,
        department: emp.department,
      }))
    );
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server error : check your console");
  }
});

router.post("/employees", [
  // validating errors with express-validator
  body("first_name").notEmpty().withMessage("First name is required"),
  body("last_name").notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("position").notEmpty().withMessage("Position is required"),
  body("salary").isNumeric().withMessage("Please enter a number"),
  body("date_of_joining").isISO8601().withMessage("Please enter a valid date"),
  body("department").notEmpty().withMessage("Department is required")],
  async (req, res) => {

  // requested bodies to create an employee
  const { first_name, last_name, email, position, salary, date_of_joining, department } = req.body;
    
    try {
      let employee = await Employee.findOne({ email });
      // if employee already exist
      if (employee) {
        return res.status(400).json({ 
          status: false,
          message: "Employee already exists" 
        });
      }
  
      // saving new employee into the database
      employee = new Employee({
        first_name,
        last_name,
        email,
        position,
        salary,
        date_of_joining,
        department
      });
        
      await employee.save();
  
      return res.status(201).json({
          message: "Employee created successfully",
          employee_id: employee._id,
      });

    } catch (err) {
      console.log(err.message);
      return res.status(500).send("Server error : check your console");
    }
  }
);

router.get("/employees/:eid", async (req, res) => {

  try {
    // checking eid parameter
    const employee = await Employee.findById(req.params.eid);

    // if employee doesn't exist
    if (!employee){
      return res.status(404).json({ 
        status: false,
        message: "Employee Not Found" 
      })
    }

    // returning values for that employee
    return res.status(200).json({
      employee_id : employee._id,
      first_name : employee.first_name,
      last_name : employee.last_name,
      email: employee.email,
      position: employee.position,
      salary: employee.salary,
      date_of_joining: employee.date_of_joining,
      department: employee.department
    });

    } catch (err) {
      console.log(err.message);
      return res.status(500).send("Server error : check your console");
    }
});

router.put("/employees/:eid", [
  // validating errors with express-validator
  body("position").notEmpty().withMessage("Position is required"),
  body("salary").isNumeric().withMessage("Please enter a number"),],
  async (req, res) => {
  
  // requested bodies to edit employee
  const { position, salary } = req.body;

  try {

    // saving data and find employee with my parameter id
    const employee = await Employee.findById(req.params.eid);
    
    // if employee doesn't exist  
    if (!employee){
      return res.status(404).json({ 
        status: false,
        message: "Employee Not Found" 
      });
    }
    
    // will modify position and salary of the employee and save in the database
    if (position) employee.position = position;
    if (salary) employee.salary = salary;
    employee.updated_at = Date.now();

    await employee.save();

    return res.status(200).json({
      message: "Employee details updated successfully",
    });

  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server error : check your console");
  }
});

router.delete("/employees", async (req, res) => {

  // employee id that I want to delete
  const { eid } = req.query;

  try {
    // function to find and delete at the same time
    const employee = await Employee.findByIdAndDelete(eid);

    // if employee doesn't exist
    if (!employee){
      return res.status(404).json({ 
        status: false,
        message: "Employee Not Found" 
      })
    }

    return res.status(204).json({ message: "Employee deleted successfully" });

  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server error : check your console");
  }
});

// export to module to use in other files
module.exports = router;