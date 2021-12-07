import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';

import { useState } from "react";
import { useHttp } from './../../hooks/http.hook';
import { heroCreated } from '../heroesList/heroesSlice';

const HeroesAddForm = () => {

    const [heroName, setHeroName] = useState('');
    const [heroDescr, setHeroDescr] = useState('');
    const [heroElement, setHeroElement] = useState('');

    const {filters, filtersLoadingStatus} = useSelector(state => state.filters);

    const {request} = useHttp();
    const dispatch = useDispatch();

    const onSubmitHandler = (e) => {
        e.preventDefault();
        const newHero = {
            id: uuidv4(),
            name: heroName,
            description: heroDescr,
            element: heroElement
        };

        request(`http://localhost:3001/heroes`, "POST", JSON.stringify(newHero))
        .then(data => console.log(data, 'Post'))
        .then(dispatch(heroCreated(newHero)))
        .catch(err => console.log(err));

        setHeroName('');
        setHeroDescr('');
        setHeroElement('');

    };

    const renderFilters = (filters, status) => {

        if (status === "loading") {
            return <option>Загрузка элементов</option>
        } else if (status === "error") {
            return <option>Ошибка загрузки</option>
        }

        if (filters && filters.length > 0 ) {
            return filters.map(({name, label}) => {
                // eslint-disable-next-line
                if (name === 'all')  return;
                return <option key={name} value={name}>{label}</option>
            })
        }
    }

    return (
        <form className="border p-4 shadow-lg rounded" onSubmit={onSubmitHandler}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 

                    onChange={(e)=>setHeroName(e.target.value)}
                    value={heroName}

                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea

                    onChange={(e)=>setHeroDescr(e.target.value)}
                    value={heroDescr}

                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 

                    onChange={(e)=>setHeroElement(e.target.value)}
                    value={heroElement}

                    required
                    className="form-select" 
                    id="element" 
                    name="element">
                    <option value="">Я владею элементом...</option>
                    {renderFilters(filters, filtersLoadingStatus)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;