# ZShop Backend API

This repository contains the backend implementation for the ZShop application. The API is built using Node.js and is deployed on AWS Elastic Beanstalk. Below are the details of the GitHub repository and the available API endpoints.

## Repository Link
GitHub Repository: https://github.com/rexinfinitymdx/CST3144-Zshop-backend

## Base API URL
AWS Elastic Beanstalk API Endpoint:  
`https://mynodeappmdx.eu-west-2.elasticbeanstalk.com`


## API Endpoints

### Fetch All Products
Method: GET  
Endpoint: `/show/products`  
Full URL:  
`https://mynodeappmdx.eu-west-2.elasticbeanstalk.com/show/products`  

Description: Retrieves the list of all products.

---

### Search for Products
Method: GET  
Endpoint: `/show/products/search/:searchContent`  
Example Full URL:  
`https://mynodeappmdx.eu-west-2.elasticbeanstalk.com/show/products/search/searchContent`  

Description: Searches for products using the provided `searchContent`.

---

### Place an Order
Method: POST  
Endpoint: `/store/orders`  
Full URL:  
`https://mynodeappmdx.eu-west-2.elasticbeanstalk.com/store/orders` 

Description: Places an order with the provided order details.


### Example JSON for Place Order
Here is an example JSON body to use with the `POST` request for placing an order:

Example json body Request

{
  "orderDetails": {
    "fullName": "Rasel Ahmed",
    "phoneNumber": "1234568",
    "address": "h-12asdas",
    "city": "3qwrewr",
    "state": "AL",
    "zip": 23434,
    "gift": "Send as a gift",
    "method": "Business"
  },
  "cartItems": [
    {
      "id": 1,
      "quantity": 1
    }
  ],
  "orderDate": "2024-11-26T20:02:29.994Z",
  "status": "Pending"
}


---

### Update Product Information
Method: PUT  
Endpoint: `/update/products`  
Full URL:  
`https://mynodeappmdx.eu-west-2.elasticbeanstalk.com/update/products`  

Description: Updates information for a specific product.


Example body json data

{
  "cartItems": [
    {
      "id": 1,
      "quantity": 1
    }
  ]
}

---
