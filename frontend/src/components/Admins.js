// // import React, { useState, useEffect } from 'react'
// // import {
// //   Calendar,
// //   Clock,
// //   FileText,
// //   User,
// //   Users,
// //   ChevronDown,
// //   Home,
// //   UserCircle,
// //   Calendar as CalendarIcon,
// //   Eye,
// //   EyeOff,
// //   Hospital,
// //   Stethoscope,
// //   Activity,
// //   DollarSign,
// //   UserPlus,
// //   ShieldCheck
// // } from 'lucide-react'
// // import { useNavigate } from 'react-router-dom'

// // const Button = ({
// //   children,
// //   variant = 'primary',
// //   className = '',
// //   ...props
// // }) => (
// //   <button
// //     className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
// //       variant === 'primary'
// //         ? 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
// //         : variant === 'outline'
// //         ? 'text-blue-600 border-blue-600 hover:bg-blue-50 focus:ring-blue-500'
// //         : 'text-blue-600 border-blue-600 hover:bg-blue-50 focus:ring-blue-500'
// //     } ${className}`}
// //     {...props}
// //   >
// //     {children}
// //   </button>
// // )

// // const Card = ({ children, className = '' }) => (
// //   <div className={`bg-white rounded-lg shadow-md ${className}`}>{children}</div>
// // )

// // const CardHeader = ({ children, icon: Icon }) => (
// //   <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex items-center justify-between">
// //     {children}
// //     {Icon && <Icon className="h-5 w-5 text-blue-600 ml-2" />}
// //   </div>
// // )

// // const CardTitle = ({ children }) => (
// //   <h3 className="text-lg leading-6 font-medium text-gray-900">{children}</h3>
// // )

// // const CardContent = ({ children }) => (
// //   <div className="px-4 py-5 sm:p-6">{children}</div>
// // )

// // const CardFooter = ({ children }) => (
// //   <div className="px-4 py-4 sm:px-6">{children}</div>
// // )

// // const Input = ({ ...props }) => (
// //   <input
// //     className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-1 h-6"
// //     {...props}
// //   />
// // )

// // const Label = ({ children, htmlFor }) => (
// //   <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
// //     {children}
// //   </label>
// // )

// // const Select = ({ children, ...props }) => (
// //   <select
// //     className="mt-1 block w-full pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
// //     {...props}
// //   >
// //     {children}
// //   </select>
// // )

// // export default function AdminDashboard() {
// //   const [showDoctors, setShowDoctors] = useState(true)
// //   const [showPatients, setShowPatients] = useState(false)
// //   const [activeTab, setActiveTab] = useState('Dashboard')
// //   const [isEditing, setIsEditing] = useState(false)
// //   const [adminInfo, setAdminInfo] = useState(null)
// //   const [editedInfo, setEditedInfo] = useState(null)
// //   const [doctorData, setDoctorData] = useState({
// //     firstName: '',
// //     lastName: '',
// //     email: '',
// //     specialty: '',
// //     licenseNumber: '',
// //     phoneNumber: '',
// //     password: ''
// //   })
// //   const [adminData, setAdminData] = useState({
// //     firstName: '',
// //     lastName: '',
// //     email: '',
// //     password: '',
// //     confirmPassword: ''
// //   })
// //   const [showDoctorPassword, setShowDoctorPassword] = useState(false)
// //   const [showAdminPassword, setShowAdminPassword] = useState(false)
// //   const [totalDoctors, setTotalDoctors] = useState(0)
// //   const [totalPatients, setTotalPatients] = useState(0)
// //   const [doctorOverview, setDoctorOverview] = useState([])
// //   const [patientOverview, setPatientOverview] = useState([])
// //   const [hospitalCapacity] = useState(10000)
// //   const navigate = useNavigate()

// //   useEffect(() => {
// //     fetchAdminProfile()
// //     fetchTotalDoctors()
// //     fetchTotalPatients()
// //     fetchDoctorOverview()
// //     fetchPatientOverview()
// //   }, [])

// //   const fetchAdminProfile = async () => {
// //     try {
// //       const token = localStorage.getItem('token')
// //       if (!token) {
// //         // Handle not authenticated case
// //         return
// //       }
// //       const response = await fetch('http://localhost:5000/api/admin/profile', {
// //         headers: {
// //           Authorization: `Bearer ${token}`
// //         }
// //       })
// //       if (response.ok) {
// //         const data = await response.json()
// //         setAdminInfo(data)
// //         setEditedInfo(data)
// //       } else {
// //         // Handle error
// //         console.error('Failed to fetch admin profile')
// //       }
// //     } catch (error) {
// //       console.error('Error fetching admin profile:', error)
// //     }
// //   }

// //   const fetchTotalDoctors = async () => {
// //     try {
// //       const token = localStorage.getItem('token')
// //       if (!token) {
// //         return
// //       }
// //       const response = await fetch(
// //         'http://localhost:5000/api/admin/total-doctors',
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`
// //           }
// //         }
// //       )
// //       if (response.ok) {
// //         const data = await response.json()
// //         setTotalDoctors(data.totalDoctors)
// //       } else {
// //         console.error('Failed to fetch total doctors')
// //       }
// //     } catch (error) {
// //       console.error('Error fetching total doctors:', error)
// //     }
// //   }

// //   const fetchTotalPatients = async () => {
// //     try {
// //       const token = localStorage.getItem('token')
// //       if (!token) {
// //         return
// //       }
// //       const response = await fetch(
// //         'http://localhost:5000/api/admin/total-patients',
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`
// //           }
// //         }
// //       )
// //       if (response.ok) {
// //         const data = await response.json()
// //         setTotalPatients(data.totalPatients)
// //       } else {
// //         console.error('Failed to fetch total patients')
// //       }
// //     } catch (error) {
// //       console.error('Error fetching total patients:', error)
// //     }
// //   }

// //   const fetchDoctorOverview = async () => {
// //     try {
// //       const token = localStorage.getItem('token')
// //       if (!token) {
// //         return
// //       }
// //       const response = await fetch(
// //         'http://localhost:5000/api/admin/doctor-overview',
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`
// //           }
// //         }
// //       )
// //       if (response.ok) {
// //         const data = await response.json()
// //         setDoctorOverview(data)
// //       } else {
// //         console.error('Failed to fetch doctor overview')
// //       }
// //     } catch (error) {
// //       console.error('Error fetching doctor overview:', error)
// //     }
// //   }

// //   const fetchPatientOverview = async () => {
// //     try {
// //       const token = localStorage.getItem('token')
// //       if (!token) {
// //         return
// //       }
// //       const response = await fetch(
// //         'http://localhost:5000/api/admin/patient-overview',
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`
// //           }
// //         }
// //       )
// //       if (response.ok) {
// //         const data = await response.json()
// //         setPatientOverview(data)
// //       } else {
// //         console.error('Failed to fetch patient overview')
// //       }
// //     } catch (error) {
// //       console.error('Error fetching patient overview:', error)
// //     }
// //   }

// //   const renderDashboard = () => {
// //     const occupancyRate = ((totalPatients / hospitalCapacity) * 100).toFixed(2)
// //     return (
// //       <>
// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //           <Card>
// //             <CardHeader icon={Stethoscope}>
// //               <CardTitle className="text-sm font-medium">
// //                 Total Doctors
// //               </CardTitle>
// //             </CardHeader>
// //             <CardContent>
// //               <div className="text-2xl font-bold">{totalDoctors}</div>
// //               <p className="text-xs text-gray-500">Active medical staff</p>
// //             </CardContent>
// //           </Card>
// //           <Card>
// //             <CardHeader icon={Users}>
// //               <CardTitle className="text-sm font-medium">
// //                 Total Patients
// //               </CardTitle>
// //             </CardHeader>
// //             <CardContent>
// //               <div className="text-2xl font-bold">{totalPatients}</div>
// //               <p className="text-xs text-gray-500">Currently admitted</p>
// //             </CardContent>
// //           </Card>
// //           <Card>
// //             <CardHeader icon={Activity}>
// //               <CardTitle className="text-sm font-medium">
// //                 Hospital Occupancy
// //               </CardTitle>
// //             </CardHeader>
// //             <CardContent>
// //               <div className="text-2xl font-bold">{occupancyRate}%</div>
// //               <p className="text-xs text-gray-500">Bed occupancy rate</p>
// //             </CardContent>
// //           </Card>
// //         </div>
// //         <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
// //           <Card>
// //             <CardHeader icon={Stethoscope}>
// //               <CardTitle className="text-sm font-medium">
// //                 Doctor Overview
// //               </CardTitle>
// //             </CardHeader>
// //             <CardContent>
// //               <div className="text-2xl font-bold">{doctorOverview.length}</div>
// //               <p className="text-xs text-gray-500">Total doctors on staff</p>
// //             </CardContent>
// //             <CardFooter className="p-2">
// //               <Button
// //                 variant="ghost"
// //                 className="w-full text-sm text-gray-500 hover:text-gray-900 transition-colors"
// //                 onClick={() => setShowDoctors(!showDoctors)}
// //               >
// //                 {showDoctors ? 'Hide' : 'View All'} Doctors
// //                 <ChevronDown
// //                   className={`h-4 w-4 ml-2 transition-transform ${
// //                     showDoctors ? 'rotate-180' : ''
// //                   }`}
// //                 />
// //               </Button>
// //             </CardFooter>
// //             {showDoctors && (
// //               <div className="px-4 pb-4">
// //                 {doctorOverview.map((doctor, index) => (
// //                   <div
// //                     key={index}
// //                     className="flex justify-between items-center py-2 border-t"
// //                   >
// //                     <div>
// //                       <p className="text-sm font-medium">{doctor.name}</p>
// //                       <p className="text-xs text-gray-500">
// //                         {doctor.specialty}
// //                       </p>
// //                     </div>
// //                     <p className="text-sm">{doctor.patients} patients</p>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </Card>
// //           <Card>
// //             <CardHeader icon={Users}>
// //               <CardTitle className="text-sm font-medium">
// //                 Patient Overview
// //               </CardTitle>
// //             </CardHeader>
// //             <CardContent>
// //               <div className="text-2xl font-bold">{patientOverview.length}</div>
// //               <p className="text-xs text-gray-500">Total admitted patients</p>
// //             </CardContent>
// //             <CardFooter className="p-2">
// //               <Button
// //                 variant="ghost"
// //                 className="w-full text-sm text-gray-500 hover:text-gray-900 transition-colors"
// //                 onClick={() => setShowPatients(!showPatients)}
// //               >
// //                 {showPatients ? 'Hide' : 'View All'} Patients
// //                 <ChevronDown
// //                   className={`h-4 w-4 ml-2 transition-transform ${
// //                     showPatients ? 'rotate-180' : ''
// //                   }`}
// //                 />
// //               </Button>
// //             </CardFooter>
// //             {showPatients && (
// //               <div className="px-4 pb-4">
// //                 {patientOverview.map((patient, index) => (
// //                   <div key={index} className="py-2 border-t">
// //                     <p className="text-sm font-medium">{patient.name}</p>
// //                     <p className="text-xs text-gray-500">
// //                       Total Appointments: {patient.appointments}
// //                     </p>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </Card>
// //         </div>
// //         <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
// //           <Card>
// //             <CardHeader>
// //               <CardTitle>Recent Activity</CardTitle>
// //             </CardHeader>
// //             <CardContent>
// //               <ul className="space-y-2">
// //                 <li className="flex items-center space-x-2">
// //                   <UserPlus className="h-4 w-4 text-blue-600" />
// //                   <span>New doctor onboarded: Dr. Emily Taylor</span>
// //                 </li>
// //                 <li className="flex items-center space-x-2">
// //                   <Activity className="h-4 w-4 text-blue-600" />
// //                   <span>Emergency ward capacity increased by 10 beds</span>
// //                 </li>
// //                 <li className="flex items-center space-x-2">
// //                   <DollarSign className="h-4 w-4 text-blue-600" />
// //                   <span>Monthly budget report generated</span>
// //                 </li>
// //               </ul>
// //             </CardContent>
// //           </Card>
// //           <Card>
// //             <CardHeader>
// //               <CardTitle>Upcoming Tasks</CardTitle>
// //             </CardHeader>
// //             <CardContent>
// //               <ul className="space-y-2">
// //                 <li className="flex items-center space-x-2">
// //                   <Calendar className="h-4 w-4 text-blue-600" />
// //                   <span>Staff performance review - Next week</span>
// //                 </li>
// //                 <li className="flex items-center space-x-2">
// //                   <FileText className="h-4 w-4 text-blue-600" />
// //                   <span>Update hospital policies - Due in 3 days</span>
// //                 </li>
// //                 <li className="flex items-center space-x-2">
// //                   <Users className="h-4 w-4 text-blue-600" />
// //                   <span>Department heads meeting - Tomorrow, 10:00 AM</span>
// //                 </li>
// //               </ul>
// //             </CardContent>
// //           </Card>
// //         </div>
// //       </>
// //     )
// //   }

