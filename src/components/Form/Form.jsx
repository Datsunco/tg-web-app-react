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
    const [coordinates, setCoordinates] = useState('');
    const [articles, setArticles] = useState([]);
    const [isOpen, setIsOpen] = useState(true);
    const {tg} = useTelegram();



    const onSendData = useCallback( () => {
        const data = {
            address,
            coordinates,
        }
        tg.sendData(JSON.stringify(data));
    }, [address,coordinates])

    useEffect( () => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    },[onSendData])

    useEffect(() => {
        tg.MainButton.setParams({
            text: 'Отправить данные'
        })
    },[])



    useEffect(() => {
        if (!address && !coordinates){
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }, [address, coordinates])

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

    const onChangeCoordinates = (e) => {
        setCoordinates(e.target.value);
    }


    const onClickAutoCompleteItem = (e) =>{
        setAddress(e.target.textContent);
        setIsOpen(!isOpen);
        onChangeCity(e, 1);
    }

    const onClickInput = () =>{
        setIsOpen(true);
    }

    const onClickForm = () =>{
    }

    return (
        <div className={'form'} onClick={onClickForm} щтСДшсл>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"/>
            <h3>Введите ваши данные</h3>
            <input
                id={'address'}
                className={'input'}
                type="text"
                placeholder={'Адрес'}
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
            <input
                id={'coordinates'}
                className={'input'}
                type="text"
                placeholder={'Координаты'}
                value={coordinates}
                onChange={onChangeCoordinates}
            />
        </div>
    );
};

export default Form;