# PizzaDelivery

Homework Assignment #2-3 API Service for Pizza Deliveries

### User Interface Testing Homework #3

GIF:

![pizza-order](https://user-images.githubusercontent.com/18662248/49285642-ac739200-f4a0-11e8-9b18-16c8ace58f71.gif)

Images:

<img width="557" alt="screen shot 2018-11-30 at 1 03 10 pm" src="https://user-images.githubusercontent.com/18662248/49285650-b09faf80-f4a0-11e8-865b-ebaf9b49096a.png">

<img width="1003" alt="screen shot 2018-11-30 at 1 02 06 pm" src="https://user-images.githubusercontent.com/18662248/49285649-b09faf80-f4a0-11e8-8ff6-e6af6bfba886.png">


### CLI Application Homework #4

This is a Command Line application that would helps you read the data via shell tool you're running the app on
To view all the allowed commands

Run the application by `node index.js` in the root directory. Then run enter `help` or `man`
to view the CLI Manual. From there, you can kick off to use any of the given features allowed.


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
| POST   | Add a new user            | (String email), (String password), (String address), (String name) | None    | None        | :x:         |
| GET    | Get user information      | None                                                               | token   | email       | :white_check_mark:          |
| PUT    | Modify user information   | (String email), (String address), (String name)                    | token   | None        | :white_check_mark:          |
| DELETE | Delete user from database | (String email)                                                     | token   | None        | :white_check_mark:          |


### Token API


| /token | Description                                 | Payload                           | Headers | Querystring | Authorization |
|-------:|---------------------------------------------|-----------------------------------|---------|-------------|---------------|
| POST   | Verify auth credentials and get a new token | (String email), (String password) | None    | None        | :x:         |
| GET    | Get the current token information.          | None                              | token   | id          | :white_check_mark:          |
| PUT    | Update current token expiry date            | (String id), (Boolean extend)     | token   | None        | :white_check_mark:          |
| DELETE | Delete token from the database              | None                              | token   | id          | :white_check_mark:          |


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