// //   const renderProfile = () => {
// //     if (!adminInfo) {
// //       return <div>Loading profile...</div>
// //     }

// //     const handleInputChange = (e) => {
// //       const { name, value } = e.target
// //       setEditedInfo((prev) => ({ ...prev, [name]: value }))
// //     }

// //     const handleSave = async () => {
// //       try {
// //         const token = localStorage.getItem('token')
// //         if (!token) {
// //           navigate('/login')
// //           return
// //         }
// //         const response = await fetch(
// //           'http://localhost:5000/api/admin/profile',
// //           {
// //             method: 'PUT',
// //             headers: {
// //               'Content-Type': 'application/json',
// //               Authorization: `Bearer ${token}`
// //             },
// //             body: JSON.stringify({
// //               firstName: editedInfo.firstName,
// //               lastName: editedInfo.lastName,
// //               email: editedInfo.email
// //             })
// //           }
// //         )
// //         if (response.ok) {
// //           const updatedAdmin = await response.json()
// //           setAdminInfo(updatedAdmin.admin)
// //           setIsEditing(false)
// //         } else {
// //           const errorData = await response.json()
// //           alert(`Error: ${errorData.error}`)
// //         }
// //       } catch (error) {
// //         alert('An error occurred. Please try again.')
// //       }
// //     }

// //     return (
// //       <Card className="w-full max-w-2xl mx-auto">
// //         <CardHeader>
// //           <CardTitle>Admin Profile</CardTitle>
// //         </CardHeader>
// //         <CardContent>
// //           <form className="space-y-4">
// //             <div className="grid grid-cols-2 gap-4">
// //               <div className="space-y-2">
// //                 <Label htmlFor="firstName">First Name</Label>
// //                 <Input
// //                   id="firstName"
// //                   name="firstName"
// //                   value={isEditing ? editedInfo.firstName : adminInfo.firstName}
// //                   onChange={handleInputChange}
// //                   readOnly={!isEditing}
// //                 />
// //               </div>
// //               <div className="space-y-2">
// //                 <Label htmlFor="lastName">Last Name</Label>
// //                 <Input
// //                   id="lastName"
// //                   name="lastName"
// //                   value={isEditing ? editedInfo.lastName : adminInfo.lastName}
// //                   onChange={handleInputChange}
// //                   readOnly={!isEditing}
// //                 />
// //               </div>
// //             </div>
// //             <div className="space-y-2">
// //               <Label htmlFor="email">Email</Label>
// //               <Input
// //                 id="email"
// //                 name="email"
// //                 type="email"
// //                 value={isEditing ? editedInfo.email : adminInfo.email}
// //                 onChange={handleInputChange}
// //                 readOnly={!isEditing}
// //               />
// //             </div>
// //           </form>
// //         </CardContent>
// //         <CardFooter>
// //           {isEditing ? (
// //             <>
// //               <Button onClick={handleSave} className="mr-2">
// //                 Save
// //               </Button>
// //               <Button onClick={() => setIsEditing(false)} variant="outline">
// //                 Cancel
// //               </Button>
// //             </>
// //           ) : (
// //             <Button onClick={() => setIsEditing(true)} className="ml-auto">
// //               Edit Profile
// //             </Button>
// //           )}
// //         </CardFooter>
// //       </Card>
// //     )
// //   }

// //   const renderAddDoctor = () => {
// //     const handleInputChange = (e) => {
// //       const { name, value } = e.target
// //       setDoctorData((prev) => ({ ...prev, [name]: value }))
// //     }

// //     const handleSubmit = async (e) => {
// //       e.preventDefault()
// //       try {
// //         const token = localStorage.getItem('token')
// //         if (!token) {
// //           alert('You are not authenticated. Please log in.')
// //           return
// //         }
// //         const response = await fetch(
// //           'http://localhost:5000/api/admin/add-doctor',
// //           {
// //             method: 'POST',
// //             headers: {
// //               'Content-Type': 'application/json',
// //               Authorization: `Bearer ${token}`
// //             },
// //             body: JSON.stringify(doctorData)
// //           }
// //         )
// //         if (response.ok) {
// //           alert('Doctor added successfully')
// //           setDoctorData({
// //             firstName: '',
// //             lastName: '',
// //             email: '',
// //             specialty: '',
// //             licenseNumber: '',
// //             phoneNumber: '',
// //             password: ''
// //           })
// //         } else if (response.status === 401) {
// //           alert('Your session has expired. Please log in again.')
// //           // Redirect to login page or handle re-authentication
// //         } else {
// //           const errorData = await response.json()
// //           alert(`Error: ${errorData.error}`)
// //         }
// //       } catch (error) {
// //         alert('An error occurred. Please try again.')
// //       }
// //     }

// //     return (
// //       <Card className="w-full max-w-2xl mx-auto">
// //         <CardHeader>
// //           <CardTitle>Add New Doctor</CardTitle>
// //         </CardHeader>
// //         <CardContent>
// //           <form onSubmit={handleSubmit} className="space-y-4">
// //             <div className="grid grid-cols-2 gap-4">
// //               <div className="space-y-2">
// //                 <Label htmlFor="firstName">First Name</Label>
// //                 <Input
// //                   id="firstName"
// //                   name="firstName"
// //                   value={doctorData.firstName}
// //                   onChange={handleInputChange}
// //                   required
// //                 />
// //               </div>
// //               <div className="space-y-2">
// //                 <Label htmlFor="lastName">Last Name</Label>
// //                 <Input
// //                   id="lastName"
// //                   name="lastName"
// //                   value={doctorData.lastName}
// //                   onChange={handleInputChange}
// //                   required
// //                 />
// //               </div>
// //             </div>
// //             <div className="space-y-2">
// //               <Label htmlFor="email">Email</Label>
// //               <Input
// //                 id="email"
// //                 name="email"
// //                 type="email"
// //                 value={doctorData.email}
// //                 onChange={handleInputChange}
// //                 required
// //               />
// //             </div>
// //             <div className="space-y-2">
// //               <Label htmlFor="specialty">Specialty</Label>
// //               <Select
// //                 id="specialty"
// //                 name="specialty"
// //                 value={doctorData.specialty}
// //                 onChange={handleInputChange}
// //                 required
// //               >
// //                 <option value="">Choose a specialty</option>
// //                 <option value="cardiology">Cardiology</option>
// //                 <option value="neurology">Neurology</option>
// //                 <option value="pediatrics">Pediatrics</option>
// //                 <option value="oncology">Oncology</option>
// //                 <option value="orthopedics">Orthopedics</option>
// //               </Select>
// //             </div>
// //             <div className="space-y-2">
// //               <Label htmlFor="licenseNumber">License Number</Label>
// //               <Input
// //                 id="licenseNumber"
// //                 name="licenseNumber"
// //                 value={doctorData.licenseNumber}
// //                 onChange={handleInputChange}
// //                 required
// //               />
// //             </div>
// //             <div className="space-y-2">
// //               <Label htmlFor="phoneNumber">Phone Number</Label>
// //               <Input
// //                 id="phoneNumber"
// //                 name="phoneNumber"
// //                 type="tel"
// //                 value={doctorData.phoneNumber}
// //                 onChange={handleInputChange}
// //                 required
// //               />
// //             </div>
// //             <div className="space-y-2">
// //               <Label htmlFor="password">Password</Label>
// //               <div className="relative">
// //                 <Input
// //                   id="password"
// //                   name="password"
// //                   type={showDoctorPassword ? 'text' : 'password'}
// //                   value={doctorData.password}
// //                   onChange={handleInputChange}
// //                   required
// //                 />
// //                 <Button
// //                   type="button"
// //                   variant="ghost"
// //                   className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
// //                   onClick={() => setShowDoctorPassword(!showDoctorPassword)}
// //                 >
// //                   {showDoctorPassword ? (
// //                     <EyeOff className="h-4 w-4 text-gray-500" />
// //                   ) : (
// //                     <Eye className="h-4 w-4 text-gray-500" />
// //                   )}
// //                   <span className="sr-only">
// //                     {showDoctorPassword ? 'Hide password' : 'Show password'}
// //                   </span>
// //                 </Button>
// //               </div>
// //             </div>
// //             <Button type="submit" className="ml-auto">
// //               Add Doctor
// //             </Button>
// //           </form>
// //         </CardContent>
// //       </Card>
// //     )
// //   }

// //   const renderAddAdmin = () => {
// //     const handleInputChange = (e) => {
// //       const { name, value } = e.target
// //       setAdminData((prev) => ({ ...prev, [name]: value }))
// //     }

