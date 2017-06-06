The Products Database

The products database is a collection of products each with fields of:

  name: String
price: Number
department: String
color: String
sales: Number
stock: Number
The sales are the number of times that particular product has been sold.The stock is the number of
  units in stock of that product.



Insert a product with the following properties

name: "Hammer"
price: 9.99
department: "Hardware"
color: "red"
sales: 80
stock: 50

db.products.insert({
  "name": "Hammer",
  "price": 9.99,
  "department": "Hardware",
  "color": "red",
  "sales": 80,
  "stock": 50
});

Insert the following products in a single query

var data = [{
    "name": "Screwdriver",
    "price": 19.99,
    "department": "Hardware",
    "color": "green",
    "sales": 75,
    "stock": 50
  },
  {
    "name": "Wrench",
    "price": 21.99,
    "department": "Hardware",
    "color": "orange",
    "sales": 70,
    "stock": 50
  }
];
db.products.insert(data);


Updating Products

Note
for some of these you may have to refer to update operators like $min and $max.

Change the department of all products in the "Hardware"
department to "Hardware Tools"

db.products.update({
  department: "Hardware"
}, {
  $set: {
    department: "Hardware Tools"
  }
}, {
  multi: true
})

Change the price of all products in the "Hardware Tools"
department to cost $10 more than their current price

db.products.update({
  department: "Hardware Tools"
}, {
  $inc: {
    price: 10
  }
}, {
  multi: true
})


Update the sales of all the products in the "Hardware Tools"
department to be at least 50

db.products.update({
  department: "Hardware Tools"
}, {
  $max: {
    sales: 50
  }
}, {
  multi: true
})

Change the department of all the products in the "Hardware Tools"
department to be "Hardware"
again

db.products.update({
  department: "Hardware Tools"
}, {
  $set: {
    department: "Hardware"
  }
}, {
  multi: true
})

Change the price of all the products in the "Hardware"
department to be $10 less than their current price

db.products.update({
  department: "Hardware"
}, {
  $inc: {
    price: -10
  }
}, {
  multi: true
})

Change the sales of all the products in the "Hardware"
department to be at most 10

db.products.update({
  department: "Hardware"
}, {
  $min: {
    sales: 10
  }
}, {
  multi: true
})

Update the first product in the "Hardware"
department to have one more sale

db.products.update({
  department: "Hardware"
}, {
  $inc: {
    sales: 1
  }
}, {})


Removing Products

Remove the first product in the "Hardware"
department

db.products.deleteOne({
  department: "Hardware"
}, {})

Remove all products in the "Hardware"
department

db.products.deleteMany({
  department: "Hardware"
}, {})

Finding Products

Note that you should use projection
for these queries to filter the returned fields to only those fields described
  in each problem.

Find the names of all the products that are out of stock

db.products.find({
  stock: {
    $lte: 0
  }
}, {
  _id: 0,
  name: 1
})


Find the stock count of all the products with a price below $100

db.products.find({
  price: {
    $lt: 100
  }
}, {
  _id: 0,
  name: 1,
  stock: 1
})

Find the name, color and department of all the products with a price between $100 and $1000

db.products.find({
  $and: [{
    price: {
      $gte: 100
    }
  }, {
    price: {
      $lte: 1000
    }
  }]
}, {
  _id: 0,
  name: 1,
  color: 1,
  department: 1
})

Find the names of all the red products

db.products.find({
  color: {
    $eq: "red"
  }
}, {
  _id: 0,
  name: 1
})


Find only the IDs of all the red and blue products

db.products.find({
  color: {
    $in: ["red", "blue"]
  }
}, {
  _id: 1
})


Find the names of all the products that are not red or blue

db.products.find({
  color: {
    $nin: ["red", "blue"]
  }
}, {
  _id: 0,
  name: 1
})


Find the names of all the products that are not in the Sports or Games departments

db.products.find({
  department: {
    $nin: ["Sports", "Games"]
  }
}, {
  _id: 0,
  name: 1
})

Find the name and price of all the products with names that begin with the letter F and end with the letter S and ignore
case

