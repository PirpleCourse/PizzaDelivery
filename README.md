# PizzaDelivery

Homework Assignment #2 API Service for Pizza Deliveries


### Local Development/Testing

Setting up your local development is set to be easy. All you have to do is run the core file of the method. And
the database will be initialized if it wasn't already. All you have to do is run `index.js`,
then follow up with API Docs tables below for testing/developing.

```sh
$> node index.js
```

### User API


|  /user | Description               | Payload                                                            | Headers | Querystring | Authorization |
|-------:|---------------------------|--------------------------------------------------------------------|---------|-------------|---------------|
| POST   | Add a new user            | (String email), (String password), (String address), (String name) | None    | None        | False         |
| GET    | Get user information      | None                                                               | token   | email       | True          |
| PUT    | Modify user information   | (String email), (String address), (String name)                    | token   | None        | True          |
| DELETE | Delete user from database | (String email)                                                     | token   | None        | True          |


### Token API


| /token | Description                                 | Payload                           | Headers | Querystring | Authorization |
|-------:|---------------------------------------------|-----------------------------------|---------|-------------|---------------|
| POST   | Verify auth credentials and get a new token | (String email), (String password) | None    | None        | False         |
| GET    | Get the current token information.          | None                              | token   | id          | True          |
| PUT    | Update current token expiry date            | (String id), (Boolean extend)     | token   | None        | True          |
| DELETE | Delete token from the database              | None                              | token   | id          | True          |


### Menu API

|  /menu | Description                            | Payload                                                     | Headers | Querystring | Authorization      |
|-------:|----------------------------------------|-------------------------------------------------------------|---------|-------------|--------------------|
| GET    | Gets all the menu items and the prices | None                                                        | token   | None        | :white_check_mark: |
| POST   | Add a new item to the menu             | (String name), (Integer price)                              | token   | None        | :white_check_mark: |
| PUT    | Update an item by a given `id`         | (String id), (String name), (String email), (Integer price) | token   | None        | :white_check_mark: |
| DELETE | Delete item from the menu              | None                                                        | token   | id          | :white_check_mark: |


### Order API

| /order | Description                                                                                                                                        | Payload                       | Headers | Querystring | Authorization      |
|-------:|----------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------|---------|-------------|--------------------|
| POST   | Place an order. Be careful, when you run hit this API. A transaction will be made on your bank account and an email will be sent upon confirmation | (String email), (Array items) | token   | None        | :white_check_mark: |