// //     const handleSubmit = async (e) => {
// //       e.preventDefault()
// //       if (adminData.password !== adminData.confirmPassword) {
// //         alert("Passwords don't match")
// //         return
// //       }
// //       try {
// //         const token = localStorage.getItem('token')
// //         if (!token) {
// //           alert('You are not authenticated. Please log in.')
// //           return
// //         }
// //         const response = await fetch(
// //           'http://localhost:5000/api/admin/add-admin',
// //           {
// //             method: 'POST',
// //             headers: {
// //               'Content-Type': 'application/json',
// //               Authorization: `Bearer ${token}`
// //             },
// //             body: JSON.stringify(adminData)
// //           }
// //         )
// //         if (response.ok) {
// //           alert('Admin added successfully')
// //           setAdminData({
// //             firstName: '',
// //             lastName: '',
// //             email: '',
// //             password: '',
// //             confirmPassword: ''
// //           })
// //         } else if (response.status === 401) {
// //           alert('Your session has expired. Please log in again.')
// //           // Redirect to login page or handle re-authentication
// //         } else {
// //           const errorData = await response.json()
// //           alert(`Error: ${errorData.error}`)
// //         }
// //       } catch (error) {
// //         alert('An error occurred. Please try again.')
// //       }
// //     }

// //     return (
// //       <Card className="w-full max-w-2xl mx-auto">
// //         <CardHeader>
// //           <CardTitle>Add New Admin</CardTitle>
// //         </CardHeader>
// //         <CardContent>
// //           <form onSubmit={handleSubmit} className="space-y-4">
// //             <div className="grid grid-cols-2 gap-4">
// //               <div className="space-y-2">
// //                 <Label htmlFor="firstName">First Name</Label>
// //                 <Input
// //                   id="firstName"
// //                   name="firstName"
// //                   value={adminData.firstName}
// //                   onChange={handleInputChange}
// //                   required
// //                 />
// //               </div>
// //               <div className="space-y-2">
// //                 <Label htmlFor="lastName">Last Name</Label>
// //                 <Input
// //                   id="lastName"
// //                   name="lastName"
// //                   value={adminData.lastName}
// //                   onChange={handleInputChange}
// //                   required
// //                 />
// //               </div>
// //             </div>
// //             <div className="space-y-2">
// //               <Label htmlFor="email">Email</Label>
// //               <Input
// //                 id="email"
// //                 name="email"
// //                 type="email"
// //                 value={adminData.email}
// //                 onChange={handleInputChange}
// //                 required
// //               />
// //             </div>
// //             <div className="space-y-2">
// //               <Label htmlFor="password">Password</Label>
// //               <div className="relative">
// //                 <Input
// //                   id="password"
// //                   name="password"
// //                   type={showAdminPassword ? 'text' : 'password'}
// //                   value={adminData.password}
// //                   onChange={handleInputChange}
// //                   required
// //                 />
// //                 <Button
// //                   type="button"
// //                   variant="ghost"
// //                   className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
// //                   onClick={() => setShowAdminPassword(!showAdminPassword)}
// //                 >
// //                   {showAdminPassword ? (
// //                     <EyeOff className="h-4 w-4 text-gray-500" />
// //                   ) : (
// //                     <Eye className="h-4 w-4 text-gray-500" />
// //                   )}
// //                   <span className="sr-only">
// //                     {showAdminPassword ? 'Hide password' : 'Show password'}
// //                   </span>
// //                 </Button>
// //               </div>
// //             </div>
// //             <div className="space-y-2">
// //               <Label htmlFor="confirmPassword">Confirm Password</Label>
// //               <div className="relative">
// //                 <Input
// //                   id="confirmPassword"
// //                   name="confirmPassword"
// //                   type={showAdminPassword ? 'text' : 'password'}
// //                   value={adminData.confirmPassword}
// //                   onChange={handleInputChange}
// //                   required
// //                 />
// //               </div>
// //             </div>
// //             <Button type="submit" className="ml-auto">
// //               Add Admin
// //             </Button>
// //           </form>
// //         </CardContent>
// //       </Card>
// //     )
// //   }

// //   return (
// //     <div className="min-h-screen bg-blue-600">
// //       <header className="bg-white p-4 flex justify-between items-center">
// //         <div className="flex items-center space-x-2">
// //           <Hospital className="h-6 w-6 text-blue-600" />
// //           <span className="font-bold text-xl">Hospital Management System</span>
// //         </div>
// //         <Button variant="outline" onClick={() => navigate('/')}>
// //           Sign Out
// //         </Button>
// //       </header>
// //       <nav className="bg-blue-700 text-white p-4">
// //         <ul className="flex space-x-4 justify-center">
// //           <li>
// //             <Button
// //               variant={activeTab === 'Dashboard' ? 'outline' : 'ghost'}
// //               className={`hover:bg-white hover:text-blue-600 ${
// //                 activeTab === 'Dashboard'
// //                   ? 'bg-white text-blue-600'
// //                   : 'text-white'
// //               }`}
// //               onClick={() => setActiveTab('Dashboard')}
// //             >
// //               <Home className="w-4 h-4 mr-2" />
// //               Dashboard
// //             </Button>
// //           </li>
// //           <li>
// //             <Button
// //               variant={activeTab === 'Profile' ? 'outline' : 'ghost'}
// //               className={`hover:bg-white hover:text-blue-600 ${
// //                 activeTab === 'Profile'
// //                   ? 'bg-white text-blue-600'
// //                   : 'text-white'
// //               }`}
// //               onClick={() => setActiveTab('Profile')}
// //             >
// //               <UserCircle className="w-4 h-4 mr-2" />
// //               Profile
// //             </Button>
// //           </li>
// //           <li>
// //             <Button
// //               variant={activeTab === 'Add Doctor' ? 'outline' : 'ghost'}
// //               className={`hover:bg-white hover:text-blue-600 ${
// //                 activeTab === 'Add Doctor'
// //                   ? 'bg-white text-blue-600'
// //                   : 'text-white'
// //               }`}
// //               onClick={() => setActiveTab('Add Doctor')}
// //             >
// //               <UserPlus className="w-4 h-4 mr-2" />
// //               Add Doctor
// //             </Button>
// //           </li>
// //           <li>
// //             <Button
// //               variant={activeTab === 'Add Admin' ? 'outline' : 'ghost'}
// //               className={`hover:bg-white hover:text-blue-600 ${
// //                 activeTab === 'Add Admin'
// //                   ? 'bg-white text-blue-600'
// //                   : 'text-white'
// //               }`}
// //               onClick={() => setActiveTab('Add Admin')}
// //             >
// //               <ShieldCheck className="w-4 h-4 mr-2" />
// //               Add Admin
// //             </Button>
// //           </li>
// //         </ul>
// //       </nav>
// //       <main className="container mx-auto px-4 py-8">
// //         <h1 className="text-4xl font-bold text-white mb-8">
// //           Welcome,{' '}
// //           {adminInfo ? `${adminInfo.firstName} ${adminInfo.lastName}` : 'Admin'}
// //         </h1>
// //         {activeTab === 'Dashboard' && renderDashboard()}
// //         {activeTab === 'Profile' && renderProfile()}
// //         {activeTab === 'Add Doctor' && renderAddDoctor()}
// //         {activeTab === 'Add Admin' && renderAddAdmin()}
// //       </main>
// //     </div>
// //   )
// // }

// import React, { useState, useEffect, useCallback } from 'react'
// import {
//   Hospital,
//   Home,
//   UserCircle,
//   UserPlus,
//   ShieldCheck,
//   Stethoscope,
//   Users,
//   Activity,
//   ChevronDown,
//   Eye,
//   EyeOff,
//   AlertCircle,
//   Settings,
//   BarChart2,
//   ExternalLink
// } from 'lucide-react'
// import { useNavigate } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'
// import api from '../utils/api'

// // ── UI primitives ─────────────────────────────────────────────────────────────
// const Btn = ({
//   children,
//   variant = 'primary',
//   className = '',
//   disabled,
//   ...props
// }) => (
//   <button
//     disabled={disabled}
//     className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm
//       transition-colors focus:outline-none disabled:opacity-50
//       ${
//         variant === 'primary'
//           ? 'text-white bg-blue-600 hover:bg-blue-700'
//           : variant === 'danger'
//             ? 'text-white bg-red-600 hover:bg-red-700'
//             : 'text-blue-600 border border-blue-600 hover:bg-blue-50'
//       } ${className}`}
//     {...props}
//   >
//     {children}
//   </button>
// )
// const Card = ({ children, className = '' }) => (
//   <div className={`bg-white rounded-lg shadow-md ${className}`}>{children}</div>
// )
// const CardH = ({ children, icon: Icon }) => (
//   <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex items-center justify-between">
//     {children}
//     {Icon && <Icon className="h-5 w-5 text-blue-600 ml-2" />}
//   </div>
// )
// const CT = ({ children }) => (
//   <h3 className="text-lg leading-6 font-medium text-gray-900">{children}</h3>
// )
// const CC = ({ children }) => <div className="px-4 py-5 sm:p-6">{children}</div>
// const CF = ({ children }) => <div className="px-4 py-4 sm:px-6">{children}</div>
// const Inp = (props) => (
//   <input
//     className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md px-3 py-2"
//     {...props}
//   />
// )
// const Lbl = ({ children, htmlFor }) => (
//   <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
//     {children}
//   </label>
// )
// const Sel = ({ children, ...props }) => (
//   <select
//     className="mt-1 block w-full pr-10 py-2 px-3 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 sm:text-sm rounded-md"
//     {...props}
//   >
//     {children}
//   </select>
// )
// const Flash = ({ text, type }) =>
//   !text ? null : (
//     <div
//       className={`flex items-center gap-2 p-3 rounded-md text-sm mb-4 ${type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
//     >
//       <AlertCircle className="h-4 w-4 flex-shrink-0" />
//       {text}
//     </div>
//   )

// const TABS = [
//   { id: 'Dashboard', icon: Home, label: 'Dashboard' },
//   { id: 'Profile', icon: UserCircle, label: 'Profile' },
//   { id: 'Doctors', icon: Settings, label: 'Manage Doctors' },
//   { id: 'AddDoctor', icon: UserPlus, label: 'Add Doctor' },
//   { id: 'AddAdmin', icon: ShieldCheck, label: 'Add Admin' }
// ]

// const SPECIALTIES = [
//   'Cardiology',
//   'Neurology',
//   'Pediatrics',
//   'Oncology',
//   'Orthopedics',
//   'Dermatology',
//   'Gynecology',
//   'Ophthalmology',
//   'ENT',
//   'General Medicine',
//   'Psychiatry',
//   'Urology'
// ]

// export default function AdminDashboard() {
//   const navigate = useNavigate()
//   const { logout } = useAuth()

//   const [activeTab, setActiveTab] = useState('Dashboard')
//   const [adminInfo, setAdminInfo] = useState(null)
//   const [editedInfo, setEditedInfo] = useState(null)
//   const [isEditing, setIsEditing] = useState(false)
//   const [totalDoctors, setTotalDoctors] = useState(0)
//   const [totalPatients, setTotalPatients] = useState(0)
//   const [doctorOverview, setDoctorOverview] = useState([])
//   const [patientOverview, setPatientOverview] = useState([])
//   const [showDoctors, setShowDoctors] = useState(false)
//   const [showPatients, setShowPatients] = useState(false)
//   const [msg, setMsg] = useState({ text: '', type: '' })

