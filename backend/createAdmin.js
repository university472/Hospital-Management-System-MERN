require('dotenv').config()
const mongoose = require('mongoose')
const Admin = require('./models/Admin')

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB error:', err))

async function createAdmin() {
  const admin = new Admin({
    firstName: 'Umer',
    lastName: 'Javaid',
    email: 'admin@gmail.com',
    password: 'admin123',
    role: 'admin'
  })

  try {
    await admin.save()
    console.log('🎉 Admin created successfully')
  } catch (error) {
    console.error('❌ Error creating admin:', error.message)
  } finally {
    mongoose.connection.close()
  }
}

createAdmin()
