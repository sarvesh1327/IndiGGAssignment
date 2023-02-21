# Tournament assignment API service

1. Create a `.env` file in the root directory with variables mentioned below.

```
NODE_ENV=development
PORT=4003
MONGODB_URI=mongodb://root:password@localhost:27017/tournament_local?authSource=admin
```
2. Run `export $(xargs <.env)` in your terminal. This will export all the environment variables in `.env` to your current shell session.
3. To start the development server run this command `npm run dev`

`Models` have all the MongoDB models and schemas
`Services` have all the MongoDB calls done through models
`Routes` have all the API routes logic
`Utils` have some utility functions and variables
`Livecopy` have all the blockchain methods which intreact with contracts