//   // Manage Doctors
//   const [editingDoctor, setEditingDoctor] = useState(null)
//   const [scheduleForm, setScheduleForm] = useState({
//     workingHours: { start: '10:00', end: '17:00' },
//     minutesPerPatient: 30,
//     followUpDiscountPercent: 0,
//     followUpFree: false,
//     followUpWindowDays: 30
//   })

//   // Add Doctor form
//   const [doctorForm, setDoctorForm] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     specialty: '',
//     licenseNumber: '',
//     phoneNumber: '',
//     password: '',
//     workingHours: { start: '10:00', end: '17:00' },
//     minutesPerPatient: 30,
//     followUpDiscountPercent: 0,
//     followUpFree: false,
//     followUpWindowDays: 30
//   })
//   const [showDoctorPwd, setShowDoctorPwd] = useState(false)

//   // Add Admin form
//   const [adminForm, setAdminForm] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   })
//   const [showAdminPwd, setShowAdminPwd] = useState(false)

//   const flash = (text, type = 'success') => {
//     setMsg({ text, type })
//     setTimeout(() => setMsg({ text: '', type: '' }), 4000)
//   }

//   const load = useCallback(async () => {
//     try {
//       const [profile, td, tp, dov, pov] = await Promise.all([
//         api.get('/api/admin/profile'),
//         api.get('/api/admin/total-doctors'),
//         api.get('/api/admin/total-patients'),
//         api.get('/api/admin/doctor-overview'),
//         api.get('/api/admin/patient-overview')
//       ])
//       setAdminInfo(profile)
//       setEditedInfo(profile)
//       setTotalDoctors(td.totalDoctors)
//       setTotalPatients(tp.totalPatients)
//       setDoctorOverview(dov)
//       setPatientOverview(pov)
//     } catch (err) {
//       console.error(err)
//     }
//   }, [])

//   useEffect(() => {
//     load()
//   }, [load])

//   const handleSaveProfile = async () => {
//     try {
//       await api.put('/api/admin/profile', {
//         firstName: editedInfo.firstName,
//         lastName: editedInfo.lastName,
//         email: editedInfo.email
//       })
//       setAdminInfo(editedInfo)
//       setIsEditing(false)
//       flash('Profile updated successfully')
//     } catch (err) {
//       flash(err.message, 'error')
//     }
//   }

//   const handleAddDoctor = async (e) => {
//     e.preventDefault()
//     try {
//       await api.post('/api/admin/add-doctor', doctorForm)
//       flash('Doctor added successfully')
//       setDoctorForm({
//         firstName: '',
//         lastName: '',
//         email: '',
//         specialty: '',
//         licenseNumber: '',
//         phoneNumber: '',
//         password: '',
//         workingHours: { start: '10:00', end: '17:00' },
//         minutesPerPatient: 30,
//         followUpDiscountPercent: 0,
//         followUpFree: false,
//         followUpWindowDays: 30
//       })
//       load()
//     } catch (err) {
//       flash(err.message, 'error')
//     }
//   }

//   const handleAddAdmin = async (e) => {
//     e.preventDefault()
//     if (adminForm.password !== adminForm.confirmPassword) {
//       return flash("Passwords don't match", 'error')
//     }
//     try {
//       await api.post('/api/admin/add-admin', adminForm)
//       flash('Admin added successfully')
//       setAdminForm({
//         firstName: '',
//         lastName: '',
//         email: '',
//         password: '',
//         confirmPassword: ''
//       })
//     } catch (err) {
//       flash(err.message, 'error')
//     }
//   }

//   const openScheduleEditor = (doctor) => {
//     setEditingDoctor(doctor)
//     setScheduleForm({
//       workingHours: {
//         start: doctor.workingHours?.start || '10:00',
//         end: doctor.workingHours?.end || '17:00'
//       },
//       minutesPerPatient: doctor.minutesPerPatient ?? 30,
//       followUpDiscountPercent: doctor.followUpDiscountPercent ?? 0,
//       followUpFree: doctor.followUpFree ?? false,
//       followUpWindowDays: doctor.followUpWindowDays ?? 30
//     })
//   }

//   const handleSaveSchedule = async () => {
//     try {
//       const res = await api.put(
//         `/api/admin/doctor/${editingDoctor.id}/schedule`,
//         scheduleForm
//       )
//       flash(
//         `Schedule updated — max ${res.doctor.maxPatientsPerDay} patients/day`
//       )
//       setEditingDoctor(null)
//       load()
//     } catch (err) {
//       flash(err.message, 'error')
//     }
//   }

//   // ── Computed capacity ─────────────────────────────────────────────────────
//   const calcPreview = () => {
//     const [sh, sm] = scheduleForm.workingHours.start.split(':').map(Number)
//     const [eh, em] = scheduleForm.workingHours.end.split(':').map(Number)
//     const total = eh * 60 + em - (sh * 60 + sm)
//     return total > 0 ? Math.floor(total / scheduleForm.minutesPerPatient) : 0
//   }

//   const occupancyRate =
//     totalPatients && 10000 ? ((totalPatients / 10000) * 100).toFixed(2) : '0.00'

//   // ── Renders ───────────────────────────────────────────────────────────────
//   const renderDashboard = () => (
//     <>
//       {/* Stats row */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         {[
//           {
//             icon: Stethoscope,
//             title: 'Total Doctors',
//             value: totalDoctors,
//             sub: 'Active medical staff'
//           },
//           {
//             icon: Users,
//             title: 'Total Patients',
//             value: totalPatients,
//             sub: 'Registered patients'
//           },
//           {
//             icon: Activity,
//             title: 'Hospital Occupancy',
//             value: `${occupancyRate}%`,
//             sub: 'Bed occupancy rate'
//           }
//         ].map((s) => (
//           <Card key={s.title}>
//             <CardH icon={s.icon}>
//               <CT>{s.title}</CT>
//             </CardH>
//             <CC>
//               <div className="text-3xl font-bold">{s.value}</div>
//               <p className="text-xs text-gray-500">{s.sub}</p>
//             </CC>
//           </Card>
//         ))}
//       </div>

//       {/* Overview panels */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         {/* Doctor overview */}
//         <Card>
//           <CardH icon={Stethoscope}>
//             <CT>Doctor Overview</CT>
//           </CardH>
//           <CC>
//             <div className="text-2xl font-bold">{doctorOverview.length}</div>
//             <p className="text-xs text-gray-500">Doctors on staff</p>
//           </CC>
//           <CF>
//             <Btn
//               variant="outline"
//               className="w-full"
//               onClick={() => setShowDoctors(!showDoctors)}
//             >
//               {showDoctors ? 'Hide' : 'View All'} Doctors
//               <ChevronDown
//                 className={`h-4 w-4 ml-2 transition-transform ${showDoctors ? 'rotate-180' : ''}`}
//               />
//             </Btn>
//           </CF>
//           {showDoctors && (
//             <div className="px-4 pb-4 space-y-2">
//               {doctorOverview.map((d, i) => (
//                 <div key={i} className="py-3 border-t">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="text-sm font-medium">{d.name}</p>
//                       <p className="text-xs text-gray-500">{d.specialty}</p>
//                       <p className="text-xs text-gray-400">
//                         {d.workingHours?.start}–{d.workingHours?.end} •{' '}
//                         {d.minutesPerPatient} min/patient • Max{' '}
//                         {d.maxPatientsPerDay}/day
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-sm">{d.patients} patients</p>
//                       <a
//                         href={`/queue/${d.id}`}
//                         target="_blank"
//                         rel="noreferrer"
//                         className="text-xs text-blue-500 flex items-center gap-1 mt-1"
//                       >
//                         Queue <ExternalLink className="h-3 w-3" />
//                       </a>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </Card>

//         {/* Patient overview */}
//         <Card>
//           <CardH icon={Users}>
//             <CT>Patient Overview</CT>
//           </CardH>
//           <CC>
//             <div className="text-2xl font-bold">{patientOverview.length}</div>
//             <p className="text-xs text-gray-500">Registered patients</p>
//           </CC>
//           <CF>
//             <Btn
//               variant="outline"
//               className="w-full"
//               onClick={() => setShowPatients(!showPatients)}
//             >
//               {showPatients ? 'Hide' : 'View All'} Patients
//               <ChevronDown
//                 className={`h-4 w-4 ml-2 transition-transform ${showPatients ? 'rotate-180' : ''}`}
//               />
//             </Btn>
//           </CF>
//           {showPatients && (
//             <div className="px-4 pb-4 space-y-2 max-h-80 overflow-y-auto">
//               {patientOverview.map((p, i) => (
//                 <div key={i} className="py-2 border-t">
//                   <p className="text-sm font-medium">{p.name}</p>
//                   <p className="text-xs text-gray-500">
//                     {p.email} — {p.appointments} appointment(s)
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </Card>
//       </div>
//     </>
//   )

//   const renderProfile = () => (
//     <Card className="w-full max-w-2xl mx-auto">
//       <CardH>
//         <CT>Admin Profile</CT>
//       </CardH>
//       <CC>
//         <Flash {...msg} />
//         <div className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <Lbl htmlFor="fn">First Name</Lbl>
//               <Inp
//                 id="fn"
//                 value={
//                   isEditing
//                     ? editedInfo?.firstName || ''
//                     : adminInfo?.firstName || ''
//                 }
//                 onChange={(e) =>
//                   setEditedInfo((p) => ({ ...p, firstName: e.target.value }))
//                 }
//                 readOnly={!isEditing}
//               />
//             </div>
//             <div>
//               <Lbl htmlFor="ln">Last Name</Lbl>
//               <Inp
//                 id="ln"
//                 value={
//                   isEditing
//                     ? editedInfo?.lastName || ''
//                     : adminInfo?.lastName || ''
//                 }
//                 onChange={(e) =>
//                   setEditedInfo((p) => ({ ...p, lastName: e.target.value }))
//                 }
//                 readOnly={!isEditing}
//               />
//             </div>
//           </div>
//           <div>
//             <Lbl htmlFor="em">Email</Lbl>
//             <Inp
//               id="em"
//               type="email"
//               value={
//                 isEditing ? editedInfo?.email || '' : adminInfo?.email || ''
//               }
//               onChange={(e) =>
//                 setEditedInfo((p) => ({ ...p, email: e.target.value }))
//               }
//               readOnly={!isEditing}
//             />
//           </div>
//         </div>
//       </CC>
//       <CF>
//         {isEditing ? (
//           <>
//             <Btn onClick={handleSaveProfile} className="mr-2">
//               Save
//             </Btn>
//             <Btn variant="outline" onClick={() => setIsEditing(false)}>
//               Cancel
//             </Btn>
//           </>
//         ) : (
//           <Btn onClick={() => setIsEditing(true)} className="ml-auto">
//             Edit Profile
//           </Btn>
//         )}
//       </CF>
//     </Card>
//   )

