import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from './store'
import Theme from '@/components/template/Theme'
import Layout from '@/components/layouts'
import mockServer from './mock'
import appConfig from '@/configs/app.config'
import './locales'
// import Managerlayout from './ManagerLayout/Managerlayout'

const environment = process.env.NODE_ENV


if (environment !== 'production' && appConfig.enableMock) {
    mockServer({ environment })
}


function App() {
    return (
        <>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <Theme>
                        <Layout />
                      
                    </Theme>
                </BrowserRouter>
            </PersistGate>
        </Provider>
      
       </>
    )
}

export default App
