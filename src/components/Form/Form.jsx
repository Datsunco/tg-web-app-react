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

    const onChangeCity = (e) => {
        setCity(e.target.value);
        var obj;
        var promise = suggest(e.target.value);
        promise
            .then(function(response) {
                return response.json();
            })
            .then(function(suggestions) {
                //document.querySelector("#suggestions").innerHTML = JSON.stringify(suggestions, null, 4);
                setBuild(suggestions['suggestions']);
                //setBuild(JSON.parse(suggestions,null));
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

    return (
        <div className={'form'}>
            <h3>Введите ваши данные</h3>
            <input
                id={'address'}
                className={'input'}
                type="text"
                placeholder={'Город'}
                value={city}
                onChange={onChangeCity}
            />
            <div>
                {Object.keys(build).map(b => {
                    return(
                    //console.log(build[b]['value'])
                        <p>{build[b]['value']}</p>
                    );
                })}
            </div>
            <input
                className={'input'}
                type="text"
                placeholder={'Улица'}
                value={street}
                onChange={onChangeStreet}
            />
            <input
                className={'input'}
                type="text"
                placeholder={'Дом'}
                value={build}
                onChange={onChangeBuild}
            />
        </div>
    );
};

export default Form;