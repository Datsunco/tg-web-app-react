import './App.css';
import {useEffect} from "react";
import {useTelegram} from "./hooks/useTelegram";
import Header from "./components/Header/Header";
import {Route, Routes} from 'react-router-dom';
import ProductList from "./components/ProductList/ProductList";
import Form from "./components/Form/Form";

function App() {
    const {onToggleButton, tg} = useTelegram();

    useEffect(() =>{
      tg.ready();
    },[])


  return (
      <div className="App">
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"/>
          <Header  />
          <Routes>
              <Route index element={<ProductList />}/>
              <Route path={'form'} element={<Form />}/>
          </Routes>
      </div>
  );
}

export default App;
