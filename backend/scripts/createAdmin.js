/**
 * scripts/createAdmin.js
 * Run once to seed the first admin account.
 *
 * Usage:
 *   node scripts/createAdmin.js
 *
 * Reads MONGO_URI from .env in the project root.
 */

require('dotenv').config({
  path: require('path').join(__dirname, '..', '.env')
})
const mongoose = require('mongoose')
const Admin = require('../models/Admin')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
const ask = (q) => new Promise((r) => rl.question(q, r))

async function main() {
  if (!process.env.MONGO_URI) {
    console.error('❌  MONGO_URI not set in .env')
    process.exit(1)
  }

  await mongoose.connect(process.env.MONGO_URI)
  console.log('✅  Connected to MongoDB\n')

  const existing = await Admin.countDocuments()
  if (existing > 0) {
    const ans = await ask(
      `⚠️  ${existing} admin(s) already exist. Create another? (y/N): `
    )
    if (ans.trim().toLowerCase() !== 'y') {
      console.log('Aborted.')
      rl.close()
      await mongoose.connection.close()
      return
    }
  }

  const firstName = await ask('First name : ')
  const lastName = await ask('Last name  : ')
  const email = await ask('Email      : ')
  const password = await ask('Password   : ')

  if (!firstName || !lastName || !email || !password) {
    console.error('❌  All fields are required.')
    rl.close()
    await mongoose.connection.close()
    return
  }
  if (password.length < 8) {
    console.error('❌  Password must be at least 8 characters.')
    rl.close()
    await mongoose.connection.close()
    return
  }

  try {
    const admin = new Admin({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password
    })
    await admin.save()
    console.log('\n🎉  Admin created successfully!')
    console.log(`    Name  : ${admin.firstName} ${admin.lastName}`)
    console.log(`    Email : ${admin.email}`)
  } catch (err) {
    if (err.code === 11000) console.error('❌  Email already in use.')
    else console.error('❌  Error:', err.message)
  }

  rl.close()
  await mongoose.connection.close()
}

main()
