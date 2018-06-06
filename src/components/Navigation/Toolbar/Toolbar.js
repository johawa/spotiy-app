import React from 'react';

import classes from './Toolbar.css';
import Search from '../../Search/Search';
import NavigationItems from '../NavigationItems/NavigationItems';


const toolbar = (props) => (
    <header className={classes.Toolbar}>
        <nav className={classes.DesktopOnly}>
            <NavigationItems />
        </nav>

        <div className={classes.Search}>
            <Search />
        </div>
        
    </header>
);

export default toolbar;