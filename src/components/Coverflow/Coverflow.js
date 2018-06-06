import React, { Component } from 'react';
import { connect } from 'react-redux';

import classes from './Coverflow.css';
import axios from '../../axios-query';
import Aux from '../../hoc/Auxilary';
import Back from './Back/Back';
import * as actionTypes from '../../Store/actions';
import backdrop from '../UI/Backdrop/Backdrop';
import Modal from '../UI/Modal/Modal';

class Coverflow extends Component {
    state = {
        clicked: false,
        smaller: false
    }

    componentDidMount() {
        this.scrollAnimation();
    }

    scrollAnimation() {
        const scrollable = document.getElementById("Coverflow")
        const items = document.getElementById("items")
        let itemsArr = []
        Array.from(items.children).forEach(item => itemsArr.push(item))
        itemsArr.map(item => item)

        let delta = {
            x: null,
        }
        let abs = {
            x: 0,
            y: 0,
        }
        //Scroll Animation
        function scrollMiddleWare(inertia = 0.8) {

            return function onScroll(callback) {

                function notify() {
                    abs.x += delta.x;
                    callback({ abs, delta });
                }

                let requestId;

                function start() {
                    requestId = requestAnimationFrame(update);
                }

                function update() {
                    delta.x *= inertia;
                    notify();
                    start();
                }

                function stop() {
                    cancelAnimationFrame(requestId);
                    requestId = null;
                }

                let prevEvent;

                return function eventHandler(event) {

                    event.preventDefault();


                    if (prevEvent && event.buttons === 1) {
                        delta.x = event.clientX - prevEvent.clientX;
                        stop();
                        notify();
                    }

                    if (prevEvent && event.type === 'dblclick') {
                        console.log('clicked')
                        callback(abs.x)
                    }

                    if (requestId === null && event.buttons === 0) {
                        start();
                    }
                    prevEvent = event;
                }
            }
        }

        items.addEventListener('dblclick',

            scrollMiddleWare(.89)((scroll, abs) => {
            //(event) => {
                //let target = event.path[2];
                //console.log(target.getBoundingClientRect()., 'clicked')
                //abs.x = -400;
                items.scrollLeft -= 400;
                //abs.x = -400;
                console.log('blabla', abs)

                //abs = items.style.left;
                //console.log('abs: ', abs);
                
            }));




        scrollable.addEventListener('mousemove',
            scrollMiddleWare(.89)((scroll) => {
                //console.log(scroll)
                items.style.left = `${scroll.abs.x}px`;


                // CALC WINDOW PROS
                let WindowMiddle = window.innerWidth * 0.5;
                let itemWidth = itemsArr[0].offsetWidth;
                let startRight = WindowMiddle + itemWidth * 0.05
                let endLeft = WindowMiddle - itemWidth
                let offset = itemWidth * 0.20 //DELETE AFTER FLIPPER FIX

                //FILTER ELEMENTS TO LEFT RIGHT AND MIDDLE
                let MiddleItem = itemsArr.filter(items => {
                    return items.getBoundingClientRect().x <= startRight + 2 && items.getBoundingClientRect().x >= endLeft - 2
                });

                let leftItems = itemsArr.filter(items => items.getBoundingClientRect().x < endLeft - offset)
                let rightItems = itemsArr.filter(items => items.getBoundingClientRect().x > startRight + offset)


                MiddleItem.map(MiddleItem => {
                    //MIDDLE rotatey(0deg)//                  
                    MiddleItem.style.zIndex = '100';
                    if (!MiddleItem.classList.contains(classes.Clicked)) {

                        MiddleItem.classList.remove(classes.Right);
                        MiddleItem.classList.remove(classes.Left);
                        MiddleItem.classList.add(classes.Middle); //ADD MIDDLE CLASS
                        //MiddleItem.classList.remove(classes.Middle)
                        //MiddleItem.classList.remove(classes.Middle);
                    }

                    else if (MiddleItem.classList.contains(classes.Clicked)) {
                        MiddleItem.classList.remove(classes.Middle)
                        MiddleItem.classList.remove(classes.Right);
                        MiddleItem.classList.remove(classes.Left);

                    }

                });

                leftItems.map((Leftitem, index) => {
                    //LEFT rotatey(20deg)//

                    const Zindex = 50 + ((index + 2) * 1);

                    Leftitem.style.zIndex = `${Zindex}`;
                    if (Leftitem.classList.contains(classes.Clicked)) {
                        Leftitem.classList.remove(classes.Clicked);
                        Leftitem.classList.remove(classes.Left);
                        Leftitem.classList.remove(classes.Middle);
                        Leftitem.classList.remove(classes.Right);
                    }

                    else if (!Leftitem.classList.contains(classes.Clicked)) {
                        Leftitem.classList.remove(classes.Clicked);
                        Leftitem.classList.remove(classes.Middle);
                        Leftitem.classList.remove(classes.Right);
                        Leftitem.classList.add(classes.Left); //ADD LEFT CLASS
                    }

                });


                rightItems.map((Rightitem, index) => {
                    //RIGHT rotateY(-20deg)//

                    const Zindex = 50 - ((index + 2) * 1);
                    Rightitem.style.zIndex = `${Zindex}`;
                    if (Rightitem.classList.contains(classes.Clicked)) {
                        Rightitem.classList.remove(classes.Clicked);
                        Rightitem.classList.remove(classes.Right);
                        Rightitem.classList.remove(classes.Middle);
                        Rightitem.classList.remove(classes.Left);
                    }

                    else if (!Rightitem.classList.contains(classes.Clicked)) {
                        Rightitem.classList.remove(classes.Clicked);
                        Rightitem.classList.remove(classes.Middle);
                        Rightitem.classList.remove(classes.Left);
                        Rightitem.classList.add(classes.Right); //ADD RIGHT CLASS
                    }

                });

            }));



    }



