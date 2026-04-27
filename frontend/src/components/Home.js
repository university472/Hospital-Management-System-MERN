// import React from 'react';
// import { Calendar, Clipboard, Cog, DollarSign, HeartPulse, Hospital, Shield, User, Users, Clock, ChartBar, Globe } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const Button = ({ children, primary, onClick, ...props }) => (
//   <button
//     className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
//       primary
//         ? 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
//         : 'text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500'
//     }`}
//     onClick={onClick}
//     {...props}
//   >
//     {children}
//   </button>
// );

// const Card = ({ icon: Icon, title, description, primary }) => (
//   <div className={`rounded-lg shadow-md p-6 ${primary ? 'bg-white' : 'bg-gray-100'}`}>
//     <Icon className="w-8 h-8 text-blue-600 mb-4" />
//     <h3 className="text-xl font-bold mb-2">{title}</h3>
//     <p className="text-gray-600 mb-4">{description}</p>
//     <Button primary>Explore</Button>
//   </div>
// );

// const Section = ({ children, bg, height }) => (
//   <section className={`${height || 'py-20'} ${bg} content-center`}>
//     <div className="container mx-auto px-4 h-full">
//       {children}
//     </div>
//   </section>
// );

// const Home = () => {
//   const navigate = useNavigate();

//   const handleButtonClick = (route) => {
//     navigate(route);
//   };

//   return (
//     <div className="flex flex-col min-h-screen">
//       <header className="flex items-center justify-between px-6 py-4 bg-white">
//         <div className="flex items-center gap-2">
//           <Hospital className="w-8 h-8 text-blue-600" />
//           <span className="text-xl font-bold">Hospital Management System</span>
//         </div>
//         <nav className="flex items-center gap-4">
//           <Button primary onClick={() => handleButtonClick('/login')}>Login</Button>
//           <Button onClick={() => handleButtonClick('/signup')}>Sign Up</Button>
//         </nav>
//       </header>

//       <main className="flex-1">
//         <Section bg="bg-blue-600" height="min-h-[30rem]">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
//             <div>
//               <h1 className="text-5xl font-bold text-white mb-6 text-left">
//                 Streamline Your Hospital Management
//               </h1>
//               <p className="text-xl text-white mb-10 text-left">
//                 Our comprehensive hospital management system helps you optimize patient care, streamline operations,
//                 and improve overall efficiency.
//               </p>
//               <div className="flex gap-4 justify-left">
//                 <Button primary onClick={() => handleButtonClick('/login')}>Explore Features</Button>
//                 <Button onClick={() => handleButtonClick('/login')}>Appointments</Button>
//               </div>
//             </div>
//             <div className="bg-gray-200 w-full h-full min-h-[20rem] rounded-lg overflow-hidden">
//               <img src="home-1.jpeg" alt="" />
//             </div>
//           </div>
//         </Section>

//         <Section>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {[
//               { icon: User, title: "Patient Management", description: "Efficiently manage patient records, appointments, and medical history." },
//               { icon: Hospital, title: "Doctor Management", description: "Manage doctor profiles, schedules, and patient assignments." },
//               { icon: Calendar, title: "Appointment Scheduling", description: "Streamline appointment booking and management for patients and doctors." }
//             ].map((card, index) => (
//               <Card key={index} {...card} primary />
//             ))}
//           </div>
//         </Section>

//         <Section bg="bg-gray-100" height="min-h-[25rem]">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
//             <div className="bg-gray-200 w-full h-64 min-h-[18rem] rounded-lg overflow-hidden flex justify-center items-center">
//               <img src="home-2.jpeg" alt="" className='w-full'/>
//             </div>
//             <div>
//               <h2 className="text-3xl font-bold mb-4 text-left">Modernize Your Hospital Operations</h2>
//               <p className="text-xl text-gray-600 mb-8 text-left">
//                 Our hospital management system provides cutting-edge features to streamline your workflows, improve
//                 patient satisfaction, and drive better outcomes.
//               </p>
//               <div className="flex gap-4 justify-left">
//                 <Button primary onClick={() => handleButtonClick('/login')}>Explore Features</Button>
//                 <Button onClick={() => handleButtonClick('/login')}>Appointments</Button>
//               </div>
//             </div>
//           </div>
//         </Section>