db.products.find({
  name: {
    $regex: /^f.+s$/i
  }
}, {
  _id: 0,
  name: 1,
  price: 1
})

Using $where, find all the product names that begin with T

db.products.find({
  $where: "this.name[0] === 'T'"
}, {
  _id: 0,
  name: 1
})


Using $where, find all the product names that begin with capital F or end with lowercase S

db.products.find({
  $where: "this.name[0] === 'F' || this.name.slice(-1) === 's'"
}, {
  _id: 0,
  name: 1
})

Using $where, find all the product names that begin with capital T and have a price less than $100

db.products.find({
  $where: "this.name[0] === 'T' && this.price < 100"
}, {
  _id: 0,
  name: 1
})

Using $where, find all the product names and prices of products that either start with A and have a price of
at least $100 or start with B and have a price of at most $100

db.products.find({
  $where: "(this.name[0] === 'A' && this.price >= 100) || (this.name[0] === 'B' && this.price <= 100)"
}, {
  _id: 0,
  name: 1,
  price: 1
})


Aggregating Products

With the Aggregation Pipeline

For each of these challenges use the Aggregation Pipeline to create a query that returns the described results
.

Find the total number of sales each department made and sort the results by the department name

db.products.aggregate([{
    $group: {
      _id: "$department",
      sales: {
        $sum: "$sales"
      }
    }
  },
  {
    $sort: {
      _id: 1
    }
  }
])

Find the total number of sales each department made of a product with a price of
at least $100 and sort the results by the department name

db.products.aggregate([{
    $match: {
      price: {
        $gte: 100
      }
    }
  },
  {
    $group: {
      _id: "$department",
      sales: {
        $sum: "$sales"
      }
    }
  },
  {
    $sort: {
      _id: 1
    }
  }
])


Find the number of out of stock products in each department and sort the results by the department name
With Map - Reduce

db.products.mapReduce(
  function() {
    emit(this.department, this._id);
  },
  function(keys, values) {
    return values.length;
  }, {
    query: {
      stock: {
        $lte: 0
      }
    },
    out: "Out_of_stock_by_department"
  }
)
.find()

For each of these challenges use the Map - Reduce to create a query that returns the described results
.

Find the number of products with each color

db.products.mapReduce(
  function() {
    emit(this.color, this._id);
  },
  function(keys, values) {
    return values.length;
  }, {
    query: {},
    out: "product_count_color"
  }
)
.find()


Find the total revenue of each department(how much did each department make in
  sales ? )

db.products.mapReduce(
  function() {
    emit(this.department, this.sales * this.price);
  },
  function(keys, values) {
    return Array.sum(values);
  }, {
    query: {},
    out: "department_revenue"
  }
)
.find()


Find the potential revenue of each product(how much can each product make
  if the entire remaining stock is sold ? )

db.products.mapReduce(
  function() {
    emit(this.name, this.stock * this.price);
  },
  function(keys, values) {
    return Array.sum(values);
  }, {
    query: {},
    out: "product_potential_revenue"
  }
)
.find()


Find the sum of the total and potential revenue
for each product

db.products.mapReduce(
  function() {
    emit(this.name, (this.stock + this.sales) * this.price);
  },
  function(keys, values) {
    return Array.sum(values);
  }, {
    query: {},
    out: "product_revenue"
  }
)
.find()


With Single Purpose Aggregation Operations

For each of these challenges use the Single Purpose Aggregation Operations to create a query that returns the described results
.

How many products are there ?

db.products.count()

How many products are out of stock ?

db.products.count({
  stock: 0
})

How many products are fully stocked ? (100)

db.products.count({
  stock: 100
})

How many products are almost out of stock ? ( >= 5)

db.products.count({
  stock: {
    $lte: 5
  }
})

What are all the unique names of all the departments ?

db.products.distinct("department")

What are all the unique names of product colors ?

db.products.distinct("color")

Find the total number of out of stock products
for each department using the db.collection.group() method

db.products.group({
  key: {
    department: 1
  },
  cond: {
    stock: {
      $lte: 0
    }
  },
  reduce: function(curr, result) {
    result.count++
  },
  initial: {
    count: 0
  }
})

Now would be a great time to commit!