    getID = (e, id) => {

        this.props.selectedCoverID(id);

        axios.get('albums/' + id + '/tracks')
            .then(data => {
                //console.log(data);
                return Promise.all(data.data.items.map(function (item) {

                    return [{
                        number: item.track_number,
                        name: item.name,
                        duration: item.duration_ms,
                        uri: item.uri,
                        id: item.id
                    }]
                }))
            })

            .then(tracklist => this.props.selectedTracklist(tracklist))
        //.then(() => console.log(this.state))

    }

    test = (e) => {
        const target = e.currentTarget;

        if (target.classList.contains(classes.Middle)) {

            target.classList.add(classes.Clicked);

        }
        else {
            console.log('element not in middle')
        }
    }


    render() {



        let listElements = <div> no albums </div>

        if (this.props.imgArr) {
            listElements = this.props.imgArr.map((image, index) => {
                const id = this.props.ids[index].id

                return (

                    <Aux key={index}>
                        <li

                            className={classes.Flipper}
                            onClick={(e) => { this.test(e), this.getID(e, id) }}
                            style={{ 'zIndex': (50 - ((index + 2) * 1)) }}
                            key={index}
                            index={index}  >


                            <div className={classes.Front}>
                                <img className={classes.Image} src={image} alt="" />
                                <p className={classes.Description}
                                    style={{ 'zIndex': 101 + (index * -1) }}>
                                    {this.props.ids[index].name}
                                </p>
                            </div>

                            <Back>
                                <button onClick={() => console.log('back')}>back</button>
                            </Back>





                        </li>
                    </Aux>
                );
            })
        }

        return (
            <div className={classes.CoverflowContainer} >

                {/*    <Modal show={true}>
                    {this.props.tracklistProp}
                </Modal> */}


                <div className={classes.Coverflow} id="Coverflow">
                    <ul className={classes.Ul} id="items">

                        {listElements}

                    </ul>
                </div>



            </div>
        );
    }
}


const mapStatetoProps = state => {
    return {
        imgArr: state.imgArr,
        ids: state.ids
    };
}


const mapDispatchToProps = dispatch => {
    return {
        selectedCoverID: (id) => dispatch({ type: actionTypes.SELECTED_COVER_ID, id: id }),
        selectedTracklist: (selectedTracklist) => dispatch({ type: actionTypes.SELECTED_TRACKLIST, selectedTracklist: selectedTracklist })
    }
}


export default connect(mapStatetoProps, mapDispatchToProps)(Coverflow);