//         <Section>
//           <h2 className="text-3xl font-bold mb-12 text-center">
//             Why Choose Our Hospital Management System?
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {[
//               { icon: Clipboard, title: "Improved Efficiency", description: "Our system streamlines administrative tasks, reducing paperwork and improving overall hospital efficiency." },
//               { icon: Users, title: "Enhanced Patient Care", description: "With comprehensive patient records and intelligent scheduling, our system helps you provide better care to your patients." },
//               { icon: DollarSign, title: "Cost Savings", description: "Our hospital management system helps you optimize operations and reduce overhead costs, leading to significant cost savings." },
//               { icon: HeartPulse, title: "Improved Patient Outcomes", description: "By streamlining processes and enhancing patient care, our system helps you improve overall patient outcomes and satisfaction." },
//               { icon: Shield, title: "Secure Data Management", description: "Our system ensures the security and confidentiality of all patient data, with robust encryption and access controls." },
//               { icon: Cog, title: "Customizable Solutions", description: "Our system is highly configurable, allowing you to tailor it to your specific hospital's needs and workflows." },
//               { icon: Clock, title: "Time-Saving Features", description: "Automate routine tasks and streamline workflows to save valuable time for healthcare professionals." },
//               { icon: ChartBar, title: "Advanced Analytics", description: "Gain insights into hospital operations with powerful reporting and analytics tools." },
//               { icon: Globe, title: "Scalable Infrastructure", description: "Our system grows with your organization, supporting multiple locations and expanding user bases." }
//             ].map((card, index) => (
//               <Card key={index} {...card} />
//             ))}
//           </div>
//         </Section>
//       </main>

//       <footer className="bg-white py-6 border-t">
//         <div className="container mx-auto px-4 flex items-center justify-between">
//           <p className="text-gray-600">&copy; 2024 Hospital Management. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default Home;

import React from 'react'
import {
  Calendar,
  Clipboard,
  DollarSign,
  HeartPulse,
  Hospital,
  Shield,
  User,
  Users,
  BarChart2,
  Ticket
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrimaryBtn = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-md
      text-white bg-blue-600 hover:bg-blue-700 shadow transition-colors focus:outline-none focus:ring-2 focus:ring-white"
  >
    {children}
  </button>
)

const OutlineBtn = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-md
      text-gray-700 bg-white hover:bg-gray-50 shadow transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    {children}
  </button>
)

const FeatureCard = ({ icon: Icon, title, description, primary }) => (
  <div
    className={`rounded-xl shadow-md p-6 ${primary ? 'bg-white' : 'bg-gray-50'}`}
  >
    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-blue-600" />
    </div>
    <h3 className="text-lg font-bold mb-2 text-gray-900">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
  </div>
)

const features = [
  {
    icon: Ticket,
    title: 'Smart Queue Tokens',
    description:
      'Get a token (e.g. A-07) and arrive at your exact estimated time. No more waiting rooms.'
  },
  {
    icon: User,
    title: 'Patient Profiles',
    description:
      'Full profiles with medical history, prescriptions, uploaded reports, and visit records.'
  },
  {
    icon: Hospital,
    title: 'Doctor Scheduling',
    description:
      'Configure working hours, slot durations, and max patients per day per doctor.'
  },
  {
    icon: Calendar,
    title: 'Online Booking',
    description:
      'Patients book appointments with real-time slot availability shown live.'
  },
  {
    icon: Clipboard,
    title: 'Medical Records',
    description:
      'Persistent history accessible to doctors before each visit — better-prepared consultations.'
  },
  {
    icon: DollarSign,
    title: 'Follow-up Discounts',
    description:
      'Admin-configurable follow-up discounts or free visits based on per-doctor policy.'
  },
  {
    icon: HeartPulse,
    title: 'Pre-visit Report Review',
    description:
      'Doctors see uploaded lab reports and images before the patient arrives.'
  },
  {
    icon: Shield,
    title: 'Secure & Hardened',
    description:
      'JWT auth, bcrypt hashing, rate limiting, input sanitization, XSS & injection protection.'
  },
  {
    icon: BarChart2,
    title: 'Admin Analytics',
    description:
      'Dashboard with doctor/patient overviews, occupancy rates, and accountability metrics.'
  }
]

export default function Home() {
  const navigate = useNavigate()
  const { isAuthenticated, role } = useAuth()

  const goToDashboard = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (role === 'admin') navigate('/admin')
    else if (role === 'doctor') navigate('/doctor')
    else navigate('/patient')
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Hospital className="w-7 h-7 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">
            Hospital Management System
          </span>
        </div>
        <nav className="flex items-center gap-3">
          {isAuthenticated ? (
            <PrimaryBtn onClick={goToDashboard}>My Dashboard</PrimaryBtn>
          ) : (
            <>
              <PrimaryBtn onClick={() => navigate('/login')}>Login</PrimaryBtn>
              <OutlineBtn onClick={() => navigate('/signup')}>
                Sign Up
              </OutlineBtn>
            </>
          )}
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-blue-600 py-20 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
                No More Waiting.
                <br />
                Book Your Slot Online.
              </h1>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                Our smart queue system gives every patient a unique token and an
                exact estimated time — so you arrive at the hospital exactly
                when it's your turn. Doctors review your records in advance.
                Everyone saves time.
              </p>
              <div className="flex flex-wrap gap-4">
                <PrimaryBtn onClick={() => navigate('/signup')}>
                  Get Started
                </PrimaryBtn>
                <button
                  onClick={() => navigate('/login')}
                  className="px-5 py-2.5 text-sm font-semibold rounded-md text-white border border-white hover:bg-blue-700 transition-colors"
                >
                  Login
                </button>
              </div>
            </div>
            {/* Token demo card */}
            <div className="bg-blue-800 bg-opacity-60 rounded-2xl p-8 text-white space-y-4 shadow-2xl border border-blue-500">
              <div className="text-center">
                <p className="text-blue-300 text-xs uppercase tracking-widest mb-2">
                  Your Appointment Token
                </p>
                <p className="text-8xl font-black tracking-tight">A-07</p>
                <p className="text-blue-200 text-lg mt-2">
                  Estimated Time: 2:30 PM
                </p>
              </div>
              <div className="border-t border-blue-600 pt-4 grid grid-cols-3 gap-3 text-center text-sm">
                <div>
                  <p className="text-blue-400 text-xs">Now Serving</p>
                  <p className="text-2xl font-bold">A-04</p>
                </div>
                <div>
                  <p className="text-blue-400 text-xs">Ahead of You</p>
                  <p className="text-2xl font-bold text-orange-300">2</p>
                </div>
                <div>
                  <p className="text-blue-400 text-xs">Visit Type</p>
                  <p className="text-lg font-bold text-green-300">New</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              {[
                {
                  step: '1',
                  title: 'Sign Up',
                  desc: 'Create your patient account in 30 seconds.'
                },
                {
                  step: '2',
                  title: 'Book a Slot',
                  desc: 'Choose doctor, date, and available time slot.'
                },
                {
                  step: '3',
                  title: 'Get Your Token',
                  desc: 'Receive a unique code and your exact estimated time.'
                },
                {
                  step: '4',
                  title: 'Arrive on Time',
                  desc: 'Come at your estimated time — no waiting.'
                }
              ].map((s) => (
                <div
                  key={s.step}
                  className="bg-white rounded-xl p-6 shadow-sm border"
                >
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                    {s.step}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
                  <p className="text-gray-500 text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
              Everything in One System
            </h2>
            <p className="text-center text-gray-500 mb-12">
              Built for patients, doctors, and hospital administrators.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <FeatureCard key={i} {...f} primary={i < 3} />
              ))}
            </div>
          </div>
        </section>

        {/* Role cards */}
        <section className="py-20 px-6 bg-blue-600">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              Built for Everyone
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: User,
                  role: 'Patients',
                  items: [
                    'Book appointments online',
                    'Get token & estimated time',
                    'Upload lab reports / images',
                    'View prescriptions & history',
                    'Follow-up discounts applied automatically'
                  ]
                },
                {
                  icon: Users,
                  role: 'Doctors',
                  items: [
                    "See today's patient queue live",
                    'Review reports before each visit',
                    'Add diagnoses & prescriptions',
                    'Track all treated patients',
                    'Mark queue status in real time'
                  ]
                },
                {
                  icon: Shield,
                  role: 'Admins',
                  items: [
                    'Add doctors & admins',
                    'Set working hours & slot duration',
                    'Configure follow-up policies',
                    'View hospital-wide analytics',
                    'Live queue display for any doctor'
                  ]
                }
              ].map((r) => (
                <div key={r.role} className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <r.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {r.role}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {r.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <span className="text-green-500 font-bold mt-0.5">
                          ✓
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to eliminate the waiting room?
          </h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            Join patients and doctors already using the smart queue system.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <PrimaryBtn onClick={() => navigate('/signup')}>
              Create Patient Account
            </PrimaryBtn>
            <OutlineBtn onClick={() => navigate('/login')}>Login</OutlineBtn>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Hospital className="w-5 h-5 text-blue-400" />
            <span className="text-white font-semibold">
              Hospital Management System
            </span>
          </div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} HMS. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">Secure · Fast · Reliable</p>
        </div>
      </footer>
    </div>
  )
}
