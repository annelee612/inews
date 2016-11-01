# inews - your local news aggregator

Legacy project for Musical Saws.

> News aggregator by location - Subscribe and get your local news on your fingertip!

## Legacy Team

- __Development Team Members__: Anne Lee, Robin Gulbrandsen, Tom Grek

## Original Team

- __Product Owner__: Aleks Basalilov
- __Scrum Master__: Fin Layanto
- __Development Team Members__: Victor Mu, David Malpica

## Table of Contents

1. [Usage](#Usage)
2. [Requirements](#requirements)
3. [Development](#development)
4. [Installing Dependencies](#installing-dependencies)
5. [Tasks](#tasks)
6. [Team](#team)
7. [Contributing](#contributing)

## Usage

> Upon visiting the site at: http://inews-staging.herokuapp.com/ signup using a unique username and password.

Signup will auto login for you, once in, you'll be able to add two locations to your preferences for location based news. The primary newsfeed will default to your local city and aggregate current events.

Signout will save your preferences automatically. When you revisit you will automatically see all your localized news feeds.

This app is great for people traveling who want quick access to location based news.

## Requirements

- Node 4.5.x
- Angular 1.5.x
- Mongo 3.x
- Express 4.x.x

## Development

- Gulp 3.9.x
- Karma 1.3.x
- Chai 3.5.x
- Mocha 3.1.x
- Browser-sync 2.17.x

### API Doc

| Type | URI | Argument(s) | Authentication | Comment |
|------|-----|-------------|---------|----------|
| POST | /login | User | Anonymous | Logs in a user |
| POST | /logout | | User | Logs out a user |
| POST | /register | User | Anonymous | Registers a new user|
| POST | /api/newsfeeds | Newsfeed | User | Creates a new feed for current user |
| GET  | /api/newsfeeds | | User, Anonymous | Returns a list of current user's feeds |
| GET  | /api/newsfeeds/:id | Newsfeed id | User | Returns a spesific newsfeed for a user |
| PUT  | /api/newsfeeds | Newsfeed | User | Updates current newsfeed |
| DELETE | /api/newsfeeds/:id | Newsfeed id | User | Deletes a users newsfeed |
| GET  | /api/weather | ?lat&lon | Anonymous | Returns current locations weather |

### Project Structure

```sh
client/
  - components/
    - addNewsfeed.jsx
    - newsfeed.jsx
    - newsfeedEntry.jsx
    - login.jsx
    - register.jsx
  - assets/
    - styles.scss
    - images/
      - logo.png
  - index.html
  - main.js
```

### Installing Dependencies

From within the root directory:

```sh
npm install
//postinstall installs bower dependencies
//automatically

```
### Roadmap

View the project roadmap [https://github.com/tomgrek/inews/issues]


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
