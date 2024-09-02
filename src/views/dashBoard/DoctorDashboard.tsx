import React, { useState, useEffect, PureComponent } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import CountUp from 'react-countup'
import axios, { AxiosResponse } from 'axios'
import { useNavigate } from 'react-router-dom'
import { GrowShrinkTag } from '@/components/shared'
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts'
import UserDash from '../user/UserDash'
import DoctorDash from '../doctor/DoctorDash'

const localizer = momentLocalizer(moment)

const Doctor: React.FC = () => {
    const user = localStorage.getItem('role')

    const navigate = useNavigate()

    const [totalAppointment, setTotalAppointment] = useState<
        number | undefined
    >(undefined)

    const [filter, setFilter] = useState('')

    // const [filter, setFilter] = useState('');

    const handleFilterClick = async (
        selectedFilter: React.SetStateAction<string>
    ) => {
        try {
            const jwtToken = localStorage.getItem('token')
            const doctorString = localStorage.getItem('userName')
            const response = await axios.get(
                `http://localhost:8080/api/appointment/getAppointmentBYFacilityAndDoc?&doctor=${doctorString}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            )
            console.log(response)

            if (response.status === 200) {
                setAppointments(response.data) // Assuming the API response structure matches your Appointment type
                setFilter(selectedFilter)
            } else {
                console.error(
                    'Error retrieving appointments:',
                    response.statusText
                )
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }

    return (
        <>
            <div className="w-full flex justify-center my-8 mt-12 ">
                <div className="heading text-center">
                    <h6>{}</h6>
                    <h4></h4>
                </div>
                <div className=" flex flex-col lg:flex-row justify-center  mt-2 gap-4">
                    <div data-aos="fade-up" data-aos-duration="1000">
                        <div className=" group h-[3.5rem] gap-3  flex cursor-pointer rounded-2xl bg-white  border border-gray-300 py-0 px-2 lg:md:w-fit w-fit hover:border-secondary hover:bg-slate-100 shadow-xl items-center">
                            <div>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 26 26"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="text-secondary transition dark:group-hover:text-black"
                                >
                                    <g clipPath="url(#clip0_6_2631)">
                                        <path
                                            opacity="0.3"
                                            d="M4.2757 15.6078C4.27493 15.6078 4.27425 15.6084 4.27403 15.6091C4.06737 16.3065 3.94528 17.0263 3.9104 17.7528L3.9 18.2V25C3.9 25.5523 3.45228 26 2.9 26H1C0.447715 26 1.18712e-07 25.5523 1.18712e-07 25V20.15C-0.000255849 19.0289 0.413437 17.9471 1.16173 17.1122C1.91001 16.2773 2.94021 15.7481 4.0547 15.626L4.2757 15.6078ZM22.0225 17.0047C21.9324 16.3161 22.4694 15.6613 23.1157 15.9157C23.7351 16.1595 24.299 16.5384 24.7632 17.0317C25.5575 17.8757 25.9998 18.991 26 20.15V25.0001C26 25.5523 25.5523 26 25 26H23.1C22.5477 26 22.1 25.5523 22.1 25V18.2C22.1 17.7948 22.0737 17.3958 22.0225 17.0047ZM4.55 7.80005C5.41195 7.80005 6.2386 8.14246 6.8481 8.75195C7.45759 9.36145 7.8 10.1881 7.8 11.05C7.8 11.912 7.45759 12.7387 6.8481 13.3481C6.2386 13.9576 5.41195 14.3 4.55 14.3C3.68805 14.3 2.8614 13.9576 2.2519 13.3481C1.64241 12.7387 1.3 11.912 1.3 11.05C1.3 10.1881 1.64241 9.36145 2.2519 8.75195C2.8614 8.14246 3.68805 7.80005 4.55 7.80005ZM21.45 7.80005C22.312 7.80005 23.1386 8.14246 23.7481 8.75195C24.3576 9.36145 24.7 10.1881 24.7 11.05C24.7 11.912 24.3576 12.7387 23.7481 13.3481C23.1386 13.9576 22.312 14.3 21.45 14.3C20.588 14.3 19.7614 13.9576 19.1519 13.3481C18.5424 12.7387 18.2 11.912 18.2 11.05C18.2 10.1881 18.5424 9.36145 19.1519 8.75195C19.7614 8.14246 20.588 7.80005 21.45 7.80005Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M13 11.7C14.7239 11.7 16.3772 12.3848 17.5962 13.6038C18.8152 14.8228 19.5 16.4761 19.5 18.2V25C19.5 25.5523 19.0523 26 18.5 26H7.5C6.94772 26 6.5 25.5523 6.5 25V18.2C6.5 16.4761 7.18482 14.8228 8.40381 13.6038C9.62279 12.3848 11.2761 11.7 13 11.7ZM13 0C14.3791 0 15.7018 0.547856 16.677 1.52304C17.6521 2.49823 18.2 3.82087 18.2 5.2C18.2 6.57913 17.6521 7.90177 16.677 8.87696C15.7018 9.85214 14.3791 10.4 13 10.4C11.6209 10.4 10.2982 9.85214 9.32304 8.87696C8.34786 7.90177 7.8 6.57913 7.8 5.2C7.8 3.82087 8.34786 2.49823 9.32304 1.52304C10.2982 0.547856 11.6209 0 13 0Z"
                                            fill="currentColor"
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_6_2631">
                                            <rect
                                                width="20"
                                                height="20"
                                                fill="white"
                                            />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                            <div className="">
                                <span className="font-bold text-black transition dark:text-gray dark:group-hover:text-black">
                                    Today's Appointments
                                </span>
                            </div>
                            <h4 className=" text-xl font-black leading-none transition dark:text-white dark:group-hover:text-black">
                                <CountUp
                                    start={0}
                                    end={{ totalAppointment }}
                                    duration={4}
                                    // suffix="%"
                                ></CountUp>
                            </h4>
                            <GrowShrinkTag value={56} suffix="%" />
                        </div>
                    </div>

                    <div data-aos="fade-up" data-aos-duration="1000">
                        <div className=" group h-[3.5rem] gap-2  flex cursor-pointer rounded-2xl bg-white  border border-gray-300 py-0 px-2 lg:md:w-fit w-fit hover:border-secondary hover:bg-slate-100 shadow-xl items-center">
                            <div>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 26 26"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="text-secondary transition dark:group-hover:text-black"
                                >
                                    <g clipPath="url(#clip0_6_2631)">
                                        <path
                                            opacity="0.3"
                                            d="M4.2757 15.6078C4.27493 15.6078 4.27425 15.6084 4.27403 15.6091C4.06737 16.3065 3.94528 17.0263 3.9104 17.7528L3.9 18.2V25C3.9 25.5523 3.45228 26 2.9 26H1C0.447715 26 1.18712e-07 25.5523 1.18712e-07 25V20.15C-0.000255849 19.0289 0.413437 17.9471 1.16173 17.1122C1.91001 16.2773 2.94021 15.7481 4.0547 15.626L4.2757 15.6078ZM22.0225 17.0047C21.9324 16.3161 22.4694 15.6613 23.1157 15.9157C23.7351 16.1595 24.299 16.5384 24.7632 17.0317C25.5575 17.8757 25.9998 18.991 26 20.15V25.0001C26 25.5523 25.5523 26 25 26H23.1C22.5477 26 22.1 25.5523 22.1 25V18.2C22.1 17.7948 22.0737 17.3958 22.0225 17.0047ZM4.55 7.80005C5.41195 7.80005 6.2386 8.14246 6.8481 8.75195C7.45759 9.36145 7.8 10.1881 7.8 11.05C7.8 11.912 7.45759 12.7387 6.8481 13.3481C6.2386 13.9576 5.41195 14.3 4.55 14.3C3.68805 14.3 2.8614 13.9576 2.2519 13.3481C1.64241 12.7387 1.3 11.912 1.3 11.05C1.3 10.1881 1.64241 9.36145 2.2519 8.75195C2.8614 8.14246 3.68805 7.80005 4.55 7.80005ZM21.45 7.80005C22.312 7.80005 23.1386 8.14246 23.7481 8.75195C24.3576 9.36145 24.7 10.1881 24.7 11.05C24.7 11.912 24.3576 12.7387 23.7481 13.3481C23.1386 13.9576 22.312 14.3 21.45 14.3C20.588 14.3 19.7614 13.9576 19.1519 13.3481C18.5424 12.7387 18.2 11.912 18.2 11.05C18.2 10.1881 18.5424 9.36145 19.1519 8.75195C19.7614 8.14246 20.588 7.80005 21.45 7.80005Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M13 11.7C14.7239 11.7 16.3772 12.3848 17.5962 13.6038C18.8152 14.8228 19.5 16.4761 19.5 18.2V25C19.5 25.5523 19.0523 26 18.5 26H7.5C6.94772 26 6.5 25.5523 6.5 25V18.2C6.5 16.4761 7.18482 14.8228 8.40381 13.6038C9.62279 12.3848 11.2761 11.7 13 11.7ZM13 0C14.3791 0 15.7018 0.547856 16.677 1.52304C17.6521 2.49823 18.2 3.82087 18.2 5.2C18.2 6.57913 17.6521 7.90177 16.677 8.87696C15.7018 9.85214 14.3791 10.4 13 10.4C11.6209 10.4 10.2982 9.85214 9.32304 8.87696C8.34786 7.90177 7.8 6.57913 7.8 5.2C7.8 3.82087 8.34786 2.49823 9.32304 1.52304C10.2982 0.547856 11.6209 0 13 0Z"
                                            fill="currentColor"
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_6_2631">
                                            <rect
                                                width="20"
                                                height="20"
                                                fill="white"
                                            />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                            <div className="">
                                <span className="font-bold text-black transition dark:text-gray dark:group-hover:text-black">
                                    {/* Availability of Doctors{' '} */}
                                </span>
                            </div>
                            <h4 className=" text-xl font-black leading-none transition dark:text-white dark:group-hover:text-black">
                                <CountUp
                                    start={0}
                                    end={25}
                                    duration={4}
                                    suffix="%"
                                ></CountUp>
                            </h4>
                            <GrowShrinkTag value={35} suffix="%" />
                        </div>
                    </div>
                    <div data-aos="fade-up" data-aos-duration="1000">
                        <div className="group h-[3.5rem] gap-2  flex cursor-pointer rounded-2xl bg-white  border border-gray-300 py-0 px-2 lg:md:w-fit w-fit hover:border-secondary hover:bg-slate-100 shadow-xl items-center">
                            <div>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 26 26"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="text-secondary transition dark:group-hover:text-black"
                                >
                                    <g clipPath="url(#clip0_6_2631)">
                                        <path
                                            opacity="0.3"
                                            d="M4.2757 15.6078C4.27493 15.6078 4.27425 15.6084 4.27403 15.6091C4.06737 16.3065 3.94528 17.0263 3.9104 17.7528L3.9 18.2V25C3.9 25.5523 3.45228 26 2.9 26H1C0.447715 26 1.18712e-07 25.5523 1.18712e-07 25V20.15C-0.000255849 19.0289 0.413437 17.9471 1.16173 17.1122C1.91001 16.2773 2.94021 15.7481 4.0547 15.626L4.2757 15.6078ZM22.0225 17.0047C21.9324 16.3161 22.4694 15.6613 23.1157 15.9157C23.7351 16.1595 24.299 16.5384 24.7632 17.0317C25.5575 17.8757 25.9998 18.991 26 20.15V25.0001C26 25.5523 25.5523 26 25 26H23.1C22.5477 26 22.1 25.5523 22.1 25V18.2C22.1 17.7948 22.0737 17.3958 22.0225 17.0047ZM4.55 7.80005C5.41195 7.80005 6.2386 8.14246 6.8481 8.75195C7.45759 9.36145 7.8 10.1881 7.8 11.05C7.8 11.912 7.45759 12.7387 6.8481 13.3481C6.2386 13.9576 5.41195 14.3 4.55 14.3C3.68805 14.3 2.8614 13.9576 2.2519 13.3481C1.64241 12.7387 1.3 11.912 1.3 11.05C1.3 10.1881 1.64241 9.36145 2.2519 8.75195C2.8614 8.14246 3.68805 7.80005 4.55 7.80005ZM21.45 7.80005C22.312 7.80005 23.1386 8.14246 23.7481 8.75195C24.3576 9.36145 24.7 10.1881 24.7 11.05C24.7 11.912 24.3576 12.7387 23.7481 13.3481C23.1386 13.9576 22.312 14.3 21.45 14.3C20.588 14.3 19.7614 13.9576 19.1519 13.3481C18.5424 12.7387 18.2 11.912 18.2 11.05C18.2 10.1881 18.5424 9.36145 19.1519 8.75195C19.7614 8.14246 20.588 7.80005 21.45 7.80005Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M13 11.7C14.7239 11.7 16.3772 12.3848 17.5962 13.6038C18.8152 14.8228 19.5 16.4761 19.5 18.2V25C19.5 25.5523 19.0523 26 18.5 26H7.5C6.94772 26 6.5 25.5523 6.5 25V18.2C6.5 16.4761 7.18482 14.8228 8.40381 13.6038C9.62279 12.3848 11.2761 11.7 13 11.7ZM13 0C14.3791 0 15.7018 0.547856 16.677 1.52304C17.6521 2.49823 18.2 3.82087 18.2 5.2C18.2 6.57913 17.6521 7.90177 16.677 8.87696C15.7018 9.85214 14.3791 10.4 13 10.4C11.6209 10.4 10.2982 9.85214 9.32304 8.87696C8.34786 7.90177 7.8 6.57913 7.8 5.2C7.8 3.82087 8.34786 2.49823 9.32304 1.52304C10.2982 0.547856 11.6209 0 13 0Z"
                                            fill="currentColor"
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_6_2631">
                                            <rect
                                                width="20"
                                                height="20"
                                                fill="white"
                                            />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                            <div className="">
                                <span className="font-bold text-black transition dark:text-gray dark:group-hover:text-black">
                                    Total Patients
                                </span>
                            </div>
                            <h4 className=" text-xl font-black leading-none transition dark:text-white dark:group-hover:text-black">
                                <CountUp
                                    start={0}
                                    end={40}
                                    duration={4}
                                    suffix="%"
                                ></CountUp>{' '}
                            </h4>
                            <GrowShrinkTag value={-38} suffix="%" />
                        </div>
                    </div>
                </div>
            </div>

            <h2 className="text-lg font-semibold text-[#107dc7]">
                Appointments
            </h2>

            <div className="w-full border-collapse border border-gray-300 my-5 shadow-lg px-1 py-1 rounded-lg">
                {user === 'frontdesk' || user === 'admin' ? (
                    <UserDash />
                ) : (
                    <DoctorDash />
                )}
            </div>

            {/* <div className='container my-8'>
        <div className="ml-2 w-85 h-120 cursor-pointer items-baseline rounded-2xl border border-white bg-white py-2 px-2 transition duration-500 hover:border-secondary hover:bg-secondary/10 dark:border-transparent dark:bg-gray-dark dark:hover:bg-secondary shadow-xl">
          <PieChart width={800} height={400} onMouseEnter={this?.onPieEnter}>
            <Pie
              data={data}
              cx={160}
              cy={200}
              innerRadius={80}
              outerRadius={120}
              fill="#8884d8"
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

          </PieChart>
        </div>
      </div>
  */}
 
 
 
 
    </>


  )
}

export default Doctor