//   const renderManageDoctors = () => (
//     <div className="max-w-4xl mx-auto space-y-6">
//       <Flash {...msg} />

//       {/* Schedule editor modal */}
//       {editingDoctor && (
//         <Card className="border-2 border-blue-400">
//           <CardH>
//             <CT>Edit Schedule — {editingDoctor.name}</CT>
//           </CardH>
//           <CC>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Lbl>Working Hours Start</Lbl>
//                 <Inp
//                   type="time"
//                   value={scheduleForm.workingHours.start}
//                   onChange={(e) =>
//                     setScheduleForm((p) => ({
//                       ...p,
//                       workingHours: { ...p.workingHours, start: e.target.value }
//                     }))
//                   }
//                 />
//               </div>
//               <div>
//                 <Lbl>Working Hours End</Lbl>
//                 <Inp
//                   type="time"
//                   value={scheduleForm.workingHours.end}
//                   onChange={(e) =>
//                     setScheduleForm((p) => ({
//                       ...p,
//                       workingHours: { ...p.workingHours, end: e.target.value }
//                     }))
//                   }
//                 />
//               </div>
//               <div>
//                 <Lbl>Minutes per Patient</Lbl>
//                 <Inp
//                   type="number"
//                   min="5"
//                   max="120"
//                   value={scheduleForm.minutesPerPatient}
//                   onChange={(e) =>
//                     setScheduleForm((p) => ({
//                       ...p,
//                       minutesPerPatient: parseInt(e.target.value)
//                     }))
//                   }
//                 />
//               </div>
//               <div className="flex items-end">
//                 <div className="bg-blue-50 rounded-md p-3 w-full text-center">
//                   <p className="text-xs text-gray-500">
//                     Calculated Max Patients/Day
//                   </p>
//                   <p className="text-3xl font-bold text-blue-700">
//                     {calcPreview()}
//                   </p>
//                 </div>
//               </div>
//               <div>
//                 <Lbl>Follow-up Discount (%)</Lbl>
//                 <Inp
//                   type="number"
//                   min="0"
//                   max="100"
//                   value={scheduleForm.followUpDiscountPercent}
//                   onChange={(e) =>
//                     setScheduleForm((p) => ({
//                       ...p,
//                       followUpDiscountPercent: parseInt(e.target.value)
//                     }))
//                   }
//                 />
//               </div>
//               <div>
//                 <Lbl>Follow-up Window (days)</Lbl>
//                 <Inp
//                   type="number"
//                   min="1"
//                   max="365"
//                   value={scheduleForm.followUpWindowDays}
//                   onChange={(e) =>
//                     setScheduleForm((p) => ({
//                       ...p,
//                       followUpWindowDays: parseInt(e.target.value)
//                     }))
//                   }
//                 />
//               </div>
//               <div className="flex items-center gap-3 mt-2">
//                 <input
//                   type="checkbox"
//                   id="fuf"
//                   checked={scheduleForm.followUpFree}
//                   onChange={(e) =>
//                     setScheduleForm((p) => ({
//                       ...p,
//                       followUpFree: e.target.checked
//                     }))
//                   }
//                   className="h-4 w-4 text-blue-600 rounded"
//                 />
//                 <Lbl htmlFor="fuf">Follow-up visits are FREE</Lbl>
//               </div>
//             </div>
//           </CC>
//           <CF className="flex gap-3">
//             <Btn onClick={handleSaveSchedule}>Save Schedule</Btn>
//             <Btn variant="outline" onClick={() => setEditingDoctor(null)}>
//               Cancel
//             </Btn>
//           </CF>
//         </Card>
//       )}

//       {/* Doctor list */}
//       <Card>
//         <CardH icon={Stethoscope}>
//           <CT>All Doctors</CT>
//         </CardH>
//         <CC>
//           {doctorOverview.length === 0 ? (
//             <p className="text-gray-500 text-sm">No doctors registered yet.</p>
//           ) : (
//             <div className="space-y-3">
//               {doctorOverview.map((d, i) => (
//                 <div
//                   key={i}
//                   className="flex justify-between items-start py-3 border-b last:border-0"
//                 >
//                   <div>
//                     <p className="text-sm font-bold">{d.name}</p>
//                     <p className="text-xs text-gray-500">{d.specialty}</p>
//                     <p className="text-xs text-gray-400 mt-0.5">
//                       Hours: {d.workingHours?.start}–{d.workingHours?.end} |
//                       {d.minutesPerPatient} min/slot | Max {d.maxPatientsPerDay}{' '}
//                       patients/day |{d.patients} total patients
//                     </p>
//                   </div>
//                   <div className="flex gap-2 flex-shrink-0">
//                     <Btn
//                       variant="outline"
//                       className="text-xs px-2 py-1"
//                       onClick={() => openScheduleEditor(d)}
//                     >
//                       <Settings className="h-3 w-3 mr-1" />
//                       Edit Schedule
//                     </Btn>
//                     <a
//                       href={`/queue/${d.id}`}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="inline-flex items-center gap-1 text-xs text-blue-600 border border-blue-300 px-2 py-1 rounded-md hover:bg-blue-50"
//                     >
//                       <BarChart2 className="h-3 w-3" />
//                       Queue Screen
//                     </a>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </CC>
//       </Card>
//     </div>
//   )

//   const renderAddDoctor = () => (
//     <Card className="w-full max-w-2xl mx-auto">
//       <CardH>
//         <CT>Add New Doctor</CT>
//       </CardH>
//       <CC>
//         <Flash {...msg} />
//         <form onSubmit={handleAddDoctor} className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <Lbl htmlFor="dfn">First Name</Lbl>
//               <Inp
//                 id="dfn"
//                 value={doctorForm.firstName}
//                 required
//                 onChange={(e) =>
//                   setDoctorForm((p) => ({ ...p, firstName: e.target.value }))
//                 }
//               />
//             </div>
//             <div>
//               <Lbl htmlFor="dln">Last Name</Lbl>
//               <Inp
//                 id="dln"
//                 value={doctorForm.lastName}
//                 required
//                 onChange={(e) =>
//                   setDoctorForm((p) => ({ ...p, lastName: e.target.value }))
//                 }
//               />
//             </div>
//           </div>
//           <div>
//             <Lbl htmlFor="dem">Email</Lbl>
//             <Inp
//               id="dem"
//               type="email"
//               value={doctorForm.email}
//               required
//               onChange={(e) =>
//                 setDoctorForm((p) => ({ ...p, email: e.target.value }))
//               }
//             />
//           </div>
//           <div>
//             <Lbl htmlFor="dsp">Specialty</Lbl>
//             <Sel
//               id="dsp"
//               value={doctorForm.specialty}
//               required
//               onChange={(e) =>
//                 setDoctorForm((p) => ({ ...p, specialty: e.target.value }))
//               }
//             >
//               <option value="">Choose a specialty</option>
//               {SPECIALTIES.map((s) => (
//                 <option key={s} value={s}>
//                   {s}
//                 </option>
//               ))}
//             </Sel>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <Lbl htmlFor="dlic">License Number</Lbl>
//               <Inp
//                 id="dlic"
//                 value={doctorForm.licenseNumber}
//                 required
//                 onChange={(e) =>
//                   setDoctorForm((p) => ({
//                     ...p,
//                     licenseNumber: e.target.value
//                   }))
//                 }
//               />
//             </div>
//             <div>
//               <Lbl htmlFor="dph">Phone Number</Lbl>
//               <Inp
//                 id="dph"
//                 type="tel"
//                 value={doctorForm.phoneNumber}
//                 required
//                 onChange={(e) =>
//                   setDoctorForm((p) => ({ ...p, phoneNumber: e.target.value }))
//                 }
//               />
//             </div>
//           </div>

//           {/* Schedule settings */}
//           <div className="bg-gray-50 rounded-lg p-4 space-y-3">
//             <p className="text-sm font-semibold text-gray-700">
//               Schedule Settings
//             </p>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Lbl>Working Hours Start</Lbl>
//                 <Inp
//                   type="time"
//                   value={doctorForm.workingHours.start}
//                   onChange={(e) =>
//                     setDoctorForm((p) => ({
//                       ...p,
//                       workingHours: { ...p.workingHours, start: e.target.value }
//                     }))
//                   }
//                 />
//               </div>
//               <div>
//                 <Lbl>Working Hours End</Lbl>
//                 <Inp
//                   type="time"
//                   value={doctorForm.workingHours.end}
//                   onChange={(e) =>
//                     setDoctorForm((p) => ({
//                       ...p,
//                       workingHours: { ...p.workingHours, end: e.target.value }
//                     }))
//                   }
//                 />
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Lbl>Minutes per Patient</Lbl>
//                 <Inp
//                   type="number"
//                   min="5"
//                   max="120"
//                   value={doctorForm.minutesPerPatient}
//                   onChange={(e) =>
//                     setDoctorForm((p) => ({
//                       ...p,
//                       minutesPerPatient: parseInt(e.target.value)
//                     }))
//                   }
//                 />
//               </div>
//               <div className="flex items-end">
//                 <div className="bg-white rounded p-2 text-center w-full border">
//                   <p className="text-xs text-gray-500">Max Patients/Day</p>
//                   <p className="text-2xl font-bold text-blue-700">
//                     {(() => {
//                       const [sh, sm] = doctorForm.workingHours.start
//                         .split(':')
//                         .map(Number)
//                       const [eh, em] = doctorForm.workingHours.end
//                         .split(':')
//                         .map(Number)
//                       const total = eh * 60 + em - (sh * 60 + sm)
//                       return total > 0
//                         ? Math.floor(total / doctorForm.minutesPerPatient)
//                         : 0
//                     })()}
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Lbl>Follow-up Discount (%)</Lbl>
//                 <Inp
//                   type="number"
//                   min="0"
//                   max="100"
//                   value={doctorForm.followUpDiscountPercent}
//                   onChange={(e) =>
//                     setDoctorForm((p) => ({
//                       ...p,
//                       followUpDiscountPercent: parseInt(e.target.value)
//                     }))
//                   }
//                 />
//               </div>
//               <div>
//                 <Lbl>Follow-up Window (days)</Lbl>
//                 <Inp
//                   type="number"
//                   min="1"
//                   max="365"
//                   value={doctorForm.followUpWindowDays}
//                   onChange={(e) =>
//                     setDoctorForm((p) => ({
//                       ...p,
//                       followUpWindowDays: parseInt(e.target.value)
//                     }))
//                   }
//                 />
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <input
//                 type="checkbox"
//                 id="addDoctorFollowUpFree"
//                 checked={doctorForm.followUpFree}
//                 onChange={(e) =>
//                   setDoctorForm((p) => ({
//                     ...p,
//                     followUpFree: e.target.checked
//                   }))
//                 }
//                 className="h-4 w-4 text-blue-600 rounded"
//               />
//               <Lbl htmlFor="addDoctorFollowUpFree">
//                 Follow-up visits are FREE
//               </Lbl>
//             </div>
//           </div>

