import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


// import ApolloClient from 'apollo-client';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import { ConfigProvider } from 'antd'

const client = new ApolloClient({
  uri: 'https://sse-frontend-assessment-api-823449bb66ac.herokuapp.com/graphql',
  cache: new InMemoryCache(),
});


createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <ApolloProvider client={client}>
     <ConfigProvider
          // locale={languageConstantsAntD[selectedLanguage]}
          theme={{
            token: {
              colorPrimary: '#7F56D9',
            },
            components: {
              Radio: {
                colorPrimary: '#31A1E4',
              },
              Checkbox: {
                colorPrimary: '#31A1E4',
              },
            },
          }}
        > 
         <ToastContainer
        limit={1}
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="colored"
      />
         <App /> 
        </ConfigProvider>
        </ApolloProvider>
  
  </StrictMode>,
)
