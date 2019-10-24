[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<br />
<p align="center">
  <a href="https://github.com/Artenes/rocketseat-bootcamp-meetapp/tree/master/backend">
    <img src="https://i.imgur.com/GiiNYKp.jpg" alt="Logo" width="90" height="80">
  </a>

  <h3 align="center">Gobarber (backend)</h3>

  <p align="center">
    Get in touch with beauty professionals and schedule services!
    <br />
  </p>
</p>

## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)

## About The Project

REST API to manage the schedule of beauty professionals so customer can schedule appointments with them. This is not a flesh out product to be used in production, it is just a demo application created during [Rocketseat's GoStack bootamp](https://rocketseat.com.br/bootcamp).

### Built With

* [Node js](https://nodejs.org)
* [Express](https://expressjs.com)
* [Sequelize](https://sequelize.org/)

## Getting Started

To get a local copy up and running follow these steps.

### Prerequisites

* Node js
* yarn
* Postgres database (you can use docker for that)
* Reddis server (you can use docker for that)
* Mongo Database (you can use docker for that)
* Mailing service (for tests check [mailtrap.io](https://mailtrap.io))
* [Sentry credentials](https://sentry.io/welcome/). We use sentry to track erros and bugs. But this is not mandatory.

### Installation

1. Clone the repo
```sh
git clone git@github.com:Artenes/rocketseat-bootcamp-gobarber-backend.git
```

2. Access the directory
```sh
cd rocketseat-bootcamp-gobarber-backend
```

3. Install dependencies
```sh
yarn
```

4. Create a copy of the .env.example file
```sh
cp .env.example .env
```

5. Configure the .env file (just follow the comments on it)

6. Run the migrations to create the tables. Make sure the database you set in .env exists
```sh
yarn sequelize db:migrate
```

7. Run the queue server, this will handle mails delivery
```sh
yarn queue
```

8. Run the server
```sh
yarn dev
```

## Usage

There are protected and unprotected routes. To access a protected route, you need a `JWT` token in the header of the requeast as such:

```sh
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY3OTUwMTM2LCJleHAiOjE1Njg1NTQ5MzZ9.JPHK7jwgSgvdVABon2HxtJT6ddofu6EWW53az6qF-0M
```
For that you have to create a user in the `POST /users` endpoint, then create a session in `POST /sessions` endpoint. See endpoints descriptions below for more details.

### Users

A user that can schedule for services or provide services.

#### POST /users

Creates a new user.

Body
```json
{
  "name": "Jhon",
  "email": "jhon@doe.com",
  "password": "123456"
}
```

#### PUT /users [protected]

Edits the current logged in user.

Body
```json
{
  "name": "New Jhon",
  "email": "newjhon@doe.com",
  "oldPassword": "123456",
  "password": "1234567",
  "confirmPassword": "1234567"
}
```

### Sessions

A session to access protected routes in the API.

#### POST /sessions

Creates a new `JWT` token for a user.

Body
```json
{
  "email": "jhon@doe.com",
  "password": "123456"
}
```

### Files

An image used by another resource. Files must be uploaded separately from the requests that need them.

#### POST /files

Uploads a new file.

Body - Multipart Form
```json
file: file/path
```

### Providers

A user that provide services.

#### GET /providers [protected]

Lists all providers in the application.

#### GET /providers/:id/available?date=1571957701 [protected]

Lists all hours available for a provider in the given date (unix timestamp).

### Appointments

Appointments created by customers.

#### GET /appointments [protected]

Gets all appointments of the logged user.

#### POST /appointments [protected]

Creates a new appointment.

Body
```json
{
  "provider_id": 12,
  "date": "2019-10-24T09:00:00-04:00",
}
```

### Notifications

Manage a provider's notifications list.

#### GET /notifications [protected]

Gets all notifications for the logged user.

#### PUT /notifications/:id [protected]

Mark as notification as read.

## Contributing

Contributions are welcome, even though this was made only for learning purposes.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Artenes Nogueira - [artenes.nogueira@gmail.com](mailto:artenes.nogueira@gmail.com)

My blog: [http://artenesbok.com/](http://artenesbok.com/)

My Linkedin: [https://www.linkedin.com/in/artenes/](https://www.linkedin.com/in/artenes/)

README template from: [https://github.com/othneildrew/Best-README-Template](https://github.com/othneildrew/Best-README-Template)

[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=flat-square
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=flat-square
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/artenes/