//           {/* Password */}
//           <div>
//             <Lbl htmlFor="dpwd">Password</Lbl>
//             <div className="relative">
//               <Inp
//                 id="dpwd"
//                 type={showDoctorPwd ? 'text' : 'password'}
//                 value={doctorForm.password}
//                 required
//                 onChange={(e) =>
//                   setDoctorForm((p) => ({ ...p, password: e.target.value }))
//                 }
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowDoctorPwd(!showDoctorPwd)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
//               >
//                 {showDoctorPwd ? (
//                   <EyeOff className="h-4 w-4" />
//                 ) : (
//                   <Eye className="h-4 w-4" />
//                 )}
//               </button>
//             </div>
//           </div>
//           <Btn type="submit" className="w-full">
//             Add Doctor
//           </Btn>
//         </form>
//       </CC>
//     </Card>
//   )

//   const renderAddAdmin = () => (
//     <Card className="w-full max-w-2xl mx-auto">
//       <CardH>
//         <CT>Add New Admin</CT>
//       </CardH>
//       <CC>
//         <Flash {...msg} />
//         <form onSubmit={handleAddAdmin} className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <Lbl htmlFor="afn">First Name</Lbl>
//               <Inp
//                 id="afn"
//                 value={adminForm.firstName}
//                 required
//                 onChange={(e) =>
//                   setAdminForm((p) => ({ ...p, firstName: e.target.value }))
//                 }
//               />
//             </div>
//             <div>
//               <Lbl htmlFor="aln">Last Name</Lbl>
//               <Inp
//                 id="aln"
//                 value={adminForm.lastName}
//                 required
//                 onChange={(e) =>
//                   setAdminForm((p) => ({ ...p, lastName: e.target.value }))
//                 }
//               />
//             </div>
//           </div>
//           <div>
//             <Lbl htmlFor="aem">Email</Lbl>
//             <Inp
//               id="aem"
//               type="email"
//               value={adminForm.email}
//               required
//               onChange={(e) =>
//                 setAdminForm((p) => ({ ...p, email: e.target.value }))
//               }
//             />
//           </div>
//           <div>
//             <Lbl htmlFor="apwd">Password</Lbl>
//             <div className="relative">
//               <Inp
//                 id="apwd"
//                 type={showAdminPwd ? 'text' : 'password'}
//                 value={adminForm.password}
//                 required
//                 onChange={(e) =>
//                   setAdminForm((p) => ({ ...p, password: e.target.value }))
//                 }
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowAdminPwd(!showAdminPwd)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
//               >
//                 {showAdminPwd ? (
//                   <EyeOff className="h-4 w-4" />
//                 ) : (
//                   <Eye className="h-4 w-4" />
//                 )}
//               </button>
//             </div>
//           </div>
//           <div>
//             <Lbl htmlFor="acpwd">Confirm Password</Lbl>
//             <div className="relative">
//               <Inp
//                 id="acpwd"
//                 type={showAdminPwd ? 'text' : 'password'}
//                 value={adminForm.confirmPassword}
//                 required
//                 onChange={(e) =>
//                   setAdminForm((p) => ({
//                     ...p,
//                     confirmPassword: e.target.value
//                   }))
//                 }
//               />
//             </div>
//           </div>
//           <Btn type="submit" className="w-full">
//             Add Admin
//           </Btn>
//         </form>
//       </CC>
//     </Card>
//   )

//   return (
//     <div className="min-h-screen bg-blue-600">
//       <header className="bg-white p-4 flex justify-between items-center shadow">
//         <div className="flex items-center space-x-2">
//           <Hospital className="h-6 w-6 text-blue-600" />
//           <span className="font-bold text-xl">Hospital Management System</span>
//         </div>
//         <button
//           onClick={() => {
//             logout()
//             navigate('/')
//           }}
//           className="text-sm text-blue-600 border border-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-50"
//         >
//           Sign Out
//         </button>
//       </header>

//       <nav className="bg-blue-700 p-3">
//         <ul className="flex space-x-2 justify-center flex-wrap gap-y-2">
//           {TABS.map((t) => (
//             <li key={t.id}>
//               <button
//                 onClick={() => setActiveTab(t.id)}
//                 className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors
//                   ${activeTab === t.id ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-600'}`}
//               >
//                 <t.icon className="w-4 h-4 mr-2" />
//                 {t.label}
//               </button>
//             </li>
//           ))}
//         </ul>
//       </nav>

//       <main className="container mx-auto px-4 py-8">
//         <h1 className="text-3xl font-bold text-white mb-6">
//           Welcome,{' '}
//           {adminInfo ? `${adminInfo.firstName} ${adminInfo.lastName}` : 'Admin'}
//         </h1>
//         {activeTab === 'Dashboard' && renderDashboard()}
//         {activeTab === 'Profile' && renderProfile()}
//         {activeTab === 'Doctors' && renderManageDoctors()}
//         {activeTab === 'AddDoctor' && renderAddDoctor()}
//         {activeTab === 'AddAdmin' && renderAddAdmin()}
//       </main>
//     </div>
//   )
// }

