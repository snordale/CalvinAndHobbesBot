import { config } from 'dotenv';
import { followUsers } from '../followUsers';
config();

console.log(process.env.X_API_KEY)
console.log(process.env.X_API_SECRET)
console.log(process.env.X_ACCESS_TOKEN)
console.log(process.env.X_ACCESS_SECRET)

followUsers();