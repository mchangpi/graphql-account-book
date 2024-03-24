import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './css/output.css';
import { BrowserRouter } from 'react-router-dom';
import GridBackground from './components/ui/GridBackground.jsx';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

/* https://www.apollographql.com/docs/react/get-started#step-3-initialize-apolloclient */
const client = new ApolloClient({
  uri:
    import.meta.env.VITE_NODE_ENV === 'development'
      ? 'http://localhost:4000/graphql'
      : '/graphql', // the URL of our Graph
  /* Apollo Client uses to cache query results after fetching them. */
  cache: new InMemoryCache(),
  /* This tells Apollo Client to send cookies along with every request to the server. */
  credentials: 'include',
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <GridBackground>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </GridBackground>
    </BrowserRouter>
  </React.StrictMode>,
);
