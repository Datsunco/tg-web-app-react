import React, {useEffect, useState, Component} from 'react';
import './Form.css'
import {useTelegram} from "../../hooks/useTelegram";
import {useCallback} from "react";
import axios from 'axios';

const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
const token = "14ff958eb194fcb4809c2f0661a7c8a2549d4cd1";



const Form = () => {
    //document.querySelector("#address").addEventListener("change", onChangeCity);
    const [address, setAddress] = useState('');
    const [articles, setArticles] = useState([]);
    const [isOpen, setIsOpen] = useState(true);
    const {tg} = useTelegram();



    const onSendData = useCallback( () => {
        const data = {
            address,
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
        if (!address){
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }, [address])

    const onChangeCity = (e, index) => {
        var address_text = '';
        //if Проверка на вызов функции из HTMl или из функции onClickAutoCompleteItem
        if (index === 1) {
            address_text = e.target.textContent;
        }
        else {
            address_text = e.target.value
        }
        //end if
        setAddress(address_text);

        const promise = suggest(address_text);
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


    const onClickAutoCompleteItem = (e) =>{
        setAddress(e.target.textContent);
        setIsOpen(!isOpen);
        onChangeCity(e, 1);
    }

    const onClickInput = () =>{
        setIsOpen(true);
    }

    return (
        <div className={'form'}>
            <h3>Введите ваши данные</h3>
            <input
                id={'address'}
                className={'input'}
                type="text"
                placeholder={'Город'}
                value={address}
                onClick={onClickInput}
                onChange={(e) => onChangeCity(e,0)}
            />
            <ul className={"autoComplete"}>
                {  isOpen
                   ? Object.keys(articles).map(article => {
                    return(
                        <li className={"autoCompleteItem"}
                            onClick={onClickAutoCompleteItem}>
                            {articles[article]['value']}
                        </li>
                        );
                    })
                    :null
                }
            </ul>
        </div>
    );
};

export default Form;