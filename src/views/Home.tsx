import Doctor from './dashBoard/DoctorDashboard'
import FrontDesk from './dashBoard/FrontDesk'
import UserDashboard from './dashBoard/UserDashboard'

const Home = () => {
    const user = localStorage.getItem('role')

    return (
        <>
            {user === 'admin' ? (
                <UserDashboard />
            ) : user === 'frontdesk' ? (
                <FrontDesk />
            ) : user === 'doctor' ? (
                <Doctor />
            ) : null}
        </>
    )
}

export default Home
