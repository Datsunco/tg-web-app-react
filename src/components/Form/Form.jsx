import React, {useEffect, useState, Component} from 'react';
import './Form.css'
import {useTelegram} from "../../hooks/useTelegram";
import {useCallback} from "react";
import axios from 'axios';

const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
const token = "14ff958eb194fcb4809c2f0661a7c8a2549d4cd1";



const Form = () => {
    //document.querySelector("#address").addEventListener("change", onChangeCity);
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [build, setBuild] = useState([]);
    const [articles, setArticles] = useState([]);
    const {tg} = useTelegram();



    const onSendData = useCallback( () => {
        const data = {
            city,
            street,
            build,
        }
        tg.sendData(JSON.stringify(data));
    }, [])

    useEffect( () => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    },[])

    useEffect(() => {
        tg.MainButton.setParams({
            text: 'Отправить данные'
        })
    },[])



    useEffect(() => {
        if (!street || !city || !build){
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }, [street,city,build])

    const onChangeCity = (e, index) => {
        var city_text = '';
        //if Проверка на вызов функции из HTMl или из функции onClickAutoCompleteItem
        if (index === 1) {
            city_text = e.target.textContent;
        }
        else {
            city_text = e.target.value
        }
        //end if
        setCity(city_text);

        const promise = suggest(city_text);
        promise
            .then(function(response) {
                return response.json();
            })
            .then(function(suggestions) {
                setArticles(suggestions['suggestions']);
                console.log(suggestions['suggestions']);
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    function suggest(query) {
        var params = {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + token
            },
            body: JSON.stringify({query: query})
        }

        return fetch(url, params);
    }

    const onChangeStreet = (e) => {
        setStreet(e.target.value)
    }

    const onChangeBuild = (e) => {
        setBuild(e.target.value)
    }

    const onClickAutoCompleteItem = (e) =>{
        setCity(e.target.textContent);
        onChangeCity(e, 1);
    }

    return (
        <div className={'form'}>
            <h3>Введите ваши данные</h3>
            <input
                id={'address'}
                className={'input'}
                type="text"
                placeholder={'Город'}
                value={city}
                onChange={(e) => onChangeCity(e,0)}
            />
            <ul className={"autoComplete"}>
                {Object.keys(articles).map(article => {
                    return(
                        <li className={"autoCompleteItem"}
                            onClick={onClickAutoCompleteItem}>
                            {articles[article]['value']}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Form;