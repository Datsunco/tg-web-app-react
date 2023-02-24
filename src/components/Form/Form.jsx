import React, {useEffect, useState} from 'react';
import './Form.css'
import {useTelegram} from "../../hooks/useTelegram";

const Form = () => {
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [build, setBuild] = useState('');
    const {tg} = useTelegram();

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
        setCity(e.target.value)
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
                className={'input'}
                type="text"
                placeholder={'Город'}
                value={city}
                onChange={onChangeCity}
            />
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