import React, { useState, useEffect, useCallback } from 'react'
import {
  Hospital,
  Home,
  UserCircle,
  UserPlus,
  ShieldCheck,
  Stethoscope,
  Users,
  Activity,
  ChevronDown,
  Eye,
  EyeOff,
  AlertCircle,
  Settings,
  BarChart2,
  ExternalLink,
  Lock,
  ToggleLeft,
  ToggleRight,
  TrendingUp
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

const Btn = ({
  children,
  variant = 'primary',
  className = '',
  disabled,
  ...props
}) => (
  <button
    disabled={disabled}
    className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm
      transition-colors focus:outline-none disabled:opacity-50
      ${
        variant === 'primary'
          ? 'text-white bg-blue-600 hover:bg-blue-700'
          : variant === 'danger'
            ? 'text-white bg-red-600 hover:bg-red-700'
            : variant === 'success'
              ? 'text-white bg-green-600 hover:bg-green-700'
              : 'text-blue-600 border border-blue-600 hover:bg-blue-50'
      } ${className}`}
    {...props}
  >
    {children}
  </button>
)
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>{children}</div>
)
const CardH = ({ children, icon: Icon }) => (
  <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex items-center justify-between">
    {children}
    {Icon && <Icon className="h-5 w-5 text-blue-600 ml-2" />}
  </div>
)
const CT = ({ children }) => (
  <h3 className="text-lg leading-6 font-medium text-gray-900">{children}</h3>
)
const CC = ({ children }) => <div className="px-4 py-5 sm:p-6">{children}</div>
const CF = ({ children }) => <div className="px-4 py-4 sm:px-6">{children}</div>
const Inp = (props) => (
  <input
    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md px-3 py-2"
    {...props}
  />
)
const Lbl = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
    {children}
  </label>
)
const Sel = ({ children, ...props }) => (
  <select
    className="mt-1 block w-full pr-10 py-2 px-3 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 sm:text-sm rounded-md"
    {...props}
  >
    {children}
  </select>
)
const Flash = ({ text, type }) =>
  !text ? null : (
    <div
      className={`flex items-center gap-2 p-3 rounded-md text-sm mb-4 ${type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
    >
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      {text}
    </div>
  )

const TABS = [
  { id: 'Dashboard', icon: Home, label: 'Dashboard' },
  { id: 'Profile', icon: UserCircle, label: 'Profile' },
  { id: 'Doctors', icon: Settings, label: 'Manage Doctors' },
  { id: 'AddDoctor', icon: UserPlus, label: 'Add Doctor' },
  { id: 'AddAdmin', icon: ShieldCheck, label: 'Add Admin' },
  { id: 'Security', icon: Lock, label: 'Security' }
]

const SPECIALTIES = [
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Oncology',
  'Orthopedics',
  'Dermatology',
  'Gynecology',
  'Ophthalmology',
  'ENT',
  'General Medicine',
  'Psychiatry',
  'Urology',
  'Radiology',
  'Anesthesiology',
  'Pathology'
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const [activeTab, setActiveTab] = useState('Dashboard')
  const [adminInfo, setAdminInfo] = useState(null)
  const [editedInfo, setEditedInfo] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [stats, setStats] = useState(null)
  const [doctorOverview, setDoctorOverview] = useState([])
  const [patientOverview, setPatientOverview] = useState([])
  const [showDoctors, setShowDoctors] = useState(false)
  const [showPatients, setShowPatients] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })

  // Manage Doctors
  const [editingDoctor, setEditingDoctor] = useState(null)
  const [scheduleForm, setScheduleForm] = useState({
    workingHours: { start: '10:00', end: '17:00' },
    minutesPerPatient: 30,
    followUpDiscountPercent: 0,
    followUpFree: false,
    followUpWindowDays: 30
  })

  // Add Doctor
  const [doctorForm, setDoctorForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    specialty: '',
    licenseNumber: '',
    phoneNumber: '',
    password: '',
    workingHours: { start: '10:00', end: '17:00' },
    minutesPerPatient: 30,
    followUpDiscountPercent: 0,
    followUpFree: false,
    followUpWindowDays: 30
  })
  const [showDoctorPwd, setShowDoctorPwd] = useState(false)

  // Add Admin
  const [adminForm, setAdminForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showAdminPwd, setShowAdminPwd] = useState(false)

  // Password change
  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [pwMsg, setPwMsg] = useState({ text: '', type: '' })
  const [pwLoading, setPwLoading] = useState(false)

  const flash = (text, type = 'success') => {
    setMsg({ text, type })
    setTimeout(() => setMsg({ text: '', type: '' }), 4000)
  }

  const load = useCallback(async () => {
    try {
      const [profile, s, dov, pov] = await Promise.all([
        api.get('/api/admin/profile'),
        api.get('/api/admin/stats'),
        api.get('/api/admin/doctor-overview'),
        api.get('/api/admin/patient-overview')
      ])
      setAdminInfo(profile)
      setEditedInfo(profile)
      setStats(s)
      setDoctorOverview(dov)
      setPatientOverview(pov)
    } catch (err) {
      console.error(err)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleSaveProfile = async () => {
    try {
      await api.put('/api/admin/profile', {
        firstName: editedInfo.firstName,
        lastName: editedInfo.lastName,
        email: editedInfo.email
      })
      setAdminInfo(editedInfo)
      setIsEditing(false)
      flash('Profile updated')
    } catch (err) {
      flash(err.message, 'error')
    }
  }

  const handleAddDoctor = async (e) => {
    e.preventDefault()
    try {
      await api.post('/api/admin/add-doctor', doctorForm)
      flash('Doctor added — welcome email sent')
      setDoctorForm({
        firstName: '',
        lastName: '',
        email: '',
        specialty: '',
        licenseNumber: '',
        phoneNumber: '',
        password: '',
        workingHours: { start: '10:00', end: '17:00' },
        minutesPerPatient: 30,
        followUpDiscountPercent: 0,
        followUpFree: false,
        followUpWindowDays: 30
      })
      load()
    } catch (err) {
      flash(err.message, 'error')
    }
  }

  const handleAddAdmin = async (e) => {
    e.preventDefault()
    if (adminForm.password !== adminForm.confirmPassword)
      return flash("Passwords don't match", 'error')
    try {
      await api.post('/api/admin/add-admin', adminForm)
      flash('Admin added successfully')
      setAdminForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      })
    } catch (err) {
      flash(err.message, 'error')
    }
  }

  const openScheduleEditor = (doctor) => {
    setEditingDoctor(doctor)
    setScheduleForm({
      workingHours: {
        start: doctor.workingHours?.start || '10:00',
        end: doctor.workingHours?.end || '17:00'
      },
      minutesPerPatient: doctor.minutesPerPatient ?? 30,
      followUpDiscountPercent: doctor.followUpDiscountPercent ?? 0,
      followUpFree: doctor.followUpFree ?? false,
      followUpWindowDays: doctor.followUpWindowDays ?? 30
    })
  }

  const handleSaveSchedule = async () => {
    try {
      const res = await api.put(
        `/api/admin/doctor/${editingDoctor.id}/schedule`,
        scheduleForm
      )
      flash(
        `Schedule updated — max ${res.doctor.maxPatientsPerDay} patients/day`
      )
      setEditingDoctor(null)
      load()
    } catch (err) {
      flash(err.message, 'error')
    }
  }

  const handleToggleDoctor = async (doctor) => {
    const action = doctor.isActive ? 'deactivate' : 'activate'
    if (
      !window.confirm(`Are you sure you want to ${action} Dr. ${doctor.name}?`)
    )
      return
    try {
      const res = await api.patch(
        `/api/admin/doctor/${doctor.id}/${action}`,
        {}
      )
      flash(res.message)
      load()
    } catch (err) {
      flash(err.message, 'error')
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirmPassword)
      return setPwMsg({ text: "Passwords don't match", type: 'error' })
    setPwLoading(true)
    try {
      const res = await api.post('/api/password/change', pwForm)
      setPwMsg({ text: res.message, type: 'success' })
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => {
        logout()
        navigate('/login')
      }, 2000)
    } catch (err) {
      setPwMsg({ text: err.message, type: 'error' })
    } finally {
      setPwLoading(false)
    }
  }

  const calcPreview = () => {
    const [sh, sm] = scheduleForm.workingHours.start.split(':').map(Number)
    const [eh, em] = scheduleForm.workingHours.end.split(':').map(Number)
    const total = eh * 60 + em - (sh * 60 + sm)
    return total > 0 ? Math.floor(total / scheduleForm.minutesPerPatient) : 0
  }

  const renderDashboard = () => (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: Stethoscope,
            title: 'Total Doctors',
            value: stats?.totalDoctors ?? '—',
            sub: `${stats?.activeDoctors ?? 0} active`
          },
          {
            icon: Users,
            title: 'Total Patients',
            value: stats?.totalPatients ?? '—',
            sub: 'Registered patients'
          },
          {
            icon: Activity,
            title: "Today's Appointments",
            value: stats?.todayAppts ?? '—',
            sub: `${stats?.completedToday ?? 0} completed`
          },
          {
            icon: TrendingUp,
            title: 'Active Doctors',
            value: stats?.activeDoctors ?? '—',
            sub: 'Available today'
          }
        ].map((s) => (
          <Card key={s.title}>
            <CardH icon={s.icon}>
              <CT>{s.title}</CT>
            </CardH>
            <CC>
              <div className="text-3xl font-bold">{s.value}</div>
              <p className="text-xs text-gray-500">{s.sub}</p>
            </CC>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardH icon={Stethoscope}>
            <CT>Doctor Overview</CT>
          </CardH>
          <CC>
            <div className="text-2xl font-bold">{doctorOverview.length}</div>
            <p className="text-xs text-gray-500">Doctors on staff</p>
          </CC>
          <CF>
            <Btn
              variant="outline"
              className="w-full"
              onClick={() => setShowDoctors(!showDoctors)}
            >
              {showDoctors ? 'Hide' : 'View All'} Doctors
              <ChevronDown
                className={`h-4 w-4 ml-2 transition-transform ${showDoctors ? 'rotate-180' : ''}`}
              />
            </Btn>
          </CF>
          {showDoctors && (
            <div className="px-4 pb-4 space-y-2">
              {doctorOverview.map((d, i) => (
                <div key={i} className="py-3 border-t">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{d.name}</p>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full ${d.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                        >
                          {d.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{d.specialty}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{d.patients} patients</p>
                      <a
                        href={`/queue/${d.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-500 flex items-center gap-1 mt-1"
                      >
                        Queue <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <CardH icon={Users}>
            <CT>Patient Overview</CT>
          </CardH>
          <CC>
            <div className="text-2xl font-bold">{patientOverview.length}</div>
            <p className="text-xs text-gray-500">Registered patients</p>
          </CC>
          <CF>
            <Btn
              variant="outline"
              className="w-full"
              onClick={() => setShowPatients(!showPatients)}
            >
              {showPatients ? 'Hide' : 'View All'} Patients
              <ChevronDown
                className={`h-4 w-4 ml-2 transition-transform ${showPatients ? 'rotate-180' : ''}`}
              />
            </Btn>
          </CF>
          {showPatients && (
            <div className="px-4 pb-4 space-y-2 max-h-80 overflow-y-auto">
              {patientOverview.map((p, i) => (
                <div key={i} className="py-2 border-t">
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-gray-500">
                    {p.contact} — {p.appointments} appointment(s)
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  )

  const renderProfile = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardH>
        <CT>Admin Profile</CT>
      </CardH>
      <CC>
        <Flash {...msg} />
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Lbl htmlFor="fn">First Name</Lbl>
              <Inp
                id="fn"
                value={
                  isEditing
                    ? editedInfo?.firstName || ''
                    : adminInfo?.firstName || ''
                }
                onChange={(e) =>
                  setEditedInfo((p) => ({ ...p, firstName: e.target.value }))
                }
                readOnly={!isEditing}
              />
            </div>
            <div>
              <Lbl htmlFor="ln">Last Name</Lbl>
              <Inp
                id="ln"
                value={
                  isEditing
                    ? editedInfo?.lastName || ''
                    : adminInfo?.lastName || ''
                }
                onChange={(e) =>
                  setEditedInfo((p) => ({ ...p, lastName: e.target.value }))
                }
                readOnly={!isEditing}
              />
            </div>
          </div>
          <div>
            <Lbl htmlFor="em">Email</Lbl>
            <Inp
              id="em"
              type="email"
              value={
                isEditing ? editedInfo?.email || '' : adminInfo?.email || ''
              }
              onChange={(e) =>
                setEditedInfo((p) => ({ ...p, email: e.target.value }))
              }
              readOnly={!isEditing}
            />
          </div>
        </div>
      </CC>
      <CF>
        {isEditing ? (
          <>
            <Btn onClick={handleSaveProfile} className="mr-2">
              Save
            </Btn>
            <Btn variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Btn>
          </>
        ) : (
          <Btn onClick={() => setIsEditing(true)}>Edit Profile</Btn>
        )}
      </CF>
    </Card>
  )

  const renderManageDoctors = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <Flash {...msg} />

      {editingDoctor && (
        <Card className="border-2 border-blue-400">
          <CardH>
            <CT>Edit Schedule — {editingDoctor.name}</CT>
          </CardH>
          <CC>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Lbl>Working Hours Start</Lbl>
                <Inp
                  type="time"
                  value={scheduleForm.workingHours.start}
                  onChange={(e) =>
                    setScheduleForm((p) => ({
                      ...p,
                      workingHours: { ...p.workingHours, start: e.target.value }
                    }))
                  }
                />
              </div>
              <div>
                <Lbl>Working Hours End</Lbl>
                <Inp
                  type="time"
                  value={scheduleForm.workingHours.end}
                  onChange={(e) =>
                    setScheduleForm((p) => ({
                      ...p,
                      workingHours: { ...p.workingHours, end: e.target.value }
                    }))
                  }
                />
              </div>
              <div>
                <Lbl>Minutes per Patient</Lbl>
                <Inp
                  type="number"
                  min="5"
                  max="120"
                  value={scheduleForm.minutesPerPatient}
                  onChange={(e) =>
                    setScheduleForm((p) => ({
                      ...p,
                      minutesPerPatient: parseInt(e.target.value)
                    }))
                  }
                />
              </div>
              <div className="flex items-end">
                <div className="bg-blue-50 rounded-md p-3 w-full text-center">
                  <p className="text-xs text-gray-500">Max Patients/Day</p>
                  <p className="text-3xl font-bold text-blue-700">
                    {calcPreview()}
                  </p>
                </div>
              </div>
              <div>
                <Lbl>Follow-up Discount (%)</Lbl>
                <Inp
                  type="number"
                  min="0"
                  max="100"
                  value={scheduleForm.followUpDiscountPercent}
                  onChange={(e) =>
                    setScheduleForm((p) => ({
                      ...p,
                      followUpDiscountPercent: parseInt(e.target.value)
                    }))
                  }
                />
              </div>
              <div>
                <Lbl>Follow-up Window (days)</Lbl>
                <Inp
                  type="number"
                  min="1"
                  max="365"
                  value={scheduleForm.followUpWindowDays}
                  onChange={(e) =>
                    setScheduleForm((p) => ({
                      ...p,
                      followUpWindowDays: parseInt(e.target.value)
                    }))
                  }
                />
              </div>
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="checkbox"
                  id="fuf"
                  checked={scheduleForm.followUpFree}
                  onChange={(e) =>
                    setScheduleForm((p) => ({
                      ...p,
                      followUpFree: e.target.checked
                    }))
                  }
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <Lbl htmlFor="fuf">Follow-up visits are FREE</Lbl>
              </div>
            </div>
          </CC>
          <CF className="flex gap-3">
            <Btn onClick={handleSaveSchedule}>Save Schedule</Btn>
            <Btn variant="outline" onClick={() => setEditingDoctor(null)}>
              Cancel
            </Btn>
          </CF>
        </Card>
      )}

      <Card>
        <CardH icon={Stethoscope}>
          <CT>All Doctors</CT>
        </CardH>
        <CC>
          {doctorOverview.length === 0 ? (
            <p className="text-gray-500 text-sm">No doctors registered yet.</p>
          ) : (
            <div className="space-y-3">
              {doctorOverview.map((d, i) => (
                <div
                  key={i}
                  className={`flex justify-between items-start py-3 border-b last:border-0 ${d.isActive === false ? 'opacity-60' : ''}`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold">{d.name}</p>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${d.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                      >
                        {d.isActive !== false ? 'Active' : 'Deactivated'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{d.specialty}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {d.workingHours?.start}–{d.workingHours?.end} |{' '}
                      {d.minutesPerPatient} min/slot | Max {d.maxPatientsPerDay}
                      /day | {d.patients} total patients
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                    <Btn
                      variant="outline"
                      className="text-xs px-2 py-1"
                      onClick={() => openScheduleEditor(d)}
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Schedule
                    </Btn>
                    <a
                      href={`/queue/${d.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 border border-blue-300 px-2 py-1 rounded-md hover:bg-blue-50"
                    >
                      <BarChart2 className="h-3 w-3" />
                      Queue
                    </a>
                    <Btn
                      variant={d.isActive !== false ? 'danger' : 'success'}
                      className="text-xs px-2 py-1"
                      onClick={() => handleToggleDoctor(d)}
                    >
                      {d.isActive !== false ? (
                        <>
                          <ToggleLeft className="h-3 w-3 mr-1" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <ToggleRight className="h-3 w-3 mr-1" />
                          Activate
                        </>
                      )}
                    </Btn>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CC>
      </Card>
    </div>
  )

  const renderAddDoctor = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardH>
        <CT>Add New Doctor</CT>
      </CardH>
      <CC>
        <Flash {...msg} />
        <form onSubmit={handleAddDoctor} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Lbl htmlFor="dfn">First Name</Lbl>
              <Inp
                id="dfn"
                value={doctorForm.firstName}
                required
                onChange={(e) =>
                  setDoctorForm((p) => ({ ...p, firstName: e.target.value }))
                }
              />
            </div>
            <div>
              <Lbl htmlFor="dln">Last Name</Lbl>
              <Inp
                id="dln"
                value={doctorForm.lastName}
                required
                onChange={(e) =>
                  setDoctorForm((p) => ({ ...p, lastName: e.target.value }))
                }
              />
            </div>
          </div>
          <div>
            <Lbl htmlFor="dem">Email</Lbl>
            <Inp
              id="dem"
              type="email"
              value={doctorForm.email}
              required
              onChange={(e) =>
                setDoctorForm((p) => ({ ...p, email: e.target.value }))
              }
            />
          </div>
          <div>
            <Lbl htmlFor="dsp">Specialty</Lbl>
            <Sel
              id="dsp"
              value={doctorForm.specialty}
              required
              onChange={(e) =>
                setDoctorForm((p) => ({ ...p, specialty: e.target.value }))
              }
            >
              <option value="">Choose a specialty</option>
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Sel>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Lbl htmlFor="dlic">License Number</Lbl>
              <Inp
                id="dlic"
                value={doctorForm.licenseNumber}
                required
                onChange={(e) =>
                  setDoctorForm((p) => ({
                    ...p,
                    licenseNumber: e.target.value
                  }))
                }
              />
            </div>
            <div>
              <Lbl htmlFor="dph">Phone Number</Lbl>
              <Inp
                id="dph"
                type="tel"
                value={doctorForm.phoneNumber}
                required
                onChange={(e) =>
                  setDoctorForm((p) => ({ ...p, phoneNumber: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <p className="text-sm font-semibold text-gray-700">
              Schedule Settings
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Lbl>Start Time</Lbl>
                <Inp
                  type="time"
                  value={doctorForm.workingHours.start}
                  onChange={(e) =>
                    setDoctorForm((p) => ({
                      ...p,
                      workingHours: { ...p.workingHours, start: e.target.value }
                    }))
                  }
                />
              </div>
              <div>
                <Lbl>End Time</Lbl>
                <Inp
                  type="time"
                  value={doctorForm.workingHours.end}
                  onChange={(e) =>
                    setDoctorForm((p) => ({
                      ...p,
                      workingHours: { ...p.workingHours, end: e.target.value }
                    }))
                  }
                />
              </div>
              <div>
                <Lbl>Minutes per Patient</Lbl>
                <Inp
                  type="number"
                  min="5"
                  max="120"
                  value={doctorForm.minutesPerPatient}
                  onChange={(e) =>
                    setDoctorForm((p) => ({
                      ...p,
                      minutesPerPatient: parseInt(e.target.value)
                    }))
                  }
                />
              </div>
              <div className="flex items-end">
                <div className="bg-white rounded p-2 text-center w-full border">
                  <p className="text-xs text-gray-500">Max Patients/Day</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {(() => {
                      const [sh, sm] = doctorForm.workingHours.start
                        .split(':')
                        .map(Number)
                      const [eh, em] = doctorForm.workingHours.end
                        .split(':')
                        .map(Number)
                      const total = eh * 60 + em - (sh * 60 + sm)
                      return total > 0
                        ? Math.floor(total / doctorForm.minutesPerPatient)
                        : 0
                    })()}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Lbl>Follow-up Discount (%)</Lbl>
                <Inp
                  type="number"
                  min="0"
                  max="100"
                  value={doctorForm.followUpDiscountPercent}
                  onChange={(e) =>
                    setDoctorForm((p) => ({
                      ...p,
                      followUpDiscountPercent: parseInt(e.target.value)
                    }))
                  }
                />
              </div>
              <div>
                <Lbl>Follow-up Window (days)</Lbl>
                <Inp
                  type="number"
                  min="1"
                  max="365"
                  value={doctorForm.followUpWindowDays}
                  onChange={(e) =>
                    setDoctorForm((p) => ({
                      ...p,
                      followUpWindowDays: parseInt(e.target.value)
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="addFUF"
                checked={doctorForm.followUpFree}
                onChange={(e) =>
                  setDoctorForm((p) => ({
                    ...p,
                    followUpFree: e.target.checked
                  }))
                }
                className="h-4 w-4 text-blue-600 rounded"
              />
              <Lbl htmlFor="addFUF">Follow-up visits are FREE</Lbl>
            </div>
          </div>
          <div>
            <Lbl htmlFor="dpwd">Password</Lbl>
            <div className="relative">
              <Inp
                id="dpwd"
                type={showDoctorPwd ? 'text' : 'password'}
                value={doctorForm.password}
                required
                onChange={(e) =>
                  setDoctorForm((p) => ({ ...p, password: e.target.value }))
                }
              />
              <button
                type="button"
                onClick={() => setShowDoctorPwd(!showDoctorPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showDoctorPwd ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-blue-500 mt-1">
              📧 Doctor will receive a welcome email with their credentials and
              schedule.
            </p>
          </div>
          <Btn type="submit" className="w-full">
            Add Doctor
          </Btn>
        </form>
      </CC>
    </Card>
  )

  const renderAddAdmin = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardH>
        <CT>Add New Admin</CT>
      </CardH>
      <CC>
        <Flash {...msg} />
        <form onSubmit={handleAddAdmin} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Lbl htmlFor="afn">First Name</Lbl>
              <Inp
                id="afn"
                value={adminForm.firstName}
                required
                onChange={(e) =>
                  setAdminForm((p) => ({ ...p, firstName: e.target.value }))
                }
              />
            </div>
            <div>
              <Lbl htmlFor="aln">Last Name</Lbl>
              <Inp
                id="aln"
                value={adminForm.lastName}
                required
                onChange={(e) =>
                  setAdminForm((p) => ({ ...p, lastName: e.target.value }))
                }
              />
            </div>
          </div>
          <div>
            <Lbl htmlFor="aem">Email</Lbl>
            <Inp
              id="aem"
              type="email"
              value={adminForm.email}
              required
              onChange={(e) =>
                setAdminForm((p) => ({ ...p, email: e.target.value }))
              }
            />
          </div>
          <div>
            <Lbl htmlFor="apwd">Password</Lbl>
            <div className="relative">
              <Inp
                id="apwd"
                type={showAdminPwd ? 'text' : 'password'}
                value={adminForm.password}
                required
                onChange={(e) =>
                  setAdminForm((p) => ({ ...p, password: e.target.value }))
                }
              />
              <button
                type="button"
                onClick={() => setShowAdminPwd(!showAdminPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showAdminPwd ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <div>
            <Lbl htmlFor="acpwd">Confirm Password</Lbl>
            <Inp
              id="acpwd"
              type={showAdminPwd ? 'text' : 'password'}
              value={adminForm.confirmPassword}
              required
              onChange={(e) =>
                setAdminForm((p) => ({ ...p, confirmPassword: e.target.value }))
              }
            />
          </div>
          <Btn type="submit" className="w-full">
            Add Admin
          </Btn>
        </form>
      </CC>
    </Card>
  )

  const renderSecurity = () => (
    <Card className="w-full max-w-lg mx-auto">
      <CardH icon={Lock}>
        <CT>Change Password</CT>
      </CardH>
      <CC>
        <form onSubmit={handleChangePassword} className="space-y-4">
          {[
            { key: 'currentPassword', label: 'Current Password' },
            { key: 'newPassword', label: 'New Password' },
            { key: 'confirmPassword', label: 'Confirm New Password' }
          ].map((f) => (
            <div key={f.key}>
              <Lbl>{f.label}</Lbl>
              <Inp
                type="password"
                value={pwForm[f.key]}
                onChange={(e) =>
                  setPwForm((p) => ({ ...p, [f.key]: e.target.value }))
                }
                required
              />
            </div>
          ))}
          {pwMsg.text && (
            <div
              className={`flex items-center gap-2 p-3 rounded-md text-sm ${pwMsg.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
            >
              <AlertCircle className="h-4 w-4" />
              {pwMsg.text}
            </div>
          )}
          <Btn type="submit" disabled={pwLoading} className="w-full">
            {pwLoading ? 'Updating...' : 'Change Password'}
          </Btn>
        </form>
        <p className="text-xs text-gray-400 mt-4">
          You will be logged out automatically after changing your password.
        </p>
      </CC>
    </Card>
  )

  return (
    <div className="min-h-screen bg-blue-600">
      <header className="bg-white p-4 flex justify-between items-center shadow">
        <div className="flex items-center space-x-2">
          <Hospital className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-xl">Hospital Management System</span>
        </div>
        <button
          onClick={() => {
            logout()
            navigate('/')
          }}
          className="text-sm text-blue-600 border border-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-50"
        >
          Sign Out
        </button>
      </header>
      <nav className="bg-blue-700 p-3">
        <ul className="flex space-x-2 justify-center flex-wrap gap-y-2">
          {TABS.map((t) => (
            <li key={t.id}>
              <button
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-600'}`}
              >
                <t.icon className="w-4 h-4 mr-2" />
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">
          Welcome,{' '}
          {adminInfo ? `${adminInfo.firstName} ${adminInfo.lastName}` : 'Admin'}
        </h1>
        {activeTab === 'Dashboard' && renderDashboard()}
        {activeTab === 'Profile' && renderProfile()}
        {activeTab === 'Doctors' && renderManageDoctors()}
        {activeTab === 'AddDoctor' && renderAddDoctor()}
        {activeTab === 'AddAdmin' && renderAddAdmin()}
        {activeTab === 'Security' && renderSecurity()}
      </main>
    </div>
  )
}
