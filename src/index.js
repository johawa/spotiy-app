import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();



let items = document.getElementById('items');
let scrollable = document.getElementById('scrollable'); 


function scrollMiddleWare(inertia = 0.85) {
    const delta = {
        x: null,
        y: null,
    };
    const abs = {
        x: 0,
        y: 0,
    };

    return function onScroll(callback) {

        function notify() {
            abs.x += delta.x;
            abs.y += delta.y;
            callback({ delta, abs });
        }

        let requestId;
        function start() {
            requestId = requestAnimationFrame(update);
        }

        function update() {
            delta.x *= inertia;
            delta.y *= inertia;
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
                delta.y = event.clientY - prevEvent.clientY;
                stop();
                notify();
            }

            if (!requestId && event.buttons !== 1) {
                start();
            }
            prevEvent = event;
        }
    }
}


scrollable.addEventListener('mousemove', scrollMiddleWare()((scroll) => {
    items.style.left = `${scroll.abs.x}`;
    Array.from(items.children).forEach(item => {
        item.style.transform = [
            /*   `rotateX(${scroll.abs.y}deg)`,
              `rotateY(${scroll.abs.x}deg)`, */
        ].join(' ');
    